"""
Pure Python financial calculations.
No AI, no rounding surprises — just math.
"""

from typing import Optional


def calc_total_expenses(expenses: list[dict]) -> float:
    """Sum all expense amounts."""
    return sum(e["amount"] for e in expenses)


def calc_monthly_savings(income: float, total_expenses: float) -> float:
    """Monthly savings = income - total expenses."""
    return income - total_expenses


def calc_time_to_goal(
    goal_amount: float,
    current_savings: float,
    monthly_savings: float,
) -> Optional[float]:
    """
    How many months until the user reaches their goal?
    Returns None if monthly_savings <= 0 (never reachable).
    """
    if monthly_savings <= 0:
        return None
    remaining = goal_amount - current_savings
    if remaining <= 0:
        return 0.0  # Already reached
    return remaining / monthly_savings


def calc_required_monthly_savings(
    goal_amount: float,
    current_savings: float,
    timeframe_months: Optional[int],
) -> Optional[float]:
    """
    How much must the user save per month to hit their goal in time?
    Returns None if no timeframe is given.
    """
    if timeframe_months is None or timeframe_months <= 0:
        return None
    remaining = goal_amount - current_savings
    if remaining <= 0:
        return 0.0
    return remaining / timeframe_months


def calc_savings_rate(income: float, monthly_savings: float) -> float:
    """Savings rate as a percentage of income."""
    if income <= 0:
        return 0.0
    return (monthly_savings / income) * 100


def calc_affordability(
    purchase_price: float,
    current_savings: float,
    monthly_savings: float,
    months_willing_to_wait: Optional[int] = None,
) -> dict:
    """
    Can the user afford a purchase?
    Returns: can_afford_now, months_to_afford, projected_savings_at_deadline
    """
    can_afford_now = current_savings >= purchase_price
    months_to_afford = None
    if not can_afford_now and monthly_savings > 0:
        remaining = purchase_price - current_savings
        months_to_afford = remaining / monthly_savings

    projected = None
    if months_willing_to_wait is not None:
        projected = current_savings + (monthly_savings * months_willing_to_wait)

    return {
        "can_afford_now": can_afford_now,
        "months_to_afford": months_to_afford,
        "projected_savings_at_deadline": projected,
        "can_afford_at_deadline": (
            projected >= purchase_price if projected is not None else None
        ),
    }


def calc_expense_breakdown(expenses: list[dict]) -> list[dict]:
    """
    Returns each expense with its percentage of total.
    """
    total = calc_total_expenses(expenses)
    breakdown = []
    for e in expenses:
        breakdown.append(
            {
                "category": e["category"],
                "amount": e["amount"],
                "percentage": round((e["amount"] / total * 100), 1) if total > 0 else 0,
            }
        )
    # Sort by amount descending
    return sorted(breakdown, key=lambda x: x["amount"], reverse=True)


def build_full_analysis(data: dict) -> dict:
    """
    Master function — runs all calculations and returns a structured result dict.
    This dict is passed to the AI as context.
    """
    income = data["income"]
    expenses = data["expenses"]
    current_savings = data.get("current_savings", 0)
    goal_amount = data.get("goal_amount")
    goal_label = data.get("goal_label", "Financial Goal")
    timeframe_months = data.get("timeframe_months")

    total_expenses = calc_total_expenses(expenses)
    monthly_savings = calc_monthly_savings(income, total_expenses)
    savings_rate = calc_savings_rate(income, monthly_savings)
    breakdown = calc_expense_breakdown(expenses)

    result = {
        "income": income,
        "total_expenses": total_expenses,
        "monthly_savings": monthly_savings,
        "savings_rate": round(savings_rate, 1),
        "current_savings": current_savings,
        "expense_breakdown": breakdown,
        "goal_label": goal_label,
    }

    if goal_amount:
        result["goal_amount"] = goal_amount
        result["months_to_goal_at_current_rate"] = calc_time_to_goal(
            goal_amount, current_savings, monthly_savings
        )
        result["required_monthly_savings"] = calc_required_monthly_savings(
            goal_amount, current_savings, timeframe_months
        )
        result["timeframe_months"] = timeframe_months
        result["shortfall_per_month"] = (
            round(result["required_monthly_savings"] - monthly_savings, 2)
            if result["required_monthly_savings"] is not None
            else None
        )

    return result
