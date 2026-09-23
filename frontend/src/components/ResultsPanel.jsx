import Icon from "./Icon";
import { iconForCategory } from "../utils/categories";

function fmt(n) {
  if (n === null || n === undefined) return "—";
  return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtMonths(n) {
  if (n === null || n === undefined) return "—";
  if (n === 0) return "Already reached!";
  const months = Math.ceil(n);
  if (months >= 12) {
    const y = Math.floor(months / 12);
    const m = months % 12;
    return `~${y}y ${m > 0 ? m + "m" : ""}`.trim();
  }
  return `~${months} month${months > 1 ? "s" : ""}`;
}

function SavingsBar({ rate }) {
  const clamped = Math.min(Math.max(rate, 0), 100);
  const color = rate < 0 ? "var(--negative)" : rate < 10 ? "var(--warning)" : rate < 20 ? "var(--gold-500)" : "var(--positive)";
  return (
    <div className="savings-bar-track">
      <div
        className="savings-bar-fill"
        style={{ width: `${clamped}%`, background: color }}
      />
    </div>
  );
}

function ExpenseBar({ percentage, amount }) {
  return (
    <div className="exp-bar-track">
      <div className="exp-bar-fill" style={{ width: `${percentage}%` }} />
    </div>
  );
}

export default function ResultsPanel({ results }) {
  const {
    income,
    total_expenses,
    monthly_savings,
    savings_rate,
    current_savings,
    expense_breakdown,
    goal_label,
    goal_amount,
    months_to_goal_at_current_rate,
    required_monthly_savings,
    timeframe_months,
    shortfall_per_month,
  } = results;

  const isSavingsNeg = monthly_savings < 0;

  return (
    <div className="results-grid">

      {/* Summary Cards */}
      <div className="results-section">
        <h3 className="results-subtitle">Savings Summary</h3>
        <div className="card-row">
          <div className="stat-card">
            <span className="stat-label">Monthly Income</span>
            <span className="stat-value positive">{fmt(income)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Expenses</span>
            <span className="stat-value negative">{fmt(total_expenses)}</span>
          </div>
          <div className={`stat-card ${isSavingsNeg ? "card-danger" : "card-success"}`}>
            <span className="stat-label">Monthly Savings</span>
            <span className={`stat-value ${isSavingsNeg ? "negative" : "positive"}`}>
              {fmt(monthly_savings)}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Current Savings</span>
            <span className="stat-value">{fmt(current_savings)}</span>
          </div>
        </div>

        {/* Step-by-step calculation */}
        <div className="calc-steps">
          <div className="calc-step">
            <span className="calc-label">Calculation</span>
            <span className="calc-expr">
              {fmt(income)} income − {fmt(total_expenses)} expenses = <strong>{fmt(monthly_savings)}</strong>/month
            </span>
          </div>
          <div className="savings-rate-row">
            <span>Savings Rate: <strong>{savings_rate}%</strong></span>
            <SavingsBar rate={savings_rate} />
            <span className="rate-note">
              {savings_rate < 0
                ? "You're spending more than you earn"
                : savings_rate < 10
                ? "Low — aim for 20%+"
                : savings_rate < 20
                ? "Decent — push toward 20%"
                : "Healthy savings rate"}
            </span>
          </div>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="results-section">
        <h3 className="results-subtitle">Expense Breakdown</h3>
        <div className="expense-breakdown">
          {expense_breakdown.map((exp, i) => (
            <div key={i} className="exp-row">
              <span className="exp-cat">
                <Icon name={iconForCategory(exp.category)} size={14} className="exp-cat-icon" />
                {exp.category}
              </span>
              <div className="exp-bar-wrapper">
                <ExpenseBar percentage={exp.percentage} />
              </div>
              <span className="exp-pct">{exp.percentage}%</span>
              <span className="exp-amt">{fmt(exp.amount)}</span>
            </div>
          ))}
          <div className="exp-total-row">
            <span>Total</span>
            <span></span>
            <span></span>
            <span className="exp-amt total">{fmt(total_expenses)}</span>
          </div>
        </div>
      </div>

      {/* Goal Analysis */}
      {goal_amount && (
        <div className="results-section">
          <h3 className="results-subtitle">Goal: {goal_label}</h3>
          <div className="card-row">
            <div className="stat-card">
              <span className="stat-label">Target</span>
              <span className="stat-value">{fmt(goal_amount)}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Already Saved</span>
              <span className="stat-value positive">{fmt(current_savings)}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Still Needed</span>
              <span className="stat-value">{fmt(Math.max(0, goal_amount - current_savings))}</span>
            </div>
          </div>

          <div className="calc-steps">
            <div className="calc-step">
              <span className="calc-label">Time at current rate</span>
              <span className="calc-expr">
                ({fmt(goal_amount)} − {fmt(current_savings)}) ÷ {fmt(monthly_savings)}/mo
                = <strong>{fmtMonths(months_to_goal_at_current_rate)}</strong>
              </span>
            </div>

            {required_monthly_savings !== null && required_monthly_savings !== undefined && (
              <div className="calc-step">
                <span className="calc-label">Required to hit {timeframe_months}mo deadline</span>
                <span className="calc-expr">
                  ({fmt(goal_amount)} − {fmt(current_savings)}) ÷ {timeframe_months}mo
                  = <strong>{fmt(required_monthly_savings)}/mo</strong>
                </span>
              </div>
            )}

            {shortfall_per_month !== null && shortfall_per_month !== undefined && shortfall_per_month > 0 && (
              <div className="calc-step warning">
                <span className="calc-label">Monthly shortfall</span>
                <span className="calc-expr">
                  You need <strong>{fmt(shortfall_per_month)} more/month</strong> to meet your deadline.
                </span>
              </div>
            )}

            {shortfall_per_month !== null && shortfall_per_month !== undefined && shortfall_per_month <= 0 && (
              <div className="calc-step success">
                <span className="calc-label">On track!</span>
                <span className="calc-expr">
                  <Icon name="check-circle" size={13} /> Your current savings rate is sufficient to meet your goal on time.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
