//Iterate through all the matching elements in playwright 
//-For of loop
//-for loop
//-for loop +nth()method

import {test, expect} from '@playwright/test';

test('Iterating Elements Test', async ({ page }) => {
    //navigate to the page
    await page.goto('https://portal.afterbuy.in/#/login');
    
    //enter email
    await page.getByRole('textbox', { name: 'Username' }).fill('afterbuyprodadmin@ingwalabs.com');
    //enter password
    await page.getByRole('textbox', { name: 'Password' }).fill('Afterbuy@123');
    //click on SIGN IN button
    await page.getByText('SIGN IN').click();

    //expect the URL to be the dashboard page
    await expect(page).toHaveURL('https://portal.afterbuy.in/#/admin/dashboard');

    const column_names=await page.$$('[class="col-md-3"]');
    //Iterate through the elements using for of loop
    for (const column_name of column_names) {
        const text= await column_name.textContent();
        console.log("Column Name:", text);
        
    }
    console.log("----------------------------------------------");
    //Iterate through the elements using for loop
    for (let i = 0; i < column_names.length; i++) {
        const text = await column_names[i].textContent();
        console.log("Column Name:", text);
    }

    console.log("----------------------------------------------");

    
    const column_names2=await page.locator('[class="col-md-3"]');
    //Iterate through the elements using for loop with nth() method
    for (let i = 0; i < await column_names2.count(); i++) {
        const text = await column_names2.nth(i).textContent();
        console.log("Column Name:", text);
    }




});

