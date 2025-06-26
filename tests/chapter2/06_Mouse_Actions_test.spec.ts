import{test,expect}from '@playwright/test';

test('Drag and Drop Test', async ({ page }) => {

    // Navigate to YouTube
    await page.goto("https://www.youtube.com/");

    //click on the search bar
    await page.getByRole('combobox', { name: 'Search' }).click();
    //fill the search bar with text
    await page.getByRole('combobox', { name: 'Search' }).fill('Playwright tutorial');
    await page.getByRole('combobox', { name: 'Search' }).press('Enter');

    // await page.getByRole('link', { name: 'Playwright Beginner Tutorials' }).click({button: 'right'});
        // await page.getByRole('link', { name: 'Playwright Beginner Tutorials' }).click({button: 'left'});
            //await page.getByRole('link', { name: 'Playwright Beginner Tutorials' }).click({button: 'middle'});


    //MOUSE HOVER
    await page.getByLabel('Search with your voice').hover();

    //MOUSE doubleCLICK
        await page.getByLabel('Search with your voice').dblclick();

    
    
});