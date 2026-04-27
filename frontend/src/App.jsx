import { useState } from "react";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import InputForm from "./components/InputForm";
import ResultsPanel from "./components/ResultsPanel";
import AIChat from "./components/AIChat";
import InsightsPanel from "./components/InsightsPanel";
import "./App.css";

const API = "http://localhost:8000/api";

export default function App() {
  const [page, setPage] = useState("home");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <NavBar page={page} setPage={setPage} hasResults={!!results} />

      <main className="app-main">
        {page === "home" && (
          <HomePage setPage={setPage} results={results} />
        )}

        {page === "dashboard" && (
          <div className="dashboard">
            {/* Input panel */}
            <section className="panel panel-input">
              <h2 className="panel-title">Your Finances</h2>
              <InputForm onSubmit={handleAnalyze} loading={loading} />
              {error && <div className="error-msg" style={{ marginTop: 12 }}>⚠ {error}</div>}
            </section>

            {results && (
              <>
                {/* Summary stats row */}
                <section className="stats-row">
                  <div className="stat-hero income">
                    <span className="sh-icon">💰</span>
                    <div>
                      <span className="sh-label">Monthly Income</span>
                      <span className="sh-value">${results.income.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                  <div className="stat-hero expenses">
                    <span className="sh-icon">💸</span>
                    <div>
                      <span className="sh-label">Total Expenses</span>
                      <span className="sh-value">${results.total_expenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                  <div className={`stat-hero ${results.monthly_savings >= 0 ? "savings" : "danger"}`}>
                    <span className="sh-icon">{results.monthly_savings >= 0 ? "📈" : "📉"}</span>
                    <div>
                      <span className="sh-label">Monthly Savings</span>
                      <span className="sh-value">${results.monthly_savings.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                  {results.goal_amount && (
                    <div className="stat-hero goal">
                      <span className="sh-icon">🎯</span>
                      <div>
                        <span className="sh-label">Goal Progress</span>
                        <span className="sh-value">
                          {Math.min(100, Math.round((results.current_savings / results.goal_amount) * 100))}%
                        </span>
                        <div className="goal-mini-bar">
                          <div className="goal-mini-fill" style={{
                            width: `${Math.min(100, (results.current_savings / results.goal_amount) * 100)}%`
                          }} />
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* Insights */}
                <section className="panel">
                  <h2 className="panel-title">💡 Smart Insights</h2>
                  <InsightsPanel financialContext={results} apiBase={API} />
                </section>

                {/* Full analysis */}
                <section className="panel panel-results">
                  <h2 className="panel-title">Full Analysis</h2>
                  <ResultsPanel results={results} />
                </section>

                {/* AI Chat */}
                <section className="panel panel-chat">
                  <h2 className="panel-title">🤖 AI Advisor</h2>
                  <AIChat financialContext={results} apiBase={API} />
                </section>
              </>
            )}

            {!results && !loading && (
              <div className="empty-state">
                <span className="empty-icon">📊</span>
                <p>Fill in your details above and click <strong>Analyze</strong>.</p>
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
