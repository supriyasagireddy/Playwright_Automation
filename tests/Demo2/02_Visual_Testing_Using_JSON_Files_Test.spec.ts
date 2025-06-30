import testPages from '../../src/test-data/qa/visualtestdata.json';
import { test, expect } from '@playwright/test';

for (const pageData of testPages) {
  test(`Visual Test - ${pageData.name}`, async ({ page }) => {
    await page.setViewportSize(pageData.viewport);
    await page.goto(pageData.url);
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot(`${pageData.name}.png`);
    //await expect(page).toHaveScreenshot(`${pageData.name}.png`);
  });
}
