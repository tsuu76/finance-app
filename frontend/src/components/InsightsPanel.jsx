import { useState, useEffect } from "react";

export default function InsightsPanel({ financialContext, apiBase }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      setLoading(true);
      try {
        const res = await fetch(`${apiBase}/insights`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ financial_context: financialContext }),
        });
        const data = await res.json();
        setInsights(data.insights || []);
      } catch {
        setInsights([]);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, [financialContext]);

  if (loading) return <div className="insights-loading">Generating insights…</div>;
  if (!insights.length) return null;

  const colorMap = {
    warning: "insight-warning",
    success: "insight-success",
    tip: "insight-tip",
    info: "insight-info",
  };

  return (
    <div className="insights-list">
      {insights.map((ins, i) => (
        <div key={i} className={`insight-card ${colorMap[ins.type] || "insight-info"}`}>
          <span className="insight-icon">{ins.icon}</span>
          <p className="insight-msg">{ins.message}</p>
        </div>
      ))}
    </div>
  );
}
