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
});

test('Test 2', async ({ page, browser }) => {
    expect(true).toBe(false); // This will fail
});

test('Test 3', async ({ page, browser }) => {
        expect(true).toBe(false); // This will fail
});