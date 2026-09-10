"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, LoaderCircle, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Label, Select } from "@/components/ui/field";
import {
  isSponsorshipRelevantGoal,
  lifestyleOptionGroups,
  lifestyleOptions,
  passportCountries,
  type PassportCountry,
  workTypes,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import { useAccount } from "@/components/account-provider";
import { normalizePriorities, priorityLabels, priorityWeight } from "@/lib/priority-weights";

const commonPassportCountryCodes = ["US", "CN", "CA", "GB", "IN", "AU"];
const goalCtaLabels: Record<string, string> = {
  "Travel / Short Stay": "Find my next short-stay city",
  Study: "Find cities for my studies",
  "Settle / Family": "Find cities to settle in",
  "Work / Career": "Find cities for my career",
  "Start a Business": "Find founder-friendly cities",
  "Remote Work Base": "Find my remote-work base",
};
const searchablePassportCountries = passportCountries.map((country) => ({
  country,
  tokens: [country.name, country.code, ...country.aliases].map(
    normalizePassportSearch,
  ),
}));

function normalizePassportSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim();
}

function compactPassportSearch(value: string) {
  return normalizePassportSearch(value).replace(/\s+/g, "");
}

function levenshteinDistance(left: string, right: string) {
  const matrix = Array.from({ length: left.length + 1 }, (_, row) =>
    Array.from({ length: right.length + 1 }, (_, column) =>
      row === 0 ? column : column === 0 ? row : 0,
    ),
  );

  for (let row = 1; row <= left.length; row++) {
    for (let column = 1; column <= right.length; column++) {
      const cost = left[row - 1] === right[column - 1] ? 0 : 1;
      matrix[row][column] = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + cost,
      );
    }
  }

  return matrix[left.length][right.length];
}

function scorePassportCountry(country: PassportCountry, query: string) {
  const normalizedQuery = normalizePassportSearch(query);
  const compactQuery = compactPassportSearch(query);

  if (!normalizedQuery) {
    return commonPassportCountryCodes.includes(country.code) ? 0 : null;
  }

  const entry = searchablePassportCountries.find(
    (item) => item.country.code === country.code,
  );
  const tokens = entry?.tokens ?? [];

  for (const token of tokens) {
    const compactToken = token.replace(/\s+/g, "");

    if (token === normalizedQuery || compactToken === compactQuery) {
      return 0;
    }

    if (token.startsWith(normalizedQuery) || compactToken.startsWith(compactQuery)) {
      return 1;
    }

    if (token.split(" ").some((word) => word.startsWith(normalizedQuery))) {
      return 2;
    }

    if (token.includes(normalizedQuery) || compactToken.includes(compactQuery)) {
      return 3;
    }

    if (compactQuery.length >= 4) {
      const typoCandidate = compactToken.slice(
        0,
        Math.min(compactToken.length, Math.max(compactQuery.length, 4)),
      );
      const typoDistance = levenshteinDistance(compactQuery, typoCandidate);

      if (typoDistance <= (compactQuery.length <= 5 ? 1 : 2)) {
        return 4 + typoDistance;
      }
    }
  }

  return null;
}

function getPassportCountrySuggestions(query: string) {
  return passportCountries
    .map((country) => ({ country, score: scorePassportCountry(country, query) }))
    .filter((match): match is { country: PassportCountry; score: number } =>
      match.score !== null,
    )
    .sort((left, right) => {
      if (left.score !== right.score) {
        return left.score - right.score;
      }

      if (!query) {
        const leftCommonIndex = commonPassportCountryCodes.indexOf(
          left.country.code,
        );
        const rightCommonIndex = commonPassportCountryCodes.indexOf(
          right.country.code,
        );

        if (leftCommonIndex !== rightCommonIndex) {
          return leftCommonIndex - rightCommonIndex;
        }
      }

      return left.country.name.localeCompare(right.country.name);
    })
    .slice(0, 6)
    .map((match) => match.country);
}

function resolvePassportCountry(query: string) {
  const normalizedQuery = normalizePassportSearch(query);
  const compactQuery = compactPassportSearch(query);

  if (!normalizedQuery) {
    return null;
  }

  return (
    searchablePassportCountries.find(({ tokens }) =>
      tokens.some(
        (token) =>
          token === normalizedQuery || token.replace(/\s+/g, "") === compactQuery,
      ),
    )?.country ?? null
  );
}

