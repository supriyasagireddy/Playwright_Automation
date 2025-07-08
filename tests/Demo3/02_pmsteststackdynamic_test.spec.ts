import { test, expect, BrowserContext, Page } from '@playwright/test';
const credentials = require('../../src/test-data/qa/api-responsev1.json');
const validationData = require('../../src/test-data/qa/api-response-v3.json');
const menuData = require('../../src/test-data/qa/menus_res.json');
function stripHTMLTags(text: string) {
  return text.replace(/<[^>]*>/g, '').replace(/\:/g, ':').replace(/\s+/g, ' ').trim();
}

function getEffectiveMenuId(menu: { menu_id: number, parent_menu_id: number }) {
  return menu.parent_menu_id !== 0 ? menu.parent_menu_id : menu.menu_id;
}

async function launchEditPage(context: BrowserContext, page: Page) {
  await page.goto(credentials.url);
  await page.fill(credentials.login.usernameSelector, credentials.username);
  await page.fill(credentials.login.passwordSelector, credentials.password);
  await page.click(credentials.login.submitSelector);

  const protocolLocator = page.getByText(credentials.protocolLink.text, { exact: true });
  await expect(protocolLocator).toHaveCount(1);
  await protocolLocator.scrollIntoViewIfNeeded();
  await protocolLocator.waitFor({ state: 'visible' });

  const [protocolPage] = await Promise.all([
    context.waitForEvent('page'),
    protocolLocator.click()
  ]);
  await protocolPage.waitForLoadState();

  const editButton = protocolPage.locator(credentials.editPopup.editButtonSelector);
  await editButton.waitFor({ state: 'visible' });

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
  await headingLocator.waitFor({ state: 'visible' });

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
        console.log(`Visible → ${field.caption_id}`);
      } else {
        hidden++;
        console.log(`Not visible → ${field.caption_id}`);
      }
    }
  }

  testInfo.annotations.push({ type: 'info', description: `Test Case 1 → Total: ${total}, Visible: ${visible}, Hidden: ${hidden}` });
  console.log(`Test Case 1 Summary:\n  Total Fields   : ${total}\n  Visible Fields : ${visible}\n  Hidden Fields  : ${hidden}`);
});

test('Test Case 2 — Visible Labels Count', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const editPage = await launchEditPage(context, page);

  const headingLocator = editPage.getByText(credentials.finalPopup.text);
  await headingLocator.waitFor({ state: 'visible' });

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
          console.log(`Label Visible → ${field.caption_id}`);
        } else {
          hiddenLabels++;
          console.log(`Label not visible → ${field.caption_id}`);
        }
      }
    }
  }

  testInfo.annotations.push({ type: 'info', description: `Test Case 2 → Total: ${totalLabels}, Visible: ${visibleLabels}, Hidden: ${hiddenLabels}` });
  console.log(`Test Case 2 Summary:\n  Total Labels   : ${totalLabels}\n  Visible Labels : ${visibleLabels}\n  Hidden Labels  : ${hiddenLabels}`);
});

test('Test Case 3 — Label Text Match', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const editPage = await launchEditPage(context, page);

  const headingLocator = editPage.getByText(credentials.finalPopup.text);
  await headingLocator.waitFor({ state: 'visible' });

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
        console.log(`Text match → ${field.caption_id}\n   → Expected: "${expected}"\n   ← Found   : "${text.trim()}"`);
      } else {
        mismatchCount++;
        console.log(`Text mismatch → ${field.caption_id}\n   → Expected: "${expected}"\n   ← Found   : "${text.trim() || '(element hidden)'}"`);
      }
    }
  }

  testInfo.annotations.push({
    type: 'info',
    description: `Test Case 3 → Total: ${total}, Matching: ${matchCount}, Mismatched: ${mismatchCount}`
  });
  console.log(`Test Case 3 Summary:\n  Total Label Texts : ${total}\n  Matching Texts    : ${matchCount}\n  Mismatched Texts  : ${mismatchCount}`);
});


test('Test Case 4 — Section Link Visibility from Top Horizontal Menu Bar', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const editPage = await launchEditPage(context, page);

  const headingLocator = editPage.getByText(credentials.finalPopup.text);
  await headingLocator.waitFor({ state: 'visible' });

  const protocolLink = editPage.locator('a:has-text("Protocol Information")');
  await expect(protocolLink).toBeVisible();
  await protocolLink.scrollIntoViewIfNeeded();

  const isAlreadyActive = await protocolLink.evaluate(node => node.classList.contains('selected'));
  if (!isAlreadyActive) {
    await Promise.all([
      editPage.waitForLoadState('networkidle'),
      protocolLink.click()
    ]);
  }

  const checklistHeader = editPage.locator('table.header label:has-text("Application type checklist")');
  try {
    await expect(checklistHeader).toBeVisible({ timeout: 10000 });
  } catch (e) {
    await editPage.screenshot({ path: 'error-protocol-page.png', fullPage: true });
    throw new Error('Protocol Information tab did not load. Screenshot saved.');
  }

  const menuLinks = editPage.locator('.ubercolortabs ul li a');
  const menuElements = await menuLinks.all();

  let totalMenus = 0;
  let visibleMenus = 0;
  let hiddenMenus = 0;

  const expectedMenus: string[] = [];
  const visibleMenusList: string[] = [];
  const hiddenMenusList: string[] = [];
  const groupedMenus: { [key: string]: string[] } = {};

  for (const menu of menuData) {
    const effectiveId = getEffectiveMenuId(menu);
    totalMenus++;
    const menuLabel = `${menu.menu_name} (effective id: ${effectiveId})`;
    expectedMenus.push(menuLabel);
    groupedMenus[effectiveId] = groupedMenus[effectiveId] || [];
    groupedMenus[effectiveId].push(menu.menu_name);

    let found = false;
    let matchedText = '';

    for (const element of menuElements) {
      const elementText = (await element.innerText()).replace(/\s+/g, ' ').trim().toLowerCase();
      const expectedText = menu.menu_name.replace(/\s+/g, ' ').trim().toLowerCase();

      if (elementText.includes(expectedText.slice(0, 4))) {
        matchedText = elementText;
        found = true;
        break;
      }
    }

    const resultMsg = `${menu.menu_name} (effective id: ${effectiveId})\n   → Expected: "${menu.menu_name}"\n   ← Found   : "${matchedText || 'Not visible'}"`;

    if (found) {
      visibleMenus++;
      visibleMenusList.push(`✅ Menu Visible → ${resultMsg}`);
    } else {
      hiddenMenus++;
      hiddenMenusList.push(`❌ Menu Not Visible → ${resultMsg}`);
    }
  }

  for (const msg of visibleMenusList) console.log(msg);
  for (const msg of hiddenMenusList) console.warn(msg);

  console.log('\nExpected Menus:');
  expectedMenus.forEach((menu) => console.log(`  → ${menu}`));

  console.log('\nGrouped Menus by effective_id:');
  for (const [id, names] of Object.entries(groupedMenus)) {
    console.log(`  Group ${id}: ${names.join(', ')}`);
  }

  console.log(`\nTest Case 4 Summary:\n  Total Menus   : ${totalMenus}\n  Visible Menus : ${visibleMenus}\n  Hidden Menus  : ${hiddenMenus}`);

  testInfo.annotations.push({
    type: 'info',
    description: `Test Case 4 → Total: ${totalMenus}, Visible: ${visibleMenus}, Hidden: ${hiddenMenus}`
  });
});














