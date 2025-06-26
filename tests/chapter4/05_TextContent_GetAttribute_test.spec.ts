import{test,expect}from'@playwright/test';

test('GetAttribute Test', async ({ page }) => {
    // Navigate to the page
    await page.goto("https://www.youtube.com");

    const name=await page.locator('[aria-label="Try searching to get started"]').textContent();
    const nname=await page.locator('[aria-label="Try searching to get started"]').innerText();

    console.log("Text content of the element:", name);

    expect(name).toBe('Try searching to get started');

    const attributeValue=await page.locator('[id="icon"]').first().getAttribute('class');
    console.log("Attribute value of the element:", attributeValue);
    expect(attributeValue).toBe('guide-icon style-scope ytd-mini-guide-entry-renderer');
});