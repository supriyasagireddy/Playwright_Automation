import { test, expect } from '@playwright/test';
const data = require('../../src/test-data/qa/pmsteststackdata.json');

test('Full flow: login, protocol open, edit, form field validations', async ({ browser }) => {
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  // Step 1: Login
  await page.goto('https://pmsteststack-sql-90104.cglia.internal/NewCustomer/userLogin.do');
  await page.fill('input[name="userId"]', data.login.username);
  await page.fill('input[name="password"]', data.login.password);
  await page.click('#loginid');

  // Step 2: Wait and click protocol ID (opens new page)
  const protocolLocator = page.locator(`text=${data.protocolId}`);
  await expect(protocolLocator).toBeVisible({ timeout: 10000 });

  const [protocolPage] = await Promise.all([
    context.waitForEvent('page'),
    protocolLocator.click()
  ]);
  await protocolPage.waitForLoadState();

  // Step 3: Click "Edit" button (opens edit popup)
  const editBtn = protocolPage.locator('a[role="button"][data-id="Edit"]');
  await editBtn.waitFor({ state: 'visible', timeout: 8000 });

  const [editPage] = await Promise.all([
    context.waitForEvent('page'),
    editBtn.click()
  ]);
  await editPage.waitForLoadState();

  // Step 4: Optional re-login inside edit popup
  const userField = editPage.locator('input[name="userId"]');
  if (await userField.isVisible().catch(() => false)) {
    await editPage.fill('input[name="userId"]', data.login.username);
    await editPage.fill('input[name="password"]', data.login.password);
    await editPage.click('#loginid');
    await editPage.waitForLoadState();
  }

  // Step 5: Loop and validate form fields
  for (const check of data.formChecks) {
  const fieldId = `#${check.captionId}_ob${check.objectId}`;
  const field = editPage.locator(fieldId);

  console.log(`🔎 Checking: ${fieldId} — expecting text: "${check.title}"`);

  try {
    await field.waitFor({ state: 'visible', timeout: 8000 });
    await expect(field).toContainText(check.title);
    console.log(`✅ Verified: ${check.title}`);
  } catch (err) {
    console.error(`❌ Failed to find/validate: ${fieldId}`);
    await editPage.screenshot({ path: `error-${check.captionId}.png` });
    throw err;
  }
}


  console.log('✅ All field validations passed.');
});
