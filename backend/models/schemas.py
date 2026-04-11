from typing import Any, Literal

from pydantic import BaseModel, Field

LanguageCode = Literal["hi", "bho", "ta", "en"]


class ChatRequest(BaseModel):
    message: str = ""
    language: LanguageCode = "hi"
    session_id: str = Field(..., min_length=4, max_length=64)
    eli5_of: str | None = None


class ChatResponse(BaseModel):
    reply: str
    session_id: str
    jargon_terms: list[str] = []


class FDCalculateRequest(BaseModel):
    principal: float = Field(..., gt=0)
    rate_pa: float = Field(..., ge=0, le=30)
    tenor_months: int = Field(..., ge=1, le=120)
    is_senior: bool = False


class FDCalculateResponse(BaseModel):
    maturity_amount: float
    interest_earned: float
    tds_note: str
    compounding: str = "quarterly"


class BookingStartRequest(BaseModel):
    language: LanguageCode = "hi"


class BookingStartResponse(BaseModel):
    booking_session_id: str
    step: str
    prompt: str


class BookingStepRequest(BaseModel):
    booking_session_id: str
    language: LanguageCode = "hi"
    value: Any


class BookingStepResponse(BaseModel):
    step: str
    prompt: str
    summary: dict[str, Any] | None = None
    done: bool = False
