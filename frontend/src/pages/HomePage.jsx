import Logo from "../components/Logo";

export default function HomePage({ setPage, results }) {
  const features = [
    { icon: "📊", title: "Expense Breakdown", desc: "See where every dollar goes, visualised by category." },
    { icon: "🎯", title: "Goal Tracking", desc: "Set a savings target and see exactly how long it takes." },
    { icon: "💡", title: "Smart Insights", desc: "Rule-based tips comparing your spending month over month." },
    { icon: "🤖", title: "AI Advisor", desc: "Ask anything — gets real answers backed by your actual numbers." },
  ];

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-logo">
          <Logo size={64} />
        </div>
        <h1 className="hero-title">
          Know your money.<br />
          <span className="hero-accent">Own your future.</span>
        </h1>
        <p className="hero-sub">
          CashFlo turns your income and expenses into a clear financial picture —
          with goal projections, smart insights, and an AI advisor that actually knows your numbers.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => setPage("dashboard")}>
            {results ? "Back to Dashboard →" : "Get Started →"}
          </button>
        </div>
      </section>

      {/* Feature cards */}
      <section className="features">
        <h2 className="features-title">Everything you need</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick stats if results exist */}
      {results && (
        <section className="home-summary">
          <h2 className="features-title">Your latest snapshot</h2>
          <div className="summary-cards">
            <div className="summary-card income">
              <span className="sc-label">Monthly Income</span>
              <span className="sc-value">${results.income.toLocaleString()}</span>
            </div>
            <div className="summary-card expenses">
              <span className="sc-label">Total Expenses</span>
              <span className="sc-value">${results.total_expenses.toLocaleString()}</span>
            </div>
            <div className={`summary-card ${results.monthly_savings >= 0 ? "savings" : "danger"}`}>
              <span className="sc-label">Monthly Savings</span>
              <span className="sc-value">${results.monthly_savings.toLocaleString()}</span>
            </div>
            {results.goal_amount && (
              <div className="summary-card goal">
                <span className="sc-label">Goal Progress</span>
                <span className="sc-value">
                  {Math.min(100, Math.round((results.current_savings / results.goal_amount) * 100))}%
                </span>
              </div>
            )}
          </div>
          <button className="btn-secondary" onClick={() => setPage("dashboard")}>
            View Full Dashboard →
          </button>
        </section>
      )}
    </div>
  );
}
