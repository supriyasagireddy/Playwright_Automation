import{test, expect} from '@playwright/test';

const searchKeywods=['playwright', 'selenium', 'cypress'];
for (const searchKeywod of searchKeywods) {
    test(`parameterized test with multiple data sets ${searchKeywod}`, async ({ page }) => {
    //Navigate to Google
    await page.goto('https://www.youtube.com/');

    // Fill the search input with the term 'playwright'
    await page.getByRole('combobox', { name: 'Search' }).fill(searchKeywod);
    // Press Enter to perform the search
    await page.getByRole('combobox', { name: 'Search' }).press('Enter');

    // Wait for the results to load and verify the title contains the search keyword
    await expect(page).toHaveTitle(new RegExp(searchKeywod, 'i'));
});
}

