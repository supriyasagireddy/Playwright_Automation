import{test, expect} from '@playwright/test';

test('Test with multiple browsers and context', async ({ page, browser }) => {
    //Navigate to url
    await page.goto('https://www.google.com/');

    // Fill the search input with the term 'playwright'
    await page.getByRole('combobox', { name: 'Search' }).fill('playwright');
    // Press Enter to perform the search
    await page.getByRole('combobox', { name: 'Search' }).press('Enter');

    // Wait for the results to load and verify the title contains 'playwright'
    await expect(page).toHaveTitle(/playwright/i, { timeout: 5000 }); // Timeout for expect assertion

    // Create a new browser context
    const context = await browser.newContext();
    // Create a new page in the new context 
    const newPage = await context.newPage();
    // Navigate to the same URL in the new context
    await newPage.goto('https://www.google.com/');
    // Fill the search input with the term 'playwright' in the new context
    await newPage.getByRole('combobox', { name: 'Search' }).fill('playwright');
    // Press Enter to perform the search in the new context
    await newPage.getByRole('combobox', { name: 'Search' }).press('Enter');
    // Wait for the results to load and verify the title contains 'playwright' in the new context
    await expect(newPage).toHaveTitle(/playwright/i, { timeout: 5000 }); // Timeout for expect assertion in new context

    //Create new tab
    const newTab = await context.newPage();
    // Navigate to the same URL in the new tab
    await newTab.goto('https://www.google.com/');
    // Fill the search input with the term 'playwright' in the new tab
    await newTab.getByRole('combobox', { name: 'Search' }).fill('playwright');
    // Press Enter to perform the search in the new tab
    await newTab.getByRole('combobox', { name: 'Search' }).press('Enter');

});