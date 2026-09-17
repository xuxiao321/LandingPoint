import { expect, test } from "@playwright/test";

test("a visitor can create a personalized city shortlist", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Find the place that feels right/i }),
  ).toBeVisible();
  await page.getByLabel("Monthly budget").fill("4200");
  await page.getByLabel("Passport").fill("Canada");
  await page.getByRole("option", { name: /Canada/ }).click();
  await page.getByLabel("Primary goal").selectOption("Travel / Short Stay");
  await page.getByRole("button", { name: /Find my next short-stay city/i }).click();

  await expect(page).toHaveURL(/\/recommendations\?.*budget=4200/);
  await expect(
    page.getByRole("heading", { name: "Find your next city" }),
  ).toBeVisible();
  await expect(page.getByText(/Ordered by your preferences/)).toBeVisible();
});

test("a visitor can open a city profile from the home page", async ({ page }) => {
  await page.goto("/");

  const destinationSection = page.getByRole("region", {
    name: "Somewhere new starts here",
  });
  const firstCityLink = destinationSection.locator('a[href^="/city/"]').first();
  const cityName = (await firstCityLink.getByRole("heading").textContent())?.trim();
  expect(cityName).toBeTruthy();
  await firstCityLink.click();

  await expect(page).toHaveURL(/\/city\/[a-z0-9-]+$/);
  await expect(page.getByRole("heading", { level: 1, name: cityName! })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Everyday life" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Upcoming events" })).toBeVisible();
});
