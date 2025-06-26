import{test,expect} from '@playwright/test';

test('Visual Testing with Playwright', async ({ page }) => {
    // Navigate to the website
    await page.goto('https://www.github.com');

    // Wait for the main content to be visible and stable
    await page.waitForSelector('main', { state: 'visible' });
    // Wait extra time for dynamic content and animations to settle
    await page.waitForTimeout(2000);
    // Take a screenshot of the main content only for more stability, with increased timeout and allowed pixel difference
    await expect(page.locator('main')).toHaveScreenshot('github-homepage-main.png', { timeout: 15000, maxDiffPixelRatio: 0.02 });
   
    await page.locator('[placeholder="you@domain.com"]').fill('sagireddypriya@gmail.com');
    await page.locator('[placeholder="you@domain.com"]').press('Enter');
    await page.waitForTimeout(2000);
    // Take a screenshot of the main content only for more stability, with increased timeout and allowed pixel difference
    await expect(page.locator('main')).toHaveScreenshot('github-homepage-main.png', { timeout: 15000, maxDiffPixelRatio: 0.02 });
   
});

test('Element Visual Testing with Playwright', async ({ page }) => {
    // Navigate to the website
    await page.goto('https://www.github.com');

    // Wait for the main content to be visible and stable
    await page.waitForSelector('main', { state: 'visible' });
    // Wait extra time for dynamic content and animations to settle
    await page.waitForTimeout(2000);

    const Element = page.locator('[class="lp-IntroVisuals-canvas"]');

    // Take a screenshot of the main content only for more stability, with increased timeout and allowed pixel difference
    await expect(page.locator('main')).toHaveScreenshot('github-homepage-main.png', { timeout: 15000, maxDiffPixelRatio: 0.02 });

    await page.locator('[placeholder="you@domain.com"]').fill('sagireddypriya@gmail.com');
    await page.locator('[placeholder="you@domain.com"]').press('Enter');
    await page.waitForTimeout(2000);
    // Take a screenshot of the main content only for more stability, with increased timeout and allowed pixel difference
    await expect(page.locator('main')).toHaveScreenshot('github-homepage-main.png', { timeout: 15000, maxDiffPixelRatio: 0.02 });
   
});