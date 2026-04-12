from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from models.database import ChatMessage, get_db
from models.schemas import ChatRequest, ChatResponse
from services import jargon_service
from services.llm_service import advisor_reply

router = APIRouter(prefix="/api/chat", tags=["chat"])


def _history_snippet(db: Session, session_id: str, limit: int = 8) -> str:
    rows = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.id.desc())
        .limit(limit)
        .all()
    )
    rows = list(reversed(rows))
    lines = [f"{m.role}: {m.content}" for m in rows]
    return "\n".join(lines) if lines else ""


@router.post("", response_model=ChatResponse)
def post_chat(body: ChatRequest, db: Session = Depends(get_db)):
    if not body.eli5_of and not (body.message or "").strip():
        raise HTTPException(status_code=400, detail="message or eli5_of required")

    history = _history_snippet(db, body.session_id)

    if not body.eli5_of:
        db.add(
            ChatMessage(
                session_id=body.session_id,
                role="user",
                content=body.message.strip(),
            )
        )
        db.commit()
    try:
        reply = advisor_reply(
            (body.message or "").strip(),
            body.language,
            history_snippet=history if not body.eli5_of else None,
            eli5_of=body.eli5_of,
        )
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LLM error: {e!s}") from e

    combined = ((body.message or "") + " " + reply) if not body.eli5_of else reply
    jargon_terms = jargon_service.detect_jargon(combined)

    db.add(
        ChatMessage(
            session_id=body.session_id,
            role="assistant",
            content=reply,
        )
    )
    db.commit()

    return ChatResponse(
        reply=reply,
        session_id=body.session_id,
        jargon_terms=jargon_terms,
    )
