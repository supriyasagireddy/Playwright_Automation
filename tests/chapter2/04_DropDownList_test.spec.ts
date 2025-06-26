import {test,expect} from '@playwright/test';

test('DropDown List Test', async ({ page }) => {
    // Navigate to Facebook
    await page.goto('https://www.facebook.com/');

    //Click on the "Create New Account" button
    await page.getByRole('button', { name: 'Create new account' }).click();

    //select the "Month" dropdown using value
    await page.getByLabel('Month').selectOption('4'); // March
    
    //select the "Month" dropdown using visible text 
    await page.getByLabel('Month').selectOption('Apr'); // April

    //validate all the options in the "Month" dropdown
    await expect(page.getByLabel('Month').locator('option')).toHaveText(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']); 

});