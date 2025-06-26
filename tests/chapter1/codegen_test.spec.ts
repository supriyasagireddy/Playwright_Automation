import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('https://www.youtube.com/');
    await page.getByRole('combobox', { name: 'Search' }).click();
    await page.getByRole('combobox', { name: 'Search' }).fill('samantha speech');
    await page.getByRole('combobox', { name: 'Search' }).press('Enter');
    await expect(page).toHaveURL(/search_query=samantha\+speech/);

    const link = page.getByRole('link', { name: /Rise Again ❤️ \| Samantha Ruth Prabhu/i });
    await link.waitFor({ state: 'visible' });
    await expect(link).toBeVisible();

    await link.click();
    await expect(page).toHaveURL(/(watch\?v=|shorts\/)/);
});