export function HomeSearch() {
  const account = useAccount();
  const [saveMessage, setSaveMessage] = useState("");
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [priorities, setPriorities] = useState<Record<string, number>>({});
  const router = useRouter();
  const [budget, setBudget] = useState("3000");
  const [passportQuery, setPassportQuery] = useState("United States");
  const [passportError, setPassportError] = useState("");
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [needsSponsorship, setNeedsSponsorship] = useState("Yes");
  const [workType, setWorkType] = useState("Work / Career");
  const [lifestyles, setLifestyles] = useState<string[]>([
    "Lower Living Costs",
    "No-car Lifestyle",
  ]);
  const [isNavigating, setIsNavigating] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("workType")) return;
    const amount = Number(params.get("budget"));
    if (Number.isFinite(amount) && amount > 0 && amount <= 1000000) setBudget(String(amount));
    const passport = resolvePassportCountry(params.get("passport") ?? "");
    if (passport) setPassportQuery(passport.name);
    const goal = params.get("workType") ?? "";
    if ((workTypes as readonly string[]).includes(goal)) setWorkType(goal);
    if (["Yes", "No", "Maybe Later"].includes(params.get("needsSponsorship") ?? "")) setNeedsSponsorship(params.get("needsSponsorship")!);
    const selected = [...new Set(params.getAll("lifestyle"))].filter(v => (lifestyleOptions as readonly string[]).includes(v));
    setLifestyles(selected);
    setPriorities(normalizePriorities(Object.fromEntries(selected.map(v => [v, Number(params.get(`priority:${v}`))])), selected));
  }, []);
  const shouldAskSponsorship = isSponsorshipRelevantGoal(workType);
  const ctaLabel = goalCtaLabels[workType] ?? "See my city matches";
  const priorityCountLabel = `${lifestyles.length} priorit${
    lifestyles.length === 1 ? "y" : "ies"
  } selected`;
  const passportSuggestions = useMemo(
    () => getPassportCountrySuggestions(passportQuery),
    [passportQuery],
  );
  const resolvedPassportCountry = useMemo(
    () => resolvePassportCountry(passportQuery),
    [passportQuery],
  );

  function selectPassportCountry(country: PassportCountry) {
    setPassportQuery(country.name);
    setPassportError("");
    setIsPassportOpen(false);
  }

  function toggleLifestyle(option: string) {
    setLifestyles((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const passportField = event.currentTarget.elements.namedItem("passport");
    const submittedPassportQuery =
      passportField instanceof HTMLInputElement
        ? passportField.value
        : passportQuery;
    const submittedPassportCountry = resolvePassportCountry(
      submittedPassportQuery,
    );
    const submittedPassportSuggestions = getPassportCountrySuggestions(
      submittedPassportQuery,
    );

    if (!submittedPassportCountry) {
      setPassportError(
        submittedPassportSuggestions.length > 0
          ? `Choose a valid country. Did you mean ${submittedPassportSuggestions[0].name}?`
          : "No matching passport country was found.",
      );
      setIsPassportOpen(true);
      return;
    }

    const params = new URLSearchParams({
      budget,
      passport: submittedPassportCountry.name,
      workType,
    });

    if (shouldAskSponsorship) {
      params.set("needsSponsorship", needsSponsorship);
    }

    lifestyles.forEach((lifestyle) => {
      params.append("lifestyle", lifestyle);
      params.set(`priority:${lifestyle}`, String(priorityWeight(priorities, lifestyle)));
    });

    setIsNavigating(true);
    router.push(`/recommendations?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[0_18px_50px_rgba(23,32,29,0.08)] sm:grid-cols-2 sm:p-5"
    >
      <div className="flex items-start justify-between gap-4 border-b border-[#e3e8df] pb-5 sm:col-span-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.12em] text-[var(--accent)]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Personalized search
          </p>
          <h2 className="mt-1 text-xl font-black tracking-[-0.02em] text-[#17201d]">Build your city shortlist</h2>
          <p className="mt-1 text-sm leading-6 text-[#6d7872]">Tell us what matters most. You can change every filter later.</p>
        </div>
        <span className="hidden shrink-0 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold text-[var(--ink)] sm:inline-flex">About 1 min</span>
      </div>

      {account.user && <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <Button type="button" variant="outline" size="sm" disabled={savingPreferences || account.loading} onClick={async () => {
          setSavingPreferences(true); setSaveMessage("");
          try { await account.mutate({ action: "preferences", preferences: { budget: Number(budget), passport: resolvedPassportCountry?.name ?? passportQuery, workType, needsSponsorship, lifestyles, priorities: normalizePriorities(priorities, lifestyles) } }); setSaveMessage("Preferences saved to your account."); }
          catch (error) { setSaveMessage(error instanceof Error ? error.message : "Could not save preferences."); }
          finally { setSavingPreferences(false); }
        }}>{savingPreferences ? "Saving…" : "Save preferences"}</Button>
        {account.data?.preferences && <Button type="button" variant="ghost" size="sm" onClick={() => { const p = account.data!.preferences!; setBudget(String(p.budget)); setPassportQuery(p.passport); setWorkType(p.workType); setNeedsSponsorship(p.needsSponsorship); const selected = p.lifestyles.filter(v => (lifestyleOptions as readonly string[]).includes(v)); setLifestyles(selected); setPriorities(normalizePriorities(p.priorities, selected)); setPassportError(""); setSaveMessage("Saved preferences restored."); }}>Restore saved preferences</Button>}
        {saveMessage && <p role="status" className="text-xs">{saveMessage}</p>}
      </div>}
      <Field>
        <Label htmlFor="budget">Monthly budget</Label>
        <div className="relative">
          <span
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-bold text-[#6d7872]"
            aria-hidden="true"
          >
            $
          </span>
          <Input
            id="budget"
            inputMode="numeric"
            min="1"
            max="1000000"
            required
            type="number"
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            className="pl-7"
          />
        </div>
      </Field>

      <Field>
        <Label htmlFor="passport">Passport</Label>
        <div className="relative">
          <Input
            id="passport"
            name="passport"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isPassportOpen}
            aria-controls="passport-suggestions"
            aria-invalid={Boolean(passportError)}
            value={passportQuery}
            onBlur={() => setIsPassportOpen(false)}
            onChange={(event) => {
              setPassportQuery(event.target.value);
              setPassportError("");
              setIsPassportOpen(true);
            }}
            onFocus={() => setIsPassportOpen(true)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                isPassportOpen &&
                !resolvedPassportCountry &&
                passportSuggestions[0]
              ) {
                event.preventDefault();
                selectPassportCountry(passportSuggestions[0]);
              }

              if (event.key === "Escape") {
                setIsPassportOpen(false);
              }
            }}
            placeholder="Type a country, e.g. US, China, India"
          />
          {isPassportOpen ? (
            <div
              id="passport-suggestions"
              role="listbox"
              className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-md border border-[var(--border)] bg-white p-1 shadow-lg"
            >
              {passportSuggestions.length > 0 ? (
                passportSuggestions.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    role="option"
                    aria-selected={country.code === resolvedPassportCountry?.code}
              className="flex w-full items-center justify-between gap-3 rounded px-3 py-2 text-left text-sm font-semibold text-[#263548] hover:bg-[#f0f2f6]"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectPassportCountry(country)}
                  >
                    <span>{country.name}</span>
                    <span className="shrink-0 text-xs font-black text-[#6d7872]">
                      {country.code}
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-sm font-semibold text-[#6d7872]">
                  No country found. Check the spelling or try a country code.
                </p>
              )}
            </div>
          ) : null}
        </div>
        {passportError ? (
          <p className="text-sm font-semibold text-[#be4960]">{passportError}</p>
        ) : null}
      </Field>

      <Field>
        <Label htmlFor="workType">Primary goal</Label>
        <Select
          id="workType"
          value={workType}
          onChange={(event) => setWorkType(event.target.value)}
        >
          {workTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </Select>
      </Field>

      {shouldAskSponsorship ? (
        <Field>
          <Label htmlFor="needsSponsorship">Need sponsorship</Label>
          <Select
            id="needsSponsorship"
            value={needsSponsorship}
            onChange={(event) => setNeedsSponsorship(event.target.value)}
          >
            <option>Yes</option>
            <option>No</option>
            <option>Maybe Later</option>
          </Select>
        </Field>
      ) : null}

      <details className="rounded-xl border border-[var(--border)] p-4 sm:col-span-2">
        <summary className="cursor-pointer text-sm font-semibold text-[var(--foreground)]">What matters to you <span className="ml-2 font-normal text-[var(--muted)]" aria-live="polite">{priorityCountLabel}</span></summary>
      <fieldset className="mt-4 grid gap-3">
        <legend className="sr-only">Lifestyle priorities</legend>
        <p className="text-xs leading-5 text-[var(--muted)]">Choose what matters most in your next city.</p>
        <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
          {lifestyleOptionGroups.map((group) => (
            <div
              key={group.label}
              className="grid content-start gap-2"
            >
              <p className="border-b border-[var(--border)] pb-2 text-xs font-semibold text-[#617080]">
                {group.label}
              </p>
              <div className="grid gap-1">
                {group.options.map((option) => {
                  const isSelected = lifestyles.includes(option);

                  return (
                    <label
                      key={option}
                      className={cn(
                        "flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border px-2.5 py-2 text-sm font-medium transition-colors focus-within:ring-2 focus-within:ring-[var(--accent)] focus-within:ring-offset-2",
                        isSelected
                          ? "border-[#efc9bd] bg-[var(--accent-soft)] text-[var(--ink)]"
                          : "border-transparent text-[#33445a] hover:bg-[var(--surface-soft)]",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleLifestyle(option)}
                        className="sr-only"
                      />
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition",
                          isSelected
                            ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                            : "border-[#b5bfcc] bg-white text-transparent",
                        )}
                        aria-hidden="true"
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span>{option}<span className="block text-xs font-normal text-[var(--muted)]">{({ "Lower Living Costs": "Monthly estimate · includes housing", "University Access": "Mapped higher-education locations", "No-car Lifestyle": "Mapped transit density · not journey times", "Mild Weather": "Long-term temperature averages" } as Record<string, string>)[option]}</span></span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </fieldset>
      </details>
      {lifestyles.length > 0 && <fieldset className="grid gap-3 rounded-xl border border-[var(--border)] p-4 sm:col-span-2"><legend className="px-1 text-sm font-semibold">Set weights for your selections</legend><p className="text-xs text-[var(--muted)]">Only choices selected above appear here. Set each weight: 1×, 2×, or 3×. Higher weights have more influence on your matches.</p>{lifestyles.map(option => <div key={option} className="flex flex-wrap items-center justify-between gap-2"><Label htmlFor={`importance-${option}`}>{option}</Label><Select id={`importance-${option}`} className="h-9 w-auto max-w-full text-xs" value={priorityWeight(priorities, option)} onChange={event => setPriorities(current => ({ ...current, [option]: Number(event.target.value) }))}>{[1, 2, 3].map(weight => <option key={weight} value={weight}>{priorityLabels[weight]} · {weight}×</option>)}</Select></div>)}</fieldset>}

      <div className="sm:col-span-2">
        <p className="text-xs font-medium text-[#6d7872]">
          No sign-up needed · Results are instant
        </p>
      </div>

      <div className="grid gap-2 border-t border-[#e3e8df] pt-5 sm:col-span-2 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-sm font-bold text-[#17201d]">Ready to explore?</p>
          <p className="text-xs leading-5 text-[#6d7872]">
            We’ll rank cities around your budget and {priorityCountLabel}.
          </p>
        </div>
        <Button
          type="submit"
          size="lg"
          variant="accent"
          disabled={isNavigating}
          className="mt-1 min-w-64 rounded-lg shadow-[0_8px_20px_rgba(0,138,122,0.2)] sm:mt-0"
        >
          {isNavigating ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Search className="h-4 w-4" aria-hidden="true" />
          )}
          {isNavigating ? "Building your matches…" : ctaLabel}
          {!isNavigating ? (
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          ) : null}
        </Button>
      </div>
    </form>
  );
}
