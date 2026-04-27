"""
API routes — all endpoints return structured JSON.
Math lives in calculations.py, AI lives in ai_advisor.py,
insights live in insights.py, history in database.py.
"""

from datetime import datetime
from fastapi import APIRouter, HTTPException
from calculations import (
    build_full_analysis,
    calc_total_expenses,
    calc_monthly_savings,
    calc_affordability,
)
from models import (
    FinancialData,
    AffordabilityRequest,
    AIAdviceRequest,
    AIAdviceResponse,
    InsightsRequest,
)
from ai_advisor import get_ai_advice
from insights import generate_insights
from database import save_month, get_previous_month_expenses, get_history

router = APIRouter()


@router.post("/calculate")
async def calculate(data: FinancialData):
    try:
        result = build_full_analysis(data.model_dump())
        now = datetime.now()
        save_month(
            year=now.year,
            month=now.month,
            income=data.income,
            expenses=[e.model_dump() for e in data.expenses],
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/goal-analysis")
async def goal_analysis(data: FinancialData):
    if not data.goal_amount:
        raise HTTPException(status_code=400, detail="goal_amount is required")
    result = build_full_analysis(data.model_dump())
    return {
        "goal_label": result["goal_label"],
        "goal_amount": result["goal_amount"],
        "current_savings": result["current_savings"],
        "remaining": result["goal_amount"] - result["current_savings"],
        "monthly_savings": result["monthly_savings"],
        "months_to_goal_at_current_rate": result.get("months_to_goal_at_current_rate"),
        "timeframe_months": result.get("timeframe_months"),
        "required_monthly_savings": result.get("required_monthly_savings"),
        "shortfall_per_month": result.get("shortfall_per_month"),
    }


@router.post("/affordability")
async def affordability(data: AffordabilityRequest):
    expenses_list = [e.model_dump() for e in data.expenses]
    total_expenses = calc_total_expenses(expenses_list)
    monthly_savings = calc_monthly_savings(data.income, total_expenses)
    result = calc_affordability(
        purchase_price=data.purchase_price,
        current_savings=data.current_savings,
        monthly_savings=monthly_savings,
        months_willing_to_wait=data.months_willing_to_wait,
    )
    return {
        "purchase_label": data.purchase_label,
        "purchase_price": data.purchase_price,
        "current_savings": data.current_savings,
        "monthly_savings": monthly_savings,
        **result,
    }


@router.post("/insights")
async def get_insights(data: InsightsRequest):
    now = datetime.now()
    prev_expenses = get_previous_month_expenses(now.year, now.month)
    history = get_history(limit=6)
    insight_list = generate_insights(
        current=data.financial_context,
        history=history,
        prev_expenses=prev_expenses,
    )
    return {
        "insights": insight_list,
        "history_months_available": len(history),
    }


@router.get("/history")
async def get_spending_history():
    history = get_history(limit=6)
    return {"history": history}


@router.post("/ai-advice", response_model=AIAdviceResponse)
async def ai_advice(data: AIAdviceRequest):
    if not data.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    answer = await get_ai_advice(data.question, data.financial_context)
    return AIAdviceResponse(answer=answer, question=data.question)
