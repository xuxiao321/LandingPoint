"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Label, Select } from "@/components/ui/field";
import {
  lifestyleOptions,
  movingTimelineOptions,
  visaStatusOptions,
  workTypes,
} from "@/lib/data";

export function HomeSearch() {
  const router = useRouter();
  const [budget, setBudget] = useState("3000");
  const [passport, setPassport] = useState("United States");
  const [visaStatus, setVisaStatus] = useState("Need Sponsorship");
  const [needsSponsorship, setNeedsSponsorship] = useState("Yes");
  const [workType, setWorkType] = useState("Software Engineering");
  const [lifestyle, setLifestyle] = useState("Career Growth");
  const [timeline, setTimeline] = useState("3-6 Months");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams({
      budget,
      passport,
      visaStatus,
      needsSponsorship,
      workType,
      lifestyle,
      timeline,
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
        <Input
          id="passport"
          value={passport}
          onChange={(event) => setPassport(event.target.value)}
        />
      </Field>

      <Field>
        <Label htmlFor="visaStatus">Visa Status</Label>
        <Select
          id="visaStatus"
          value={visaStatus}
          onChange={(event) => setVisaStatus(event.target.value)}
        >
          {visaStatusOptions.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </Select>
      </Field>

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

      <Field>
        <Label htmlFor="workType">Work Field</Label>
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

      <Field>
        <Label htmlFor="lifestyle">Lifestyle</Label>
        <Select
          id="lifestyle"
          value={lifestyle}
          onChange={(event) => setLifestyle(event.target.value)}
        >
          {lifestyleOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </Select>
      </Field>

      <Field>
        <Label htmlFor="timeline">Moving Timeline</Label>
        <Select
          id="timeline"
          value={timeline}
          onChange={(event) => setTimeline(event.target.value)}
        >
          {movingTimelineOptions.map((option) => (
            <option key={option}>{option}</option>
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
