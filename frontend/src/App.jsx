import { useState } from "react";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import GoalsPage from "./pages/GoalsPage";
import InputForm from "./components/InputForm";
import ResultsPanel from "./components/ResultsPanel";
import AIChat from "./components/AIChat";
import InsightsPanel from "./components/InsightsPanel";
import IntroExperience, { hasSeenIntro } from "./components/IntroExperience";
import Mascot from "./components/Mascot";
import Icon from "./components/Icon";
import "./App.css";

const API = `http://${window.location.hostname}:8000/api`;

function fmt(n) {
  return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function App() {
  const [showIntro, setShowIntro] = useState(() => !hasSeenIntro());
  const [page, setPage] = useState("home");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(true);

  async function handleAnalyze(formData) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Calculation failed");
      }
      const data = await res.json();
      setResults(data);
      setPage("dashboard");
      setFormOpen(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (showIntro) {
    return <IntroExperience onDone={() => setShowIntro(false)} />;
  }

  return (
    <div className="app">
      <NavBar page={page} setPage={setPage} hasResults={!!results} />

      <main className="app-main">
        {page === "home" && <HomePage setPage={setPage} results={results} />}

        {page === "goals" && <GoalsPage />}

        {page === "dashboard" && (
          <div className="dashboard">
            {/* Input panel — full form when no results yet, or when explicitly reopened */}
            {(formOpen || !results) && (
              <section className="panel panel-input">
                <div className="panel-title-row">
                  <h2 className="panel-title">Your Finances</h2>
                  {results && (
                    <button className="btn-ghost-sm" onClick={() => setFormOpen(false)}>
                      Collapse
                    </button>
                  )}
                </div>
                <InputForm onSubmit={handleAnalyze} loading={loading} />
                {error && <div className="error-msg" style={{ marginTop: 12 }}>{error}</div>}
              </section>
            )}

            {results && !formOpen && (
              <section className="input-summary-bar">
                <div className="input-summary-line">
                  <span className="isb-label">Income</span>
                  <span className="isb-value tnum">{fmt(results.income)}</span>
                  <span className="isb-sep" />
                  <span className="isb-label">Expenses</span>
                  <span className="isb-value tnum">{fmt(results.total_expenses)}</span>
                </div>
                <button className="btn-secondary btn-sm" onClick={() => setFormOpen(true)}>
                  <Icon name="edit" size={14} /> Edit inputs
                </button>
              </section>
            )}

            {results && (
              <>
                {/* Summary stats row */}
                <section className="stats-row">
                  <div className="stat-hero income">
                    <span className="sh-icon"><Icon name="wallet" size={22} /></span>
                    <div>
                      <span className="sh-label">Monthly Income</span>
                      <span className="sh-value tnum">{fmt(results.income)}</span>
                    </div>
                  </div>
                  <div className="stat-hero expenses">
                    <span className="sh-icon"><Icon name="trend-down" size={22} /></span>
                    <div>
                      <span className="sh-label">Total Expenses</span>
                      <span className="sh-value tnum">{fmt(results.total_expenses)}</span>
                    </div>
                  </div>
                  <div className={`stat-hero ${results.monthly_savings >= 0 ? "savings" : "danger"}`}>
                    <span className="sh-icon">
                      <Icon name={results.monthly_savings >= 0 ? "trend-up" : "warning"} size={22} />
                    </span>
                    <div>
                      <span className="sh-label">Monthly Savings</span>
                      <span className="sh-value tnum">{fmt(results.monthly_savings)}</span>
                    </div>
                  </div>
                  {results.goal_amount && (
                    <div className="stat-hero goal">
                      <span className="sh-icon"><Icon name="target" size={22} /></span>
                      <div>
                        <span className="sh-label">Goal Progress</span>
                        <span className="sh-value tnum">
                          {Math.min(100, Math.round((results.current_savings / results.goal_amount) * 100))}%
                        </span>
                        <div className="goal-mini-bar">
                          <div
                            className="goal-mini-fill"
                            style={{ width: `${Math.min(100, (results.current_savings / results.goal_amount) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* Insights */}
                <section className="panel">
                  <h2 className="panel-title"><Icon name="sparkle" size={14} /> Smart Insights</h2>
                  <InsightsPanel financialContext={results} apiBase={API} />
                </section>

                {/* Full analysis */}
                <section className="panel panel-results">
                  <h2 className="panel-title">Full Analysis</h2>
                  <ResultsPanel results={results} />
                </section>

                {/* AI Chat */}
                <section className="panel panel-chat">
                  <h2 className="panel-title"><Icon name="chat" size={14} /> AI Advisor</h2>
                  <AIChat financialContext={results} apiBase={API} />
                </section>
              </>
            )}

            {!results && !loading && (
              <div className="empty-state">
                <Mascot size={88} variant="idle" />
                <p>
                  Fill in your details above and click <strong>Analyze</strong> — CashFlo will
                  chart the rest.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>CashFlo — calculations are server-side. AI explains, never computes.</p>
      </footer>
    </div>
  );
}
