export type PriorityWeights = Record<string, number>;
export function priorityWeight(weights: PriorityWeights | undefined, option: string) {
  const value = weights?.[option];
  return value === 1 || value === 2 || value === 3 ? value : 2;
}
export function normalizePriorities(value: unknown, selected: string[]): PriorityWeights {
  const weights = value && typeof value === "object" && !Array.isArray(value) ? value as PriorityWeights : undefined;
  return Object.fromEntries([...new Set(selected)].map(option => [option, priorityWeight(weights, option)]));
}
export const priorityLabels: Record<number, string> = { 1: "Nice to have", 2: "Important", 3: "Top priority" };
