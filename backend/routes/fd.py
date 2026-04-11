from fastapi import APIRouter

from models.schemas import FDCalculateRequest, FDCalculateResponse
from services import fd_service, jargon_service

router = APIRouter(prefix="/api/fd", tags=["fd"])


@router.get("/banks")
def get_banks():
    return fd_service.list_banks()


@router.get("/jargon")
def get_jargon():
    return jargon_service.all_jargon()


@router.post("/calculate", response_model=FDCalculateResponse)
def post_calculate(body: FDCalculateRequest):
    out = fd_service.calculate_fd(
        body.principal,
        body.rate_pa,
        body.tenor_months,
        body.is_senior,
    )
    return FDCalculateResponse(**out)
