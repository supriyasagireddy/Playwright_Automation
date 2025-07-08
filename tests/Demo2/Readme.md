// tests/sqlite-test.spec.ts
import { test, expect, Page, Browser } from "@playwright/test";
import credentials from "../../src/test-data/qa/api-responsev1.json";
import menus from "../../src/test-data/qa/menus-v4.json";
import { execSync } from 'child_process';

// Kill all previous Playwright Chromium instances (only for local dev)
try {
  if (process.platform === 'darwin' || process.platform === 'linux') {
    execSync("pkill -f chromium", { stdio: 'ignore' });
  } else if (process.platform === 'win32') {
    execSync("taskkill /F /IM chrome.exe /T", { stdio: 'ignore' });
  }
  console.log("🧹 Cleared previous Chromium instances.");
} catch (e) {
  console.warn("⚠️ Could not clear old browser instances. Skipping cleanup.");
}

const userLoginData = credentials as {
  url: string;
  username: string;
  password: string;
  login: {
    usernameSelector: string;
    passwordSelector: string;
    submitSelector: string;
  };
  protocolLink: {
    text: string;
  };
  editPopup: {
    editButtonSelector: string;
  };
  finalPopup: {
    text: string;
  };
};

const clean = (str: string): string =>
  str
    .replace(/\s+/g, ' ')       // Collapse multiple spaces
    .trim()                      // Trim edges
    .toLowerCase();             // Lowercase for comparison

const loginAndNavigateToEditPage = async (browser: Browser): Promise<Page> => {
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  await page.goto(userLoginData.url);
  await page.locator(userLoginData.login.usernameSelector).fill(userLoginData.username);
  await page.locator(userLoginData.login.passwordSelector).fill(userLoginData.password);
  await page.locator(userLoginData.login.submitSelector).click();

  const protocolLocator = page.locator(`text=${userLoginData.protocolLink.text}`);
  await protocolLocator.waitFor({ state: 'visible' });

  const [protocolPage] = await Promise.all([
    context.waitForEvent("page"),
    protocolLocator.click(),
  ]);
  await protocolPage.waitForLoadState();

  const editButton = protocolPage.locator(userLoginData.editPopup.editButtonSelector);
  const [editPage] = await Promise.all([
    context.waitForEvent("page"),
    editButton.click(),
  ]);
  await editPage.waitForLoadState();
  editPage.on('close', () => {
    console.warn('⚠️ Page was closed unexpectedly');
  });
  console.log("✅ Navigated to Edit Page");
  await editPage.waitForTimeout(20000);
  return editPage;
};

test('validate menus', async ({ browser }) => {
  test.setTimeout(600000);
  console.log('✅ Retrieved menus:', menus.length);

  let page = await loginAndNavigateToEditPage(browser);
  let visibleCount = 0;
  let notFoundCount = 0;

  const groupedMenus: Record<string, typeof menus> = {};
  for (const menu of menus) {
    const key = menu.parent_id ? `${menu.parent_id}` : 'root';
    if (!groupedMenus[key]) groupedMenus[key] = [];
    groupedMenus[key].push(menu);
  }

  for (const [group, items] of Object.entries(groupedMenus)) {
    if (page.isClosed()) {
      console.warn("🔄 Reopening page because it was closed...");
      page = await loginAndNavigateToEditPage(browser);
    }

    if (group !== 'root') {
      const parentName = items.find(m => m.parent_name)?.parent_name;
      console.log(`➡️ Clicking parent group: ${parentName}`);
      try {
        const parentItem = page.locator('a').filter({ hasText: parentName });
        if (await parentItem.count() > 0) {
          await parentItem.first().click();
          await page.waitForTimeout(1500);
        }
      } catch (e) {
        console.warn(`⚠️ Failed to click parent menu: ${parentName}`);
        continue;
      }
    }

    for (const menu of items) {
      const startTime = Date.now();
      try {
        const menuId = menu.item_id.replace("M_", "");
        const element = page.locator(`a[href*="getSectionCaptions('${menuId}')"]`).first();

        await expect(element).toBeVisible({ timeout: 20000 });
        await page.waitForTimeout(500);

        const title = await element.getAttribute("title") || "";
        const expected = clean(menu.name);
        const found = clean(title);

        if (found.includes(expected) || expected.includes(found)) {
          console.log(`✅ [${Date.now() - startTime}ms] Matched: ${menu.name}`);
          visibleCount++;
        } else {
          console.error(`❌ [${Date.now() - startTime}ms] Title mismatch for: ${menu.name}\n   → Title: ${title}`);
          notFoundCount++;
        }
      } catch (e) {
        console.error(`❌ [${Date.now() - startTime}ms] Not Found: ${menu.name}`);
        notFoundCount++;
      }
      if (page.isClosed()) {
        console.warn("❌ Page closed during execution. Reopening for next group...");
        page = await loginAndNavigateToEditPage(browser);
        break;
      }
      await page.waitForTimeout(1000);
    }
  }

  console.log(`\n🔍 Test Summary:`);
  console.log(`Total Menus: ${menus.length}`);
  console.log(`✅ Matched: ${visibleCount}`);
  console.log(`❌ Not Found/Text Mismatch: ${notFoundCount}`);
  expect(visibleCount).toBe(menus.length);
});
