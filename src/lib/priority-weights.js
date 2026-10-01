export function priorityWeight(weights, option) {
  const value = weights?.[option];
  // Use the middle weight for missing or malformed URL/client state.
  return value === 1 || value === 2 || value === 3 ? value : 2;
}
export function normalizePriorities(value, selected) {
  const weights =
    value && typeof value === "object" && !Array.isArray(value)
      ? value
      : undefined;
  return Object.fromEntries(
    // Only selected options can influence ranking or be persisted.
    [...new Set(selected)].map((option) => [
      option,
      priorityWeight(weights, option),
    ]),
  );
}
export const priorityLabels = {
  1: "Nice to have",
  2: "Important",
  3: "Top priority",
};
