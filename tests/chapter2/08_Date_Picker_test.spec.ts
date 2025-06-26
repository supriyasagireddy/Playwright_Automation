import {test, expect} from '@playwright/test';

test('Keyboard Actions Test', async ({ page }) => {

    // Navigate to YouTube
    await page.goto("https://jqueryui.com/datepicker/");

     const iframe=page.frameLocator('[class="demo-frame"]');

    // await iframe.locator('[id="datepicker"]').fill('12/14/2023');

    //selecting dynamic date

    // await iframe.locator('[id="datepicker"]').click();
    // await iframe.locator('.ui-datepicker-today').click()

    //selectingg past date
    // await iframe.locator('[id="datepicker"]').click();
    // await iframe.locator('[title="Prev"]').click();
    // await iframe.locator('text="15"').click();

    //selecting future date
    await iframe.locator('[id="datepicker"]').click();
    await iframe.locator('[title="Next"]').click();
    await iframe.locator('text="15"').click();




});