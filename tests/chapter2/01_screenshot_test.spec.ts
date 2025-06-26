import { test, expect } from '@playwright/test';

test('YouTube Screenshot Test', async ({ page }) => {
    // Navigate to YouTube
    await page.goto('https://www.youtube.com');

    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');

    // Take a screenshot of a specific element (e.g., YouTube logo)
    const logo = await page.locator('#logo-icon').first();
    await logo.screenshot({ path: 'tests/screenshots/element_screenshot.png' });

    // Take a screenshot of the visible part of the page
    await page.screenshot({ path: 'tests/screenshots/single_page_screenshot.png' });

    // Take a full-page screenshot
    await page.screenshot({ path: 'tests/screenshots/full_page_screenshot.png', fullPage: true });

    console.log('Screenshots captured successfully!');
});