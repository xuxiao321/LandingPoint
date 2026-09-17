import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UpcomingEvents } from "@/components/city/upcoming-events";

const response = {
  cityName: "Brisbane",
  fetchedAt: "2026-09-16T00:00:00.000Z",
  live: true,
  note: "Verified event listings.",
  listingUrls: {
    ticketmaster: "https://example.com/tickets",
    eventbrite: "https://example.com/events",
  },
  events: [
    {
      id: "business-1",
      name: "Founder Meetup",
      category: "Business",
      startDate: "2026-10-01",
      venue: "City Hall",
      url: "https://example.com/founders",
      source: "Organizer",
      checkedAt: "2026-09-16T00:00:00.000Z",
    },
    {
      id: "music-1",
      name: "River Concert",
      category: "Music",
      startDate: "2026-10-02",
      venue: "Riverstage",
      url: "https://example.com/music",
      source: "Venue",
      checkedAt: "2026-09-16T00:00:00.000Z",
    },
  ],
};

describe("UpcomingEvents", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads events and filters them by category", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => response,
    });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(<UpcomingEvents slug="brisbane" />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading events");
    expect(await screen.findByText("Founder Meetup")).toBeInTheDocument();
    expect(screen.getByText("River Concert")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/cities/brisbane/events",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );

    await user.click(screen.getByRole("button", { name: "Music" }));

    expect(screen.queryByText("Founder Meetup")).not.toBeInTheDocument();
    expect(screen.getByText("River Concert")).toBeInTheDocument();
  });

  it("shows a retryable error when loading fails", async () => {
    const fetchMock = vi.fn().mockRejectedValueOnce(new Error("Network down"));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(<UpcomingEvents slug="brisbane" />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Network down");
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => response });
    await user.click(screen.getByRole("button", { name: "Refresh events" }));

    expect(await screen.findByText("Founder Meetup")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
