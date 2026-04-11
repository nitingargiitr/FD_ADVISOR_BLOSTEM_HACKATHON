import json
import os
from math import pow

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANKS_PATH = os.path.join(BASE_DIR, "data", "banks.json")


def _load_banks():
    with open(BANKS_PATH, encoding="utf-8") as f:
        return json.load(f)


def list_banks():
    return _load_banks()


def maturity_quarterly(principal: float, rate_pa_percent: float, tenor_months: int) -> tuple[float, float]:
    """Indian FDs often compound quarterly; nominal annual rate."""
    years = tenor_months / 12.0
    r = rate_pa_percent / 100.0
    n = 4
    amount = principal * pow(1 + r / n, n * years)
    interest = amount - principal
    return round(amount, 2), round(interest, 2)


def tds_note(interest: float, is_senior: bool) -> str:
    threshold = 50000 if is_senior else 40000
    if interest <= threshold:
        return (
            "TDS may not apply if total interest from this bank stays below typical thresholds; "
            "confirm with your bank and CA. Rules depend on PAN and total interest."
        )
    return (
        "If total interest from the bank crosses thresholds, TDS may apply (commonly 10% with PAN). "
        "This is illustrative only — verify with the bank."
    )


def calculate_fd(principal: float, rate_pa: float, tenor_months: int, is_senior: bool):
    maturity, interest = maturity_quarterly(principal, rate_pa, tenor_months)
    return {
        "maturity_amount": maturity,
        "interest_earned": interest,
        "tds_note": tds_note(interest, is_senior),
        "compounding": "quarterly",
    }
