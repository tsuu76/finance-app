import { useState } from "react";
import CardFan from "../components/CardFan";
import Icon from "../components/Icon";
import Mascot from "../components/Mascot";
import { GOAL_PRESETS, iconForGoal } from "../utils/categories";

const STORAGE_KEY = "cashflo_goals";

const DEFAULT_GOALS = [
  { id: "emergency", label: "Emergency Fund", target: 6000, saved: 2400 },
  { id: "laptop", label: "New Laptop", target: 1800, saved: 650 },
  { id: "vacation", label: "Vacation", target: 3000, saved: 900 },
  { id: "car", label: "Car", target: 15000, saved: 4200 },
  { id: "savings", label: "Savings", target: 10000, saved: 5600 },
];

function loadGoals() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* fall through to defaults */
  }
  return DEFAULT_GOALS;
}

function saveGoals(goals) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  } catch {
    /* private browsing / storage disabled — goal changes just won't persist */
  }
}

function fmt(n) {
  return "$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

const emptyDraft = { preset: GOAL_PRESETS[0].label, label: "", target: "", saved: "" };

export default function GoalsPage() {
  const [goals, setGoals] = useState(loadGoals);
  const [selectedId, setSelectedId] = useState(goals[0]?.id ?? null);
  const [contribution, setContribution] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [editing, setEditing] = useState(false);

  function persist(next) {
    setGoals(next);
    saveGoals(next);
  }

  const selected = goals.find((g) => g.id === selectedId) || null;

  function handleContribute(e) {
    e.preventDefault();
    const amount = parseFloat(contribution);
    if (!amount || amount <= 0 || !selected) return;
    persist(goals.map((g) => (g.id === selected.id ? { ...g, saved: g.saved + amount } : g)));
    setContribution("");
  }

  function handleDelete(id) {
    const next = goals.filter((g) => g.id !== id);
    persist(next);
    if (selectedId === id) setSelectedId(next[0]?.id ?? null);
  }

  function handleAddGoal(e) {
    e.preventDefault();
    const label = draft.preset === "Other" ? draft.label.trim() : draft.preset;
    const target = parseFloat(draft.target);
    if (!label || !target || target <= 0) return;
    const id = `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${goals.length}-${Math.floor(target)}`;
    const next = [...goals, { id, label, target, saved: parseFloat(draft.saved) || 0 }];
    persist(next);
    setSelectedId(id);
    setDraft(emptyDraft);
    setAddOpen(false);
  }

  function handleEditSave(nextLabel, nextTarget) {
    if (!selected) return;
    const target = parseFloat(nextTarget);
    persist(goals.map((g) => (g.id === selected.id ? { ...g, label: nextLabel.trim() || g.label, target: target > 0 ? target : g.target } : g)));
    setEditing(false);
  }

  return (
    <div className="goals-page">
      <div className="goals-header">
        <div>
          <h1 className="goals-title">Goals</h1>
          <p className="goals-sub">The same cards, a different kind of progress.</p>
        </div>
        <button className="btn-secondary btn-sm" onClick={() => setAddOpen((v) => !v)}>
          <Icon name="plus" size={14} /> New Goal
        </button>
      </div>

      {addOpen && (
        <form className="goal-add-form" onSubmit={handleAddGoal}>
          <div className="form-row three-col">
            <div className="form-group">
              <label>Type</label>
              <select value={draft.preset} onChange={(e) => setDraft({ ...draft, preset: e.target.value })}>
                {GOAL_PRESETS.map((p) => (
                  <option key={p.label} value={p.label}>{p.label}</option>
                ))}
              </select>
            </div>
            {draft.preset === "Other" && (
              <div className="form-group">
                <label>Name</label>
                <input type="text" placeholder="e.g. Wedding" value={draft.label}
                  onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
              </div>
            )}
            <div className="form-group">
              <label>Target ($)</label>
              <input type="number" min="0" step="1" placeholder="e.g. 2000" value={draft.target}
                onChange={(e) => setDraft({ ...draft, target: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Already saved ($)</label>
              <input type="number" min="0" step="1" placeholder="0" value={draft.saved}
                onChange={(e) => setDraft({ ...draft, saved: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn-primary btn-sm">Add Goal</button>
        </form>
      )}

      {goals.length === 0 ? (
        <div className="empty-state">
          <Mascot size={88} variant="idle" />
          <p>No goals yet. Start one — even a small target keeps you moving.</p>
          <button className="btn-primary" onClick={() => setAddOpen(true)}>
            <Icon name="plus" size={16} /> Add your first goal
          </button>
        </div>
      ) : (
        <>
          <div className="goals-fan-wrap">
            <CardFan
              cards={goals}
              state="fan"
              interactive
              selectedId={selectedId}
              onSelect={setSelectedId}
              stagger={40}
              renderCard={(g) => {
                const pct = g.target > 0 ? Math.min(100, Math.round((g.saved / g.target) * 100)) : 0;
                return (
                  <>
                    <div className="cf-fill-track">
                      <div className="cf-fill" style={{ height: `${pct}%` }} />
                    </div>
                    <div className="cf-icon"><Icon name={iconForGoal(g.label)} size={18} /></div>
                    <div className="cf-label">{g.label}</div>
                    <div className="cf-spacer" />
                    <div className="cf-progress-badge">{pct}%</div>
                    <div className="cf-amounts tnum">
                      <strong>{fmt(g.saved)}</strong> / {fmt(g.target)}
                    </div>
                  </>
                );
              }}
            />
          </div>

          {selected && (
            <section className="goal-detail panel">
              <div className="goal-detail-header">
                {editing ? (
                  <EditGoalForm goal={selected} onSave={handleEditSave} onCancel={() => setEditing(false)} />
                ) : (
                  <>
                    <div>
                      <h2 className="goal-detail-title">
                        <Icon name={iconForGoal(selected.label)} size={18} /> {selected.label}
                      </h2>
                      <p className="goal-detail-remaining">
                        {fmt(Math.max(0, selected.target - selected.saved))} left of {fmt(selected.target)}
                      </p>
                    </div>
                    <div className="goal-detail-actions">
                      <button className="btn-ghost-sm" onClick={() => setEditing(true)}>
                        <Icon name="edit" size={13} /> Edit
                      </button>
                      <button className="btn-ghost-sm goal-delete" onClick={() => handleDelete(selected.id)}>
                        <Icon name="trash" size={13} /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="goal-progress-track">
                <div
                  className="goal-progress-fill"
                  style={{ width: `${selected.target > 0 ? Math.min(100, (selected.saved / selected.target) * 100) : 0}%` }}
                />
              </div>

              <form className="goal-contribute-row" onSubmit={handleContribute}>
                <input
                  type="number" min="0" step="0.01" placeholder="Add funds ($)"
                  value={contribution} onChange={(e) => setContribution(e.target.value)}
                />
                <button type="submit" className="btn-primary btn-sm">
                  <Icon name="plus" size={14} /> Add
                </button>
              </form>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function EditGoalForm({ goal, onSave, onCancel }) {
  const [label, setLabel] = useState(goal.label);
  const [target, setTarget] = useState(goal.target);
  return (
    <form
      className="goal-edit-form"
      onSubmit={(e) => { e.preventDefault(); onSave(label, target); }}
    >
      <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} />
      <input type="number" min="0" step="1" value={target} onChange={(e) => setTarget(e.target.value)} />
      <button type="submit" className="btn-primary btn-sm">Save</button>
      <button type="button" className="btn-ghost-sm" onClick={onCancel}>Cancel</button>
    </form>
  );
}
