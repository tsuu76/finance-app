"""
Quick sanity tests for all calculation functions.
Run with: python test_calculations.py
"""
import sys
sys.path.insert(0, ".")
from calculations import (
    calc_total_expenses,
    calc_monthly_savings,
    calc_time_to_goal,
    calc_required_monthly_savings,
    calc_savings_rate,
    calc_affordability,
    build_full_analysis,
)


def test(name, got, expected, tol=0.01):
    ok = abs(got - expected) <= tol if isinstance(got, float) else got == expected
    status = "✓" if ok else "✗"
    print(f"  {status} {name}: got={got}, expected={expected}")
    return ok


def run():
    passed = 0
    total = 0

    print("\n── Basic Calculations ──")
    expenses = [{"category": "Rent", "amount": 1200}, {"category": "Food", "amount": 800}]

    total += 1; passed += test("total_expenses", calc_total_expenses(expenses), 2000.0)
    total += 1; passed += test("monthly_savings", calc_monthly_savings(3000, 2000), 1000.0)
    total += 1; passed += test("savings_rate", calc_savings_rate(3000, 1000), 33.33)
    total += 1; passed += test("time_to_goal_12mo", calc_time_to_goal(12000, 0, 1000), 12.0)
    total += 1; passed += test("time_to_goal_already", calc_time_to_goal(5000, 6000, 1000), 0.0)
    total += 1; passed += test("time_to_goal_never", calc_time_to_goal(12000, 0, 0), None)
    total += 1; passed += test("required_savings_6mo", calc_required_monthly_savings(12000, 0, 6), 2000.0)
    total += 1; passed += test("required_savings_no_tf", calc_required_monthly_savings(12000, 0, None), None)

    print("\n── Affordability Check ──")
    aff = calc_affordability(5000, 2000, 500, months_willing_to_wait=6)
    total += 1; passed += test("can_afford_now=False", aff["can_afford_now"], False)
    total += 1; passed += test("months_to_afford=6.0", aff["months_to_afford"], 6.0)
    total += 1; passed += test("projected=5000", aff["projected_savings_at_deadline"], 5000.0)
    total += 1; passed += test("can_afford_at_deadline=True", aff["can_afford_at_deadline"], True)

    aff2 = calc_affordability(1000, 5000, 500)
    total += 1; passed += test("can_afford_now=True", aff2["can_afford_now"], True)

    print("\n── Full Analysis (sample from spec) ──")
    data = {
        "income": 3000,
        "expenses": [{"category": "Expenses", "amount": 2000}],
        "current_savings": 0,
        "goal_amount": 12000,
        "goal_label": "Emergency Fund",
        "timeframe_months": None,
    }
    result = build_full_analysis(data)
    total += 1; passed += test("monthly_savings=1000", result["monthly_savings"], 1000.0)
    total += 1; passed += test("months_to_goal=12", result["months_to_goal_at_current_rate"], 12.0)
    total += 1; passed += test("savings_rate=33.3%", result["savings_rate"], 33.3)

    print(f"\n── Results: {passed}/{total} passed ──\n")
    return passed == total


if __name__ == "__main__":
    ok = run()
    sys.exit(0 if ok else 1)
