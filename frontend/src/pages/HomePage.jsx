import Icon from "../components/Icon";
import Mascot from "../components/Mascot";

const FEATURES = [
  { icon: "grid", title: "Expense Breakdown", desc: "See where every dollar goes, broken down and visualised by category." },
  { icon: "target", title: "Goal Tracking", desc: "Set a savings target and see exactly how long it will take to reach it." },
  { icon: "sparkle", title: "Smart Insights", desc: "Rule-based tips comparing your spending month over month, automatically." },
  { icon: "chat", title: "AI Advisor", desc: "Ask anything — answers grounded in your actual numbers, never guesses." },
];

function fmt(n) {
  return "$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function HomePage({ setPage, results }) {
  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <span className="hero-kicker">Personal finance, made legible</span>
        <h1 className="hero-title">
          Know your money.
          <br />
          <span className="hero-accent">Own your future.</span>
        </h1>
        <p className="hero-sub">
          CashFlo turns your income and expenses into a clear financial picture —
          with goal projections, smart insights, and an AI advisor that actually
          knows your numbers.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => setPage("dashboard")}>
            {results ? "Back to Dashboard" : "Get Started"} <Icon name="arrow-right" size={16} />
          </button>
          <button className="btn-secondary" onClick={() => setPage("goals")}>
            View Goals
          </button>
        </div>
      </section>

      {/* Feature list */}
      <section className="features">
        <h2 className="section-heading">Everything you need</h2>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <span className="feature-icon"><Icon name={f.icon} size={22} /></span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick stats if results exist, otherwise a quiet invitation */}
      {results ? (
        <section className="home-summary">
          <h2 className="section-heading">Your latest snapshot</h2>
          <div className="summary-cards">
            <div className="summary-card income">
              <span className="sc-label">Monthly Income</span>
              <span className="sc-value tnum">{fmt(results.income)}</span>
            </div>
            <div className="summary-card expenses">
              <span className="sc-label">Total Expenses</span>
              <span className="sc-value tnum">{fmt(results.total_expenses)}</span>
            </div>
            <div className={`summary-card ${results.monthly_savings >= 0 ? "savings" : "danger"}`}>
              <span className="sc-label">Monthly Savings</span>
              <span className="sc-value tnum">{fmt(results.monthly_savings)}</span>
            </div>
            {results.goal_amount && (
              <div className="summary-card goal">
                <span className="sc-label">Goal Progress</span>
                <span className="sc-value tnum">
                  {Math.min(100, Math.round((results.current_savings / results.goal_amount) * 100))}%
                </span>
              </div>
            )}
          </div>
          <button className="btn-secondary" onClick={() => setPage("dashboard")}>
            View Full Dashboard <Icon name="arrow-right" size={16} />
          </button>
        </section>
      ) : (
        <section className="home-invite">
          <Mascot size={72} variant="idle" />
          <p>
            No numbers on the books yet. Head to the dashboard and CashFlo will
            map your income, expenses and goals in under a minute.
          </p>
        </section>
      )}
    </div>
  );
}
