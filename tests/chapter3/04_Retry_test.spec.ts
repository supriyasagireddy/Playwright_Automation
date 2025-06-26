// Importing Playwright test module
import { test, expect } from "@playwright/test";

test("should perform a Google search and verify results", async ({ page }) => {
  // Navigate to Google
  await page.goto("https://www.google.com/");
  await page.getByRole("combobox", { name: "Search" }).fill("playwright");
  // Press Enter to perform the search
  await page.getByRole("combobox", { name: "Search" }).press("Enter");

  // Skip CAPTCHA interaction as it cannot be automated
  console.log("Skipping CAPTCHA interaction.");
  // Wait for the results to load and verify the title
  await page
    .getByRole("link", { name: "Playwright: Fast and reliable" })
    .first()
    .click();
  await expect(page).toHaveURL("https://playwright.dev/");
  await expect(page).toHaveTitle(/Playwright/);
  await expect(page.getByRole("link", { name: "Get started" })).toBeVisible();
  // Click on the "Get started" link
  await page.getByRole("link", { name: "Get started" }).click();
  await expect(page.locator("h1")).toContainText("Installlation");
});
