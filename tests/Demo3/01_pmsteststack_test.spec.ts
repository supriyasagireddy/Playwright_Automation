import { test, expect, BrowserContext, Page } from '@playwright/test';
const credentials = require('../../src/test-data/qa/api-responsev1.json');
const validationData = require('../../src/test-data/qa/api-response-v3.json');

function stripHTMLTags(text:String) {
  return text.replace(/<[^>]*>/g, '').replace(/\\:/g, ':').trim();
}

async function launchEditPage(context: BrowserContext, page: Page) {
  await page.goto(credentials.url);
  await page.fill(credentials.login.usernameSelector, credentials.username);
  await page.fill(credentials.login.passwordSelector, credentials.password);
  await page.click(credentials.login.submitSelector);

  const [protocolPage] = await Promise.all([
    context.waitForEvent('page'),
    page.locator(`text=${credentials.protocolLink.text}`).click()
  ]);
  await protocolPage.waitForLoadState();

  const editBtn = protocolPage.locator('a[role="button"][data-id="Edit"]');
  await editBtn.waitFor({ state: 'visible', timeout: 8000 });

  const [editPage] = await Promise.all([
    context.waitForEvent('page'),
    editBtn.click()
  ]);
  await editPage.waitForLoadState();
  return editPage;
}

test.skip('Test Case 1 — Total Visible Fields', async ({ browser }) => {
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const editPage = await launchEditPage(context, page);

  const headingLocator = editPage.getByText(credentials.finalPopup.text);
  const headingVisible = await headingLocator.isVisible().catch(() => false);
  console.log(`\n🔍 Final popup heading: "${credentials.finalPopup.text}" → ${headingVisible ? 'Visible' : 'NOT Visible'}`);
  await expect(headingLocator).toBeVisible();

  let total = 0;
  let visible = 0;

  for (const block of validationData.results) {
    for (const field of block.captions) {
      const locator = editPage.locator(`#${field.caption_id}`);
      total++;
      if (await locator.isVisible().catch(() => false)) visible++;
      else console.log(`❌ Not visible → ${field.caption_id}`);
    }
  }
  console.log(`\n✅ Test Case 1: ${visible} visible out of ${total} fields.`);
});

test.skip('Test Case 2 — Visible Labels Count', async ({ browser }) => {
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const editPage = await launchEditPage(context, page);

  const headingLocator = editPage.getByText(credentials.finalPopup.text);
  const headingVisible = await headingLocator.isVisible().catch(() => false);
  console.log(`\n🔍 Final popup heading: "${credentials.finalPopup.text}" → ${headingVisible ? 'Visible' : 'NOT Visible'}`);
  await expect(headingLocator).toBeVisible();

  let totalLabels = 0;
  let visibleLabels = 0;

  for (const block of validationData.results) {
    for (const field of block.captions) {
      if (field.type === 'label') {
        totalLabels++;
        const locator = editPage.locator(`#${field.caption_id}`);
        if (await locator.isVisible().catch(() => false)) visibleLabels++;
        else console.log(`❌ Label not visible → ${field.caption_id}`);
      }
    }
  }
  console.log(`\n✅ Test Case 2: ${visibleLabels} visible labels out of ${totalLabels}`);
});

test.skip('Test Case 3 — Label Text Match', async ({ browser }) => {
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const editPage = await launchEditPage(context, page);

  const headingLocator = editPage.getByText(credentials.finalPopup.text);
  const headingVisible = await headingLocator.isVisible().catch(() => false);
  console.log(`\n🔍 Final popup heading: "${credentials.finalPopup.text}" → ${headingVisible ? 'Visible' : 'NOT Visible'}`);
  await expect(headingLocator).toBeVisible();

  let matchCount = 0;
  let total = 0;

  for (const block of validationData.results) {
    for (const field of block.captions) {
      if (field.type === 'label' && field.attribute_name) {
        total++;
        const locator = editPage.locator(`#${field.caption_id}`);
        const actual = await locator.innerText().catch(() => '').then(s => s.trim());
        const expected = stripHTMLTags(field.attribute_name);
        if (actual === expected) {
          matchCount++;
          console.log(`✅ Text match → ${field.caption_id}`);
        } else {
          console.log(`❌ Text mismatch → ${field.caption_id}\n   → Expected: "${expected}"\n   ← Found   : "${actual}"`);
        }
      }
    }
  }
  console.log(`\n✅ Test Case 3: ${matchCount} matching label texts out of ${total}`);
});
