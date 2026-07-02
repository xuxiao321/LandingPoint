"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Label, Select } from "@/components/ui/field";
import {
  isSponsorshipRelevantGoal,
  lifestyleOptionGroups,
  movingTimelineOptionGroups,
  passportCountries,
  type PassportCountry,
  workTypes,
} from "@/lib/data";

const commonPassportCountryCodes = ["US", "CN", "CA", "GB", "IN", "AU"];
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
  const router = useRouter();
  const [budget, setBudget] = useState("3000");
  const [passportQuery, setPassportQuery] = useState("United States");
  const [passportError, setPassportError] = useState("");
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [needsSponsorship, setNeedsSponsorship] = useState("Yes");
  const [workType, setWorkType] = useState("Work / Career");
  const [lifestyles, setLifestyles] = useState<string[]>([
    "Career Growth",
    "Immigrant Community",
  ]);
  const [timeline, setTimeline] = useState("3-6 Months");
  const shouldAskSponsorship = isSponsorshipRelevantGoal(workType);
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
      timeline,
    });

    if (shouldAskSponsorship) {
      params.set("needsSponsorship", needsSponsorship);
    }

    lifestyles.forEach((lifestyle) => {
      params.append("lifestyle", lifestyle);
    });

    router.push(`/recommendations?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-lg border border-[#d7ded4] bg-white p-4 shadow-sm sm:grid-cols-2 lg:p-5"
    >
      <Field>
        <Label htmlFor="budget">Monthly Budget</Label>
        <Input
          id="budget"
          inputMode="numeric"
          min="0"
          type="number"
          value={budget}
          onChange={(event) => setBudget(event.target.value)}
        />
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
              className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-md border border-[#d7ded4] bg-white p-1 shadow-lg"
            >
              {passportSuggestions.length > 0 ? (
                passportSuggestions.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    role="option"
                    aria-selected={country.code === resolvedPassportCountry?.code}
                    className="flex w-full items-center justify-between gap-3 rounded px-3 py-2 text-left text-sm font-semibold text-[#17201d] hover:bg-[#eef3ef]"
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
        <Label htmlFor="workType">Primary Goal</Label>
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
          <Label htmlFor="needsSponsorship">Need Sponsorship</Label>
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

      <Field className="sm:col-span-2">
        <Label>Lifestyle Priorities</Label>
        <div className="grid gap-4 sm:grid-cols-2">
          {lifestyleOptionGroups.map((group) => (
            <div key={group.label} className="grid gap-2">
              <p className="text-xs font-black uppercase text-[#6d7872]">
                {group.label}
              </p>
              <div className="grid gap-2">
                {group.options.map((option) => (
                  <label
                    key={option}
                    className="flex min-h-10 cursor-pointer items-center gap-2 rounded-md border border-[#d7ded4] bg-[#f7f8f3] px-3 py-2 text-sm font-semibold text-[#17201d] transition hover:border-[#008a7a]"
                  >
                    <input
                      type="checkbox"
                      checked={lifestyles.includes(option)}
                      onChange={() => toggleLifestyle(option)}
                      className="h-4 w-4 rounded border-[#aeb9aa] accent-[#008a7a]"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Field>

      <Field>
        <Label htmlFor="timeline">Moving Timeline</Label>
        <Select
          id="timeline"
          value={timeline}
          onChange={(event) => setTimeline(event.target.value)}
        >
          {movingTimelineOptionGroups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </optgroup>
          ))}
        </Select>
      </Field>

      <Button type="submit" size="lg" className="sm:col-span-2">
        <Search className="h-4 w-4" aria-hidden="true" />
        Find Migration-Friendly Cities
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </form>
  );
}
