import{test,expect}from '@playwright/test';

test('Drag and Drop Test', async ({ page }) => {
    // Navigate to the Drag and Drop demo page
    await page.goto('https://jqueryui.com/droppable/');

    const iframe=page.frameLocator('[class="demo-frame"]');

    // Locate the elements to be dragged and dropped
    const source = iframe.locator('[id="draggable"]');
    const target = iframe.locator('[id="droppable"]');

    // Perform drag and drop action
    await source.dragTo(target);


});