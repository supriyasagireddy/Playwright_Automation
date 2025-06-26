import {test,expect} from '@playwright/test';

test('Visual Testing with Playwright', async ({ page }) => {
    // Navigate to the website
    await page.goto('https://portal.afterbuy.in/');

    // Compare the body screenshot with the baseline image
    await expect(page.locator('body')).toHaveScreenshot('afterbuy-homepage-main.png');

    //taking screenshot of the whole page and comparing it with the baseline image
    //await expect(page.locator('body')).toHaveScreenshot('afterbuy-homepage-main.png');
   
});

test.only('Element Visual Testing with Playwright', async ({ page }) => {
    // Navigate to the website
    await page.goto('https://portal.afterbuy.in/');

    const Element = page.locator('[class="auth-form-light text-left py-5 px-4 px-sm-5"]');

    // Take a screenshot of the main content only for more stability, with increased timeout and allowed pixel difference
    await expect(Element).toHaveScreenshot('afterbuy-homepage-element-main.png');

});

