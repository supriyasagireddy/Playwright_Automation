import {test, expect} from '@playwright/test';

test('Keyboard Actions Test', async ({ page }) => {

    // Navigate to YouTube
    await page.goto("https://www.youtube.com/");

// // Click on the search input
// await page.getByLabel('Search', {exact: true});
// // Locate the search input
// const searchInput = page.getByRole('combobox', { name: 'Search' }); 
// // Ensure the search input is visible
// await expect(searchInput).toBeVisible();
// // Click on the search input
// await searchInput.click();



// // Fill the search bar with text
// await searchInput.fill('Playwright tutorial');

// // Press Enter to search
// await searchInput.press('Enter');
//    //selecting and deleting text using keyboard actions
//     await searchInput.press('Control+A'); // Select all text
//     await searchInput.press('Backspace'); // Delete selected text

//     // Refill the search bar with new text
//     await searchInput.fill('Playwright tutorial updated');

//     // Press Enter to search again
//     await searchInput.press('Enter');
  

//     // Validate the URL contains the new search query
//     await expect(page).toHaveURL(/search_query=Playwright\+tutorial\+updated/);

    //press tab and enter

    await page.getByLabel('Search', {exact: true}).first().click();
    await page.keyboard.press('Tab'); // Navigate to the next focusable element
    await page.keyboard.press('Enter'); // Press Enter on the focused element
});