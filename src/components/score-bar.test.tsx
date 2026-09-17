import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScoreBar } from "@/components/score-bar";

describe("ScoreBar", () => {
  it("shows the label, formatted score, and matching bar width", () => {
    const { container } = render(
      <ScoreBar label="No-car Transit" score={7.9} accent="#5271d9" />,
    );

    expect(screen.getByText("No-car Transit")).toBeInTheDocument();
    expect(screen.getByText("7.9")).toBeInTheDocument();
    expect(container.querySelector('[style*="width: 79%"]')).toHaveStyle({
      width: "79%",
      backgroundColor: "rgb(82, 113, 217)",
    });
  });

  it("converts a decimal score to its percentage width", () => {
    const { container } = render(<ScoreBar label="Weather" score={4.1} />);

    expect(container.querySelector('[style*="width: 41%"]')).toBeInTheDocument();
  });
});
