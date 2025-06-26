import{test, expect} from '@playwright/test';
import { TIMEOUT } from 'dns';

const searchKeywods=['playwright', 'selenium', 'cypress'];
for (const searchKeywod of searchKeywods) {
    test(`parameterized test with multiple data sets ${searchKeywod}`, async ({ page }) => {
        test.setTimeout(1*60*1000); // Set timeout to 60 seconds for this test locally (test timeout)
    //Navigate to Google
    await page.goto('https://www.youtube.com/');

    // Fill the search input with the term 'playwright'
    await page.getByRole('combobox', { name: 'Search' }).fill(searchKeywod);
    // Press Enter to perform the search
    await page.getByRole('combobox', { name: 'Search' }).press('Enter');

    // Wait for the results to load and verify the title contains the search keyword
    await expect(page).toHaveTitle(new RegExp(searchKeywod, 'i'), { timeout: 5000 // Timeout for expect assertion locally
    });
});
}

