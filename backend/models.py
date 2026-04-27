"""
Pydantic models — request/response schemas.
"""

from typing import Optional
from pydantic import BaseModel, field_validator


class Expense(BaseModel):
    category: str
    amount: float

    @field_validator("amount")
    @classmethod
    def amount_must_be_positive(cls, v):
        if v < 0:
            raise ValueError("Expense amount cannot be negative")
        return v


class FinancialData(BaseModel):
    income: float
    expenses: list[Expense]
    current_savings: float = 0.0
    goal_amount: Optional[float] = None
    goal_label: Optional[str] = "Financial Goal"
    timeframe_months: Optional[int] = None

    @field_validator("income")
    @classmethod
    def income_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Income must be greater than zero")
        return v


class AffordabilityRequest(BaseModel):
    income: float
    expenses: list[Expense]
    current_savings: float
    purchase_price: float
    purchase_label: Optional[str] = "Purchase"
    months_willing_to_wait: Optional[int] = None


class AIAdviceRequest(BaseModel):
    question: str
    financial_context: dict


class InsightsRequest(BaseModel):
    financial_context: dict


class AIAdviceResponse(BaseModel):
    answer: str
    question: str
