import { test, expect, Page, Browser } from "@playwright/test";
import credentials from "../../src/test-data/qa/api-responsev1.json";
import rawMenus from "../../src/test-data/qa/menus-v4.json";
import { execSync } from "child_process";

// 🧹 Kill old Chromium/Chrome instances (for local dev)
try {
  if (process.platform === "darwin" || process.platform === "linux") {
    execSync("pkill -f chromium", { stdio: "ignore" });
  } else if (process.platform === "win32") {
    execSync("taskkill /F /IM chrome.exe /T", { stdio: "ignore" });
  }
  console.log("🧹 Cleared previous Chromium instances.");
} catch {
  console.warn("⚠️ Could not clear old browser instances. Skipping cleanup.");
}

// ✅ Strongly typed config from JSON
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
  locators: {
    parentMenuSelector: string; // e.g., a:has-text("{name}")
    childMenuSelector: string;  // e.g., a[href*="getSectionCaptions('{id}')"]
    footerCheckSelector: string; // e.g., "body"
  };
};

// ✅ MenuItem type
interface MenuItem {
  name: string;
  item_id: string;
  parent_id?: string;
  parent_name?: string;
}

// ✅ Clean nulls in menu data
const menus: MenuItem[] = rawMenus.map((menu: any) => ({
  ...menu,
  parent_id: menu.parent_id === null ? undefined : menu.parent_id,
  parent_name: menu.parent_name === null ? undefined : menu.parent_name,
}));

// ✅ Utilities
const clean = (str: string): string => str.replace(/\s+/g, " ").trim().toLowerCase();
const isMatch = (a: string, b: string) => a === b || a.includes(b) || b.includes(a);

// ✅ Group menu items by parent_id
function groupMenusByParent(menuList: MenuItem[]) {
  const grouped: Record<string, MenuItem[]> = {};
  for (const menu of menuList) {
    const key = menu.parent_id ? `${menu.parent_id}` : "root";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(menu);
  }
  return grouped;
}

// ✅ Login and navigate to Edit Page
const loginAndNavigateToEditPage = async (browser: Browser): Promise<Page> => {
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  await page.goto(userLoginData.url);
  await page.locator(userLoginData.login.usernameSelector).fill(userLoginData.username);
  await page.locator(userLoginData.login.passwordSelector).fill(userLoginData.password);
  await page.locator(userLoginData.login.submitSelector).click();

  const protocolLocator = page.locator(`text=${userLoginData.protocolLink.text}`);
  await expect(protocolLocator).toBeVisible({ timeout: 10000 });

  const [protocolPage] = await Promise.all([
    context.waitForEvent("page"),
    protocolLocator.click(),
  ]);
  await protocolPage.waitForLoadState("domcontentloaded");

  const editButton = protocolPage.locator(userLoginData.editPopup.editButtonSelector);
  const [editPage] = await Promise.all([
    context.waitForEvent("page"),
    editButton.click(),
  ]);
  await editPage.waitForLoadState("domcontentloaded");

  await expect(editPage.locator(userLoginData.locators.footerCheckSelector))
    .toContainText(userLoginData.finalPopup.text);
  console.log("✅ Final page footer content verified");

  return editPage;
};

// ✅ Main test: Menu Validation
test.describe("Menu Validation", () => {
  test("validate menus", async ({ browser }) => {
    test.setTimeout(600000);
    console.log("✅ Retrieved menus:", menus.length);

    let page = await loginAndNavigateToEditPage(browser);
    let visibleCount = 0;
    let notFoundCount = 0;

    const groupedMenus = groupMenusByParent(menus);
    let lastParent = "";

    for (const [group, items] of Object.entries(groupedMenus)) {
      if (page.isClosed()) {
        console.warn("🔄 Reopening page because it was closed...");
        page = await loginAndNavigateToEditPage(browser);
      }

      if (group !== "root") {
        const parentName = items.find(m => m.parent_name)?.parent_name || "";
        if (parentName !== lastParent) {
          console.log(`➡️ Clicking parent group: ${parentName}`);
          try {
            await test.step(`Click parent: ${parentName}`, async () => {
              const parentSelector = userLoginData.locators.parentMenuSelector.replace("{name}", parentName);
              const parentLocator = page.locator(parentSelector);

              if (await parentLocator.count()) {
                await parentLocator.first().click();
                await expect(parentLocator.first()).toBeVisible({ timeout: 10000 });
              } else {
                throw new Error(`❌ Parent menu not found: ${parentName}`);
              }
            });
          } catch {
            console.warn(`⚠️ Failed to click parent menu: ${parentName}`);
            continue;
          }
          lastParent = parentName;
        }
      }

      for (const menu of items) {
        const startTime = Date.now();
        try {
          const menuId = menu.item_id.replace("M_", "");
          const childSelector = userLoginData.locators.childMenuSelector.replace("{id}", menuId);
          const element = page.locator(childSelector).first();

          // Retry logic
          for (let attempt = 1; attempt <= 2; attempt++) {
            try {
              await expect(element).toBeVisible({ timeout: 5000 });
              break;
            } catch {
              if (attempt === 2) throw new Error("❌ Final attempt failed");
              await page.waitForTimeout(1000);
              console.warn(`🔁 Retry ${attempt} for ${menu.name}`);
            }
          }

          const titleAttr = await element.getAttribute("title");
          const innerText = await element.innerText();
          const expected = clean(menu.name);
          const found = clean(titleAttr || innerText);

          if (isMatch(found, expected)) {
            console.log(`✅ [${Date.now() - startTime}ms] Matched: ${menu.name}`);
            visibleCount++;
          } else {
            console.error(`❌ [${Date.now() - startTime}ms] Title mismatch: ${menu.name} → Got: ${found}`);
            notFoundCount++;
            const safeName = menu.name.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 50);
            await page.screenshot({ path: `screenshots/${safeName}.png`, fullPage: true });
          }
        } catch {
          console.error(`❌ [${Date.now() - startTime}ms] Not Found: ${menu.name}`);
          notFoundCount++;
        }
      }
    }

    console.log("\n🔍 Test Summary:");
    console.log(`Total Menus: ${menus.length}`);
    console.log(`✅ Matched: ${visibleCount}`);
    console.log(`❌ Not Found/Text Mismatch: ${notFoundCount}`);
    expect(visibleCount).toBe(menus.length);
  });
});
