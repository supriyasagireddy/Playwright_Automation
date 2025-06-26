import{test, expect} from '@playwright/test';

// test('Test with popup alerts', async ({ page }) => {
//     // Navigate to the URL
//     await page.goto('https://www.selenium.dev/documentation/webdriver/interactions/alerts/');

//     page.once('dialog',dialog => {
//         // Accept the dialog
//         dialog.accept();
//         console.log(`Dialog type is : ${dialog.type()}`); // Log the type of dialog

//         console.log(`Alert message is : ${dialog.message()}`);
//     });
//     await page.getByText('See an example alert',{exact : true}).click();
// });

test('Test with popup', async ({ page }) => {
    // Navigate to the URL
    await page.goto('https://www.selenium.dev/documentation/webdriver/interactions/alerts/');

    page.once('dialog',dialog => {
        // Accept the dialog
        // dialog.accept();
        dialog.dismiss(); // Dismiss the confirm dialog
         console.log(`Dialog type is : ${dialog.type()}`); // Log the type of dialog

        console.log(`Alert message is : ${dialog.message()}`);
    });
    await page.getByText('See a sample confirm',{exact : true}).click();
});

test('Test with promt popup', async ({ page }) => {
    // Navigate to the URL
    await page.goto('https://www.selenium.dev/documentation/webdriver/interactions/alerts/');

    page.once('dialog',async(dialog)  => {
        console.log(`Dialog type is : ${dialog.type()}`); // Log the type of dialog
        // Accept the dialog
        console.log(`Alert message is : ${dialog.message()}`);
        await dialog.accept('playwright'); // Accept the prompt dialog with a value

    });
    await page.getByText('See a sample prompt',{exact : true}).click();
});