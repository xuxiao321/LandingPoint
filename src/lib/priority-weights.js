export function priorityWeight(weights, option) {
  const value = weights?.[option];
  return value === 1 || value === 2 || value === 3 ? value : 2;
}
export function normalizePriorities(value, selected) {
  const weights =
    value && typeof value === "object" && !Array.isArray(value)
      ? value
      : undefined;
  return Object.fromEntries(
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
