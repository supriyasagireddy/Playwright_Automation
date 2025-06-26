import{test, expect} from '@playwright/test';

test('Read ENV File Test', async ({ page }) => {
    // Navigate to the page
    await page.goto(`${process.env.GOOGLE_URL}`); // Replace with your actual URL

    //Search with keywords
    await page.getByLabel('Search',{exact:true}).fill('Playwright by Testers Talk☑️');
    await page.getByLabel('Search',{exact:true}).press('Enter'); 

    
    

    
});