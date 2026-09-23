import { useState } from "react";
import Icon from "./Icon";
import { EXPENSE_CATEGORIES, iconForCategory } from "../utils/categories";

const DEFAULT_EXPENSES = [
  { category: "Rent / Mortgage", amount: "" },
  { category: "Food & Groceries", amount: "" },
];

export default function InputForm({ onSubmit, loading }) {
  const [income, setIncome] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [expenses, setExpenses] = useState(DEFAULT_EXPENSES);
  const [goalLabel, setGoalLabel] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [formError, setFormError] = useState(null);

  function addExpense() {
    setExpenses([...expenses, { category: "Other", amount: "" }]);
  }

  function removeExpense(index) {
    if (expenses.length === 1) return;
    setExpenses(expenses.filter((_, i) => i !== index));
  }

  function updateExpense(index, field, value) {
    setExpenses(expenses.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
  }

  function validate() {
    if (!income || parseFloat(income) <= 0) return "Income must be a positive number.";
    for (const e of expenses) {
      if (!e.category.trim()) return "Each expense needs a category.";
      if (e.amount === "" || parseFloat(e.amount) < 0) return "Each expense needs a valid amount.";
    }
    if (goalAmount && parseFloat(goalAmount) <= 0) return "Goal amount must be positive.";
    if (timeframe && parseInt(timeframe) <= 0) return "Timeframe must be positive months.";
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) { setFormError(err); return; }
    setFormError(null);
    onSubmit({
      income: parseFloat(income),
      current_savings: parseFloat(currentSavings) || 0,
      expenses: expenses.map((ex) => ({
        category: ex.category.trim(),
        amount: parseFloat(ex.amount),
      })),
      goal_label: goalLabel || "Financial Goal",
      goal_amount: goalAmount ? parseFloat(goalAmount) : null,
      timeframe_months: timeframe ? parseInt(timeframe) : null,
    });
  }

  return (
    <form className="input-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label><Icon name="wallet" size={13} /> Monthly Income ($)</label>
          <input type="number" min="0" step="0.01" placeholder="e.g. 5000"
            value={income} onChange={(e) => setIncome(e.target.value)} required />
        </div>
        <div className="form-group">
          <label><Icon name="bank" size={13} /> Current Savings ($)</label>
          <input type="number" min="0" step="0.01" placeholder="e.g. 3000"
            value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} />
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-header">
          <label className="section-label"><Icon name="grid" size={13} /> Monthly Expenses</label>
          <button type="button" className="btn-add" onClick={addExpense}>
            <Icon name="plus" size={12} /> Add Row
          </button>
        </div>
        <div className="expense-list">
          {expenses.map((exp, i) => (
            <div key={i} className="expense-row">
              <span className="exp-row-icon"><Icon name={iconForCategory(exp.category)} size={16} /></span>
              <select className="expense-cat-select" value={exp.category}
                onChange={(e) => updateExpense(i, "category", e.target.value)}>
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.label} value={c.label}>{c.label}</option>
                ))}
              </select>
              <input type="number" min="0" step="0.01" placeholder="$0"
                value={exp.amount} onChange={(e) => updateExpense(i, "amount", e.target.value)}
                className="expense-amt" />
              <button type="button" className="btn-remove" onClick={() => removeExpense(i)}
                disabled={expenses.length === 1} aria-label="Remove expense">
                <Icon name="close" size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-section">
        <label className="section-label"><Icon name="target" size={13} /> Financial Goal (optional)</label>
        <div className="form-row three-col">
          <div className="form-group">
            <label>Goal Description</label>
            <input type="text" placeholder="e.g. Buy a car"
              value={goalLabel} onChange={(e) => setGoalLabel(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Target Amount ($)</label>
            <input type="number" min="0" step="0.01" placeholder="e.g. 20000"
              value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Timeframe (months)</label>
            <input type="number" min="1" step="1" placeholder="e.g. 12"
              value={timeframe} onChange={(e) => setTimeframe(e.target.value)} />
          </div>
        </div>
      </div>

      {formError && <div className="error-msg"><Icon name="warning" size={14} /> {formError}</div>}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Calculating…" : <>Analyze My Finances <Icon name="arrow-right" size={16} /></>}
      </button>
    </form>
  );
}
