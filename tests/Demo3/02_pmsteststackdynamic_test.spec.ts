import { test, expect, BrowserContext, Page } from '@playwright/test';
const credentials = require('../../src/test-data/qa/api-responsev1.json');
const validationData = require('../../src/test-data/qa/api-response-v3.json');

function stripHTMLTags(text: string) {
  return text.replace(/<[^>]*>/g, '').replace(/\:/g, ':').replace(/\s+/g, ' ').trim();
}

async function launchEditPage(context: BrowserContext, page: Page) {
  await page.goto(credentials.url);
  await page.fill(credentials.login.usernameSelector, credentials.username);
  await page.fill(credentials.login.passwordSelector, credentials.password);
  await page.click(credentials.login.submitSelector);

  const protocolLocator = page.getByText(credentials.protocolLink.text, { exact: true });
  await expect(protocolLocator).toHaveCount(1);
  await protocolLocator.scrollIntoViewIfNeeded();
  await protocolLocator.waitFor({ state: 'visible' }).catch(() => {
    console.warn(`⚠️ Protocol link not visible: ${credentials.protocolLink.text}`);
  });

  const [protocolPage] = await Promise.all([
    context.waitForEvent('page'),
    protocolLocator.click()
  ]);
  await protocolPage.waitForLoadState();

  const editButton = protocolPage.locator(credentials.editPopup.editButtonSelector);
  await editButton.waitFor({ state: 'visible' }).catch(() => {
    console.warn(`⚠️ Edit button not visible: ${credentials.editPopup.editButtonSelector}`);
  });

  const [editPage] = await Promise.all([
    context.waitForEvent('page'),
    editButton.click()
  ]);
  await editPage.waitForLoadState();

  return editPage;
}

test('Test Case 1 — Total Visible Fields (including hidden IDs)', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const editPage = await launchEditPage(context, page);

  const headingLocator = editPage.getByText(credentials.finalPopup.text);
  await headingLocator.waitFor({ state: 'visible' }).catch(() => {
    console.warn(`⚠️ Heading not visible: ${credentials.finalPopup.text}`);
  });

  let total = 0;
  let visible = 0;
  let hidden = 0;

  for (const block of validationData.results) {
    for (const field of block.captions) {
      const locator = editPage.locator(`#${field.caption_id}`);
      total++;
      const isVisible = await locator.isVisible().catch(() => false);
      if (isVisible) {
        visible++;
        console.log(`✅ Visible → ${field.caption_id}`);
      } else {
        hidden++;
        console.log(`❌ Not visible → ${field.caption_id}`);
      }
    }
  }

  testInfo.annotations.push({ type: 'info', description: `Test Case 1 → Total: ${total}, Visible: ${visible}, Hidden: ${hidden}` });
  console.log(`\n✅ Test Case 1 Summary:\n  ➤ Total Fields   : ${total}\n  ➤ Visible Fields : ${visible}\n  ➤ Hidden Fields  : ${hidden}`);
});

test('Test Case 2 — Visible Labels Count', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const editPage = await launchEditPage(context, page);

  const headingLocator = editPage.getByText(credentials.finalPopup.text);
  await headingLocator.waitFor({ state: 'visible' }).catch(() => {
    console.warn(`⚠️ Heading not visible: ${credentials.finalPopup.text}`);
  });

  let totalLabels = 0;
  let visibleLabels = 0;
  let hiddenLabels = 0;

  for (const block of validationData.results) {
    for (const field of block.captions) {
      if (field.type === 'label') {
        totalLabels++;
        const locator = editPage.locator(`#${field.caption_id}`);
        const isVisible = await locator.isVisible().catch(() => false);
        if (isVisible) {
          visibleLabels++;
          console.log(`✅ Label Visible → ${field.caption_id}`);
        } else {
          hiddenLabels++;
          console.log(`❌ Label not visible → ${field.caption_id}`);
        }
      }
    }
  }

  testInfo.annotations.push({ type: 'info', description: `Test Case 2 → Total: ${totalLabels}, Visible: ${visibleLabels}, Hidden: ${hiddenLabels}` });
  console.log(`\n✅ Test Case 2 Summary:\n  ➤ Total Labels   : ${totalLabels}\n  ➤ Visible Labels : ${visibleLabels}\n  ➤ Hidden Labels  : ${hiddenLabels}`);
});

test('Test Case 3 — Label Text Match', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const editPage = await launchEditPage(context, page);

  const headingLocator = editPage.getByText(credentials.finalPopup.text);
  await headingLocator.waitFor({ state: 'visible' }).catch(() => {
    console.warn(`⚠️ Heading not visible: ${credentials.finalPopup.text}`);
  });

  let total = 0;
  let matchCount = 0;
  let mismatchCount = 0;

  for (const block of validationData.results.slice(0, 3)) {
    for (const field of block.captions.filter((f: any) => f.type === 'label' && f.attribute_name)) {
      const locator = editPage.locator(`#${field.caption_id}`);
      const expected = stripHTMLTags(field.attribute_name);
      const visible = await locator.isVisible().catch(() => false);
      const text = visible ? await locator.innerText().catch(() => '') : '';
      total++;
      if (expected === text.trim()) {
        matchCount++;
        console.log(`✅ Text match → ${field.caption_id}\n   → Expected: "${expected}"\n   ← Found   : "${text.trim()}"`);
      } else {
        mismatchCount++;
        console.log(`❌ Text mismatch → ${field.caption_id}\n   → Expected: "${expected}"\n   ← Found   : "${text.trim() || '(element hidden)'}"`);
      }
    }
  }

  testInfo.annotations.push({
    type: 'info',
    description: `Test Case 3 → Total: ${total}, Matching: ${matchCount}, Mismatched: ${mismatchCount}`
  });
  console.log(`\n✅ Test Case 3 Summary:\n  ➤ Total Label Texts : ${total}\n  ➤ Matching Texts    : ${matchCount}\n  ➤ Mismatched Texts  : ${mismatchCount}`);
});
