import{test,expect}from '@playwright/test';

test('Assertions Test', async ({ page }) => {
    //Navigate to the page
    await page.goto("https://www.youtube.com");

    //visibe, editable, enabled, empty
    await expect(page.getByPlaceholder('Search',{exact:true}).first()).toBeVisible();
    await expect(page.getByPlaceholder('Search',{exact:true}).first()).toBeEditable();
    await expect(page.getByPlaceholder('Search',{exact:true}).first()).toBeEnabled();
    await expect(page.getByPlaceholder('Search',{exact:true}).first()).toBeEmpty();

    //tohaveurl

    
    await page.getByPlaceholder('Search',{exact:true}).first().click();
    await page.getByPlaceholder('Search',{exact:true}).first().fill('playwright');
    await page.getByPlaceholder('Search',{exact:true}).first().press('Enter');
    await expect(page).toHaveURL('https://www.youtube.com/results?search_query=playwright');

    await expect(page).toHaveTitle('playwright - YouTube');

    await expect(page.locator('span[id="title"]')).toHaveCount(4)
});