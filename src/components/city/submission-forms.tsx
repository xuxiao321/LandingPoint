"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Label, Select, Textarea } from "@/components/ui/field";

export function ExperienceSubmission() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-lg border border-[#d7ded4] bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-black text-[#17201d]">I Lived Here</h3>
        {submitted ? (
          <span className="rounded-md bg-[#e5f5ef] px-2.5 py-1 text-xs font-bold text-[#007365]">
            Saved draft
          </span>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <Label htmlFor="duration">Duration</Label>
          <Select id="duration">
            <option>1-3 Months</option>
            <option>3-12 Months</option>
            <option>1-3 Years</option>
            <option>3+ Years</option>
          </Select>
        </Field>
        <Field>
          <Label htmlFor="cost">Cost Compared To Expectation</Label>
          <Select id="cost">
            <option>Much Lower</option>
            <option>Lower</option>
            <option>Same</option>
            <option>Higher</option>
            <option>Much Higher</option>
          </Select>
        </Field>
        <Field>
          <Label htmlFor="recommend">Would Recommend</Label>
          <Select id="recommend">
            <option>Yes</option>
            <option>No</option>
          </Select>
        </Field>
        <Field>
          <Label htmlFor="visaPath">Visa / Relocation Path</Label>
          <Select id="visaPath">
            <option>F-1 / OPT</option>
            <option>H-1B</option>
            <option>Green Card</option>
            <option>Citizen</option>
            <option>No Visa Needed</option>
          </Select>
        </Field>
        <Field>
          <Label htmlFor="sponsorExperience">Sponsor Experience</Label>
          <Select id="sponsorExperience">
            <option>Easy To Find</option>
            <option>Possible But Competitive</option>
            <option>Difficult</option>
            <option>Not Applicable</option>
          </Select>
        </Field>
        <Field>
          <Label htmlFor="pros">Pros</Label>
          <Input id="pros" placeholder="Cheap food, friendly community" />
        </Field>
        <Field className="sm:col-span-2">
          <Label htmlFor="cons">Cons</Label>
          <Input id="cons" placeholder="Rising rent" />
        </Field>
        <Field className="sm:col-span-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea id="notes" />
        </Field>
      </div>

      <Button type="submit">
        <Send className="h-4 w-4" aria-hidden="true" />
        Submit Experience
      </Button>
    </form>
  );
}

export function LocalSignalSubmission() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-lg border border-[#d7ded4] bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-black text-[#17201d]">
          Local Signal Submission
        </h3>
        {submitted ? (
          <span className="rounded-md bg-[#e5f5ef] px-2.5 py-1 text-xs font-bold text-[#007365]">
            Submitted
          </span>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <Label htmlFor="resident">Are You A Local Resident</Label>
          <Select id="resident">
            <option>Yes</option>
            <option>No</option>
          </Select>
        </Field>
        <Field>
          <Label htmlFor="years">Years In City</Label>
          <Select id="years">
            <option>1-3</option>
            <option>3-10</option>
            <option>10+</option>
          </Select>
        </Field>
        <Field>
          <Label htmlFor="rentTrend">Rent Trend</Label>
          <Select id="rentTrend">
            <option>Up</option>
            <option>Same</option>
            <option>Down</option>
          </Select>
        </Field>
        <Field>
          <Label htmlFor="safetyTrend">Safety Trend</Label>
          <Select id="safetyTrend">
            <option>Up</option>
            <option>Same</option>
            <option>Down</option>
          </Select>
        </Field>
        <Field>
          <Label htmlFor="trafficTrend">Traffic Trend</Label>
          <Select id="trafficTrend">
            <option>Better</option>
            <option>Same</option>
            <option>Worse</option>
          </Select>
        </Field>
        <Field>
          <Label htmlFor="costTrend">Cost Of Living Trend</Label>
          <Select id="costTrend">
            <option>Up</option>
            <option>Same</option>
            <option>Down</option>
          </Select>
        </Field>
      </div>

      <Button type="submit">
        <Send className="h-4 w-4" aria-hidden="true" />
        Submit Local Signal
      </Button>
    </form>
  );
}
