import {test, expect} from '@playwright/test';

test('CheckBox and Radio Button Test', async ({ page }) => {
    // Navigate to the page
    await page.goto('https://jqueryui.com/checkboxradio/');
    // Switch to the iframe containing the checkbox and radio button
    const frame = page.frameLocator('[class="demo-frame"]');
    // Check the first checkbox
    await expect(frame.locator('[for="radio-1"]')).not.toBeChecked();

    await frame.locator('[for="radio-1"]').check();
    // Verify the first checkbox is checked
    await expect(frame.locator('[for="radio-1"]')).toBeChecked();
});