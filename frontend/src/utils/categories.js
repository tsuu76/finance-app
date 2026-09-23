/*
  Shared category → icon mapping, used by InputForm, ResultsPanel, and
  anywhere else a category label needs a consistent glyph.
*/

export const EXPENSE_CATEGORIES = [
  { label: "Rent / Mortgage", icon: "house" },
  { label: "Food & Groceries", icon: "food" },
  { label: "Transport", icon: "transport" },
  { label: "Entertainment", icon: "entertainment" },
  { label: "Health", icon: "health" },
  { label: "Subscriptions", icon: "subscriptions" },
  { label: "Clothing", icon: "clothing" },
  { label: "Education", icon: "education" },
  { label: "Utilities", icon: "utilities" },
  { label: "Savings Transfer", icon: "bank" },
  { label: "Other", icon: "other" },
];

export function iconForCategory(label) {
  const match = EXPENSE_CATEGORIES.find((c) => c.label === label);
  return match ? match.icon : "other";
}

// The five categories shown in the first-visit intro card fan.
export const INTRO_CATEGORIES = [
  { label: "Food", icon: "food" },
  { label: "Transport", icon: "transport" },
  { label: "Shopping", icon: "shopping" },
  { label: "Entertainment", icon: "entertainment" },
  { label: "Bills", icon: "bills" },
];

// Goal type presets — icon + a sensible default target, used to seed
// the Goals tab and to offer quick-pick options in the "new goal" form.
export const GOAL_PRESETS = [
  { label: "Emergency Fund", icon: "shield" },
  { label: "New Laptop", icon: "laptop" },
  { label: "Vacation", icon: "vacation" },
  { label: "Car", icon: "car" },
  { label: "Savings", icon: "savings" },
  { label: "Other", icon: "target" },
];

export function iconForGoal(label) {
  const match = GOAL_PRESETS.find((g) => g.label === label);
  return match ? match.icon : "target";
}
