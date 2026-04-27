"""
AI Advisor — Anthropic API integration.
Receives pre-computed values + insights. Never does math itself.
Responses are short, human, and actionable.
"""

import os
import json
import httpx

ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
MODEL = "claude-sonnet-4-20250514"


def build_system_prompt() -> str:
    return """You are CashFlo's personal finance advisor — sharp, warm, and direct.

RULES:
- Never recalculate anything. Use only the numbers provided.
- Keep responses to 2-4 sentences max.
- Be human and conversational, not robotic.
- End with one concrete action the user can take today.
- No bullet points. No markdown. Plain sentences only.
- If numbers look unhealthy, say so honestly but constructively."""


def build_user_prompt(question: str, context: dict) -> str:
    return f"""User's financial data (pre-computed):
{json.dumps(context, indent=2)}

User asks: "{question}"

Answer using only these numbers. Be brief and actionable."""


async def get_ai_advice(question: str, financial_context: dict) -> str:
    if not ANTHROPIC_API_KEY:
        return _mock_advice(question, financial_context)

    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }
    payload = {
        "model": MODEL,
        "max_tokens": 200,
        "system": build_system_prompt(),
        "messages": [{"role": "user", "content": build_user_prompt(question, financial_context)}],
    }
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(ANTHROPIC_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()["content"][0]["text"]


def _mock_advice(question: str, ctx: dict) -> str:
    income = ctx.get("income", 0)
    expenses = ctx.get("total_expenses", 0)
    savings = ctx.get("monthly_savings", 0)
    rate = ctx.get("savings_rate", 0)
    current = ctx.get("current_savings", 0)
    months_to_goal = ctx.get("months_to_goal_at_current_rate")
    shortfall = ctx.get("shortfall_per_month")
    goal_label = ctx.get("goal_label", "your goal")

    q = question.lower()

    # Afford check
    if "afford" in q:
        if savings <= 0:
            return f"With expenses exceeding income by ${abs(savings):,.0f}/month, you can't afford any new purchases right now. Focus on cutting costs first."
        if months_to_goal:
            return f"At your current savings rate of ${savings:,.0f}/month, you'll reach {goal_label} in {months_to_goal:.0f} months. Avoid new purchases that would slow this down."
        return f"You're saving ${savings:,.0f}/month — check the goal section to see exactly when you can afford it."

    # How long
    if "long" in q or "when" in q or "how many" in q:
        if months_to_goal and months_to_goal > 0:
            return f"At ${savings:,.0f}/month saved, you'll hit {goal_label} in about {months_to_goal:.1f} months. {'Save an extra $' + f'{shortfall:,.0f}/month to get there sooner.' if shortfall and shortfall > 0 else 'You are on track.'}"
        if savings <= 0:
            return "You're not saving anything right now — you'll need to reduce expenses before you can work toward a goal."
        return f"You're saving ${savings:,.0f}/month. Add a goal amount to see exactly when you'll reach it."

    # What to change
    if "change" in q or "improve" in q or "should" in q or "cut" in q:
        breakdown = ctx.get("expense_breakdown", [])
        if breakdown:
            top = breakdown[0]
            return f"Your biggest expense is {top['category']} at ${top['amount']:,.0f} ({top['percentage']}% of spending). Even a 10% cut there would free up ${top['amount']*0.1:,.0f}/month. Start there."
        if rate < 20:
            return f"Your {rate}% savings rate is below the 20% benchmark. Look at your top two expense categories and aim to trim 10% from each."
        return f"Your finances look solid with a {rate}% savings rate. Focus on keeping expenses flat as income grows."

    # Default
    if savings < 0:
        return f"Your expenses are ${abs(savings):,.0f} over your income this month. This is urgent — identify your largest discretionary expense and cut it immediately."
    return f"You're saving ${savings:,.0f}/month — a {rate}% savings rate. {'Push toward 20% by trimming your top expense.' if rate < 20 else 'That is a healthy rate. Stay consistent and your goals will follow.'}"
