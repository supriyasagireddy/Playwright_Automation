import { test, expect } from '@playwright/test';
const data = require('../../src/test-data/qa/api-responsev1.json');

test('Full flow: login, protocol selection, edit popup, form validation', async ({ browser }) => {
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  // Step 1: Login
  await page.goto(data.url);
  await page.waitForSelector(data.login.usernameSelector);
  await page.fill(data.login.usernameSelector, data.username);
  await page.fill(data.login.passwordSelector, data.password);
  await page.click(data.login.submitSelector);

  // Step 2: Open protocol
  const protocolLocator = page.locator(`text=${data.protocolLink.text}`);
  await expect(protocolLocator).toBeVisible();

  const [protocolPage] = await Promise.all([
    context.waitForEvent('page'),
    protocolLocator.click()
  ]);
  await protocolPage.waitForLoadState();

  // Step 3: Click Edit
  const editButton = protocolPage.locator(data.editPopup.editButtonSelector);
  await editButton.waitFor({ state: 'visible' });

  const [editPage] = await Promise.all([
    context.waitForEvent('page'),
    editButton.click()
  ]);
  await editPage.waitForLoadState();

  // // Step 4: Optional re-login
  // const userField = editPage.locator(data.login.usernameSelector);
  // if (await userField.isVisible().catch(() => false)) {
  //   await editPage.fill(data.login.usernameSelector, data.username);
  //   await editPage.fill(data.login.passwordSelector, data.password);
  //   await editPage.click(data.login.submitSelector);
  //   await editPage.waitForLoadState();
  // }

  // Step 5: Validate final popup heading
  await expect(editPage.getByText(data.finalPopup.text)).toBeVisible();

  // Step 6: Dynamic field validation
  for (const field of data.fields) {
  const el = editPage.locator(field.selector);
  await expect(el).toBeVisible();

  const label = `[${field.type.toUpperCase()}] ${field.selector}`;

  if (field.type === 'label') {
    const actual = await el.innerText();
    console.log(`🧪 ${label} — expecting text:\n   → "${field.text}"\n   ← Found: "${actual}"`);
    await expect(actual.trim()).toBe(field.text.trim());
  }

  if (field.type === 'textbox') {
    if (field.value) {
      const actual = await el.inputValue();
      console.log(`🧪 ${label} — expecting value:\n   → "${field.value}"\n   ← Found: "${actual}"`);
      await expect(actual).toBe(field.value);
    }
    if (field.readonly) {
      const hasAttr = await el.getAttribute('readonly');
      console.log(`🧪 ${label} — expecting readonly:\n   → Found: "${hasAttr}"`);
      await expect(hasAttr).not.toBeNull();
    }
    if (field.class) {
      const actualClass = await el.getAttribute('class');
      console.log(`🧪 ${label} — expecting class to match /${field.class}/\n   ← Found: "${actualClass}"`);
      await expect(actualClass).toMatch(new RegExp(field.class));
    }
  }

  if (field.type === 'textarea') {
    const isEditable = await el.isEditable();
    console.log(`🧪 ${label} — expecting editable: ${isEditable}`);
    await expect(el).toBeEditable();
  }

  if (field.type === 'select') {
    if (field.options) {
      for (const option of field.options) {
        const optionExists = await el.locator('option').evaluateAll((opts, val) =>
          opts.some(o => o.textContent?.trim() === val), option);
        console.log(`🧪 ${label} — option "${option}" present: ${optionExists}`);
        expect(optionExists).toBeTruthy();
      }
    }
    if (field.value) {
      const actual = await el.inputValue();
      console.log(`🧪 ${label} — expecting selected value:\n   → "${field.value}"\n   ← Found: "${actual}"`);
      expect(actual).toContain(field.value);
    }
  }

  if (field.type === 'checkbox') {
    const isChecked = await el.isChecked();
    console.log(`🧪 ${label} — expecting checked: ${field.checked} ← Found: ${isChecked}`);
    if (field.checked) {
      await expect(el).toBeChecked();
    } else {
      await expect(el).not.toBeChecked();
    }
  }
}


  console.log('✅ All fields validated successfully');
});