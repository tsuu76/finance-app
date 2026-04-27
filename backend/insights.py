"""
Rule-based insights engine — no AI involved.
Compares current data against history to generate actionable text insights.
"""

from typing import Optional


def generate_insights(current: dict, history: list[dict], prev_expenses: list[dict]) -> list[dict]:
    """
    Returns a list of insight objects:
    { "type": "warning|tip|success|info", "icon": "...", "message": "..." }

    Rules applied:
    - Category-level spend vs previous month
    - Savings rate health
    - Goal feasibility
    - Daily spending target to hit goal
    - Emergency fund check
    """
    insights = []

    income = current.get("income", 0)
    total_expenses = current.get("total_expenses", 0)
    monthly_savings = current.get("monthly_savings", 0)
    savings_rate = current.get("savings_rate", 0)
    current_savings = current.get("current_savings", 0)
    breakdown = current.get("expense_breakdown", [])
    goal_amount = current.get("goal_amount")
    goal_label = current.get("goal_label", "your goal")
    months_to_goal = current.get("months_to_goal_at_current_rate")
    shortfall = current.get("shortfall_per_month")
    timeframe = current.get("timeframe_months")

    # ── 1. Category vs previous month ──
    if prev_expenses:
        prev_by_cat = {e["category"].lower(): e["amount"] for e in prev_expenses}
        for exp in breakdown:
            cat = exp["category"].lower()
            amount = exp["amount"]
            prev = prev_by_cat.get(cat)
            if prev and prev > 0:
                change_pct = ((amount - prev) / prev) * 100
                if change_pct >= 20:
                    insights.append({
                        "type": "warning",
                        "icon": "📈",
                        "message": f"Your {exp['category']} spending is up {change_pct:.0f}% vs last month (${prev:,.0f} → ${amount:,.0f})."
                    })
                elif change_pct <= -15:
                    insights.append({
                        "type": "success",
                        "icon": "📉",
                        "message": f"Nice — you spent {abs(change_pct):.0f}% less on {exp['category']} compared to last month."
                    })

    # ── 2. Savings rate health ──
    if savings_rate < 0:
        insights.append({
            "type": "warning",
            "icon": "🚨",
            "message": f"You're spending ${abs(monthly_savings):,.0f} more than you earn. Cut expenses immediately."
        })
    elif savings_rate < 10:
        insights.append({
            "type": "warning",
            "icon": "⚠️",
            "message": f"Your savings rate is {savings_rate}%. Aim for at least 20% — try cutting your largest expense category."
        })
    elif savings_rate >= 20:
        insights.append({
            "type": "success",
            "icon": "✅",
            "message": f"Strong savings rate of {savings_rate}%. You're building wealth consistently."
        })

    # ── 3. Largest expense check ──
    if breakdown:
        top = breakdown[0]
        if top["percentage"] > 40:
            insights.append({
                "type": "info",
                "icon": "🔍",
                "message": f"{top['category']} takes up {top['percentage']}% of your expenses. Make sure this is unavoidable."
            })

    # ── 4. Goal feasibility + daily target ──
    if goal_amount and monthly_savings > 0:
        days_in_month = 30
        daily_savings = monthly_savings / days_in_month
        if months_to_goal and months_to_goal > 0:
            insights.append({
                "type": "info",
                "icon": "🎯",
                "message": f"Saving ${daily_savings:,.2f}/day keeps you on track to reach {goal_label} in {months_to_goal:.1f} months."
            })

        if shortfall and shortfall > 0:
            daily_extra = shortfall / days_in_month
            insights.append({
                "type": "warning",
                "icon": "⏱️",
                "message": f"To hit {goal_label} in {timeframe} months, cut daily spending by ${daily_extra:,.2f} or find extra income."
            })

    # ── 5. Emergency fund check ──
    three_months_expenses = total_expenses * 3
    if current_savings < three_months_expenses:
        gap = three_months_expenses - current_savings
        insights.append({
            "type": "tip",
            "icon": "🛡️",
            "message": f"You're ${gap:,.0f} short of a 3-month emergency fund (${three_months_expenses:,.0f}). Prioritise this before other goals."
        })
    else:
        insights.append({
            "type": "success",
            "icon": "🛡️",
            "message": f"Your emergency fund covers {current_savings / total_expenses:.1f} months of expenses. Well covered."
        })

    # ── 6. Historical trend ──
    if len(history) >= 2:
        latest = history[0]
        prev = history[1]
        if prev["total_expenses"] > 0:
            trend = ((latest["total_expenses"] - prev["total_expenses"]) / prev["total_expenses"]) * 100
            if trend > 10:
                insights.append({
                    "type": "warning",
                    "icon": "📊",
                    "message": f"Your total spending has trended up {trend:.0f}% over the last 2 months. Check what's driving it."
                })
            elif trend < -10:
                insights.append({
                    "type": "success",
                    "icon": "📊",
                    "message": f"Total spending is down {abs(trend):.0f}% over 2 months. Great discipline."
                })

    return insights
