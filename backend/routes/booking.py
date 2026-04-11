import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from models.database import BookingState, get_db
from models.schemas import (
    BookingStartRequest,
    BookingStartResponse,
    BookingStepRequest,
    BookingStepResponse,
)
from services import fd_service

router = APIRouter(prefix="/api/booking", tags=["booking"])

PROMPTS = {
    "bank": {
        "hi": "कौन सा बैंक चुनेंगे? नीचे दिए स्लग में से एक टाइप करें (जैसे suryoday, sbi)।",
        "bho": "कवन बैंक चुनब? स्लग में से एक लिखीं (जइसे suryoday, sbi)।",
        "ta": "எந்த வங்கி? slug ஐ தட்டச்சு செய்யவும் (எ.கா. suryoday, sbi).",
        "en": "Which bank? Type one slug (e.g. suryoday, sbi).",
    },
    "amount": {
        "hi": "कितने रुपये जमा करना चाहते हैं? संख्या में बताएं।",
        "bho": "कतना रुपया जमा करब? संख्या में बताईं।",
        "ta": "எவ்வளவு ரூபாய்? எண்ணாக உள்ளிடவும்.",
        "en": "How many rupees do you want to deposit? Enter a number.",
    },
    "tenor": {
        "hi": "कितने महीने के लिए? 6, 12, या 24 में से चुनें।",
        "bho": "कतना महिना खातिर? 6, 12, या 24 में से।",
        "ta": "எத்தனை மாதங்கள்? 6, 12, அல்லது 24.",
        "en": "For how many months? Choose 6, 12, or 24.",
    },
    "confirm": {
        "hi": "पुष्टि करें: हाँ लिखें तो बुकिंग पूरी मानी जाएगी (डेमो)।",
        "bho": "पुष्टि: हाँ लिखीं त बुकिंग पूरा (डेमो)।",
        "ta": "உறுதிப்படுத்த: ஆம் என்றால் முன்பதிவு முடிந்தது (டெமோ).",
        "en": "Confirm: type yes to finish the simulated booking.",
    },
    "done": {
        "hi": "धन्यवाद! यह एक डेमो था — असली FD के लिए बैंक/ऐप पर जाएं।",
        "bho": "धन्यवाद! ई डेमो रहल — असली FD खातिर बैंक/ऐप पर जाईं।",
        "ta": "நன்றி! இது டெமோ — உண்மை FD-க்கு வங்கி/ஆப்பைப் பயன்படுத்தவும்.",
        "en": "Thanks! This was a demo — use your bank or app for a real FD.",
    },
}


def _p(step: str, lang: str) -> str:
    block = PROMPTS.get(step, PROMPTS["bank"])
    return block.get(lang) or block["en"]


def _bank_slugs():
    return {b["slug"] for b in fd_service.list_banks()}


@router.post("/start", response_model=BookingStartResponse)
def start_booking(body: BookingStartRequest, db: Session = Depends(get_db)):
    bid = uuid.uuid4().hex[:16]
    row = BookingState(
        booking_session_id=bid,
        language=body.language,
        step="bank",
    )
    db.add(row)
    db.commit()
    return BookingStartResponse(
        booking_session_id=bid,
        step="bank",
        prompt=_p("bank", body.language),
    )


@router.post("/step", response_model=BookingStepResponse)
def booking_step(body: BookingStepRequest, db: Session = Depends(get_db)):
    row = db.get(BookingState, body.booking_session_id)
    if not row:
        raise HTTPException(status_code=404, detail="Unknown booking_session_id")

    lang = body.language or row.language
    row.language = lang
    step = row.step

    if step == "bank":
        slug = str(body.value).strip().lower()
        if slug not in _bank_slugs():
            raise HTTPException(status_code=400, detail="Invalid bank slug")
        row.bank_slug = slug
        row.step = "amount"
    elif step == "amount":
        try:
            amt = float(body.value)
        except (TypeError, ValueError) as e:
            raise HTTPException(status_code=400, detail="Amount must be a number") from e
        if amt < 1000:
            raise HTTPException(status_code=400, detail="Minimum 1000 for demo")
        row.principal = amt
        row.step = "tenor"
    elif step == "tenor":
        try:
            months = int(body.value)
        except (TypeError, ValueError) as e:
            raise HTTPException(status_code=400, detail="Tenor must be 6, 12, or 24") from e
        if months not in (6, 12, 24):
            raise HTTPException(status_code=400, detail="Tenor must be 6, 12, or 24")
        row.tenor_months = months
        row.step = "confirm"
    elif step == "confirm":
        ans = str(body.value).strip().lower()
        if ans not in ("yes", "y", "haan", "हाँ", "हां", "ஆம்", "ஆமாம்", "ok", "ठीक"):
            raise HTTPException(status_code=400, detail="Please confirm with yes/haan/ஆம்")
        row.step = "done"
    else:
        return BookingStepResponse(step="done", prompt=_p("done", lang), summary=None, done=True)

    db.add(row)
    db.commit()

    if row.step == "done":
        summary: dict[str, Any] = {
            "bank": row.bank_slug,
            "principal": row.principal,
            "tenor_months": row.tenor_months,
        }
        return BookingStepResponse(
            step="done",
            prompt=_p("done", lang),
            summary=summary,
            done=True,
        )

    return BookingStepResponse(
        step=row.step,
        prompt=_p(row.step, lang),
        summary={
            "bank": row.bank_slug,
            "principal": row.principal,
            "tenor_months": row.tenor_months,
        },
        done=False,
    )
