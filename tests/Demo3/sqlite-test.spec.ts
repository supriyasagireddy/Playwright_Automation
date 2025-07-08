import { test, expect, Page, Browser } from "@playwright/test";
import fs from "fs";
const credentials = require("../../src/test-data/qa/api-responsev1.json");
import userData from "../../src/test-data/qa/menus-v4.json";

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
  await protocolPage.waitForLoadState('domcontentloaded');

  const editButton = protocolPage.locator(userLoginData.editPopup.editButtonSelector);
  const [editPage] = await Promise.all([
    context.waitForEvent("page"),
    editButton.click(),
  ]);
  await editPage.waitForLoadState('domcontentloaded');
  await editPage.waitForSelector('ul');
  return editPage;
};

test('validate menus', async ({ browser }) => {
  const menus = userData;
  const page = await loginAndNavigateToEditPage(browser);

  const normalize = (str: string) =>
    str.toLowerCase().replace(/\s+/g, ' ').replace(/\.{3}$/, '').replace(/["'`]/g, '').trim();

  // Click all parent tabs first to load children
  const parentIds = [...new Set(menus.filter(m => m.parent_id).map(m => m.parent_href.match(/\d+/)?.[0]))];
  for (const pid of parentIds) {
    if (pid) {
      const parentLocator = page.locator(`a[href*="getSectionCaptions('${pid}')"]`).first();
      if (await parentLocator.isVisible()) {
        const classAttr = await parentLocator.getAttribute("class");
        if (!classAttr?.includes("selected")) {
          await parentLocator.click();
          await page.waitForTimeout(1000); // slight wait to allow DOM to update
        }
      }
    }
  }

  const domLinks = await page.locator("ul li a[href*='getSectionCaptions']").evaluateAll((anchors) =>
    anchors.map(a => {
      const href = a.getAttribute('href') || "";
      const title = (a.getAttribute('title') || "").trim().toLowerCase();
      const text = (a.textContent || "").trim().toLowerCase();
      return { href, title, text };
    })
  );

  const matched = [];
  const notFound = [];
  let parentMatched = 0;
  let childMatched = 0;

  const parentMenus = menus.filter(m => !m.parent_id);
  const childMenus = menus.filter(m => m.parent_id);

  console.log(`\n🔹 Parent Menu Validation`);
  for (const menu of parentMenus) {
    const id = menu.item_id.replace("M_", "");
    const match = domLinks.find(l => l.href.includes(id));
    const expected = normalize(menu.name);
    const found = normalize(match?.text || "");

    if (match && (found.includes(expected) || expected.includes(found))) {
      console.log(`✅ Expected: ${menu.name}\n   ← Found   : ${found}`);
      matched.push(menu.name);
      parentMatched++;
    } else {
      console.log(`❌ Expected: ${menu.name}\n   → Found   : ${found || '---'}\n   → Not found in DOM or text mismatch`);
      notFound.push(menu.name);
    }
  }

  console.log(`\n🔹 Child Menu Validation`);
  for (const menu of childMenus) {
    const id = menu.item_id.replace("M_", "");
    const match = domLinks.find(l => l.href.includes(id));
    const expected = normalize(menu.name);
    const found = normalize(match?.title || "");

    if (match && (found.includes(expected) || expected.includes(found))) {
      console.log(`✅ Expected: ${menu.name}\n   ← Found   : ${found}`);
      matched.push(menu.name);
      childMatched++;
    } else {
      console.log(`❌ Expected: ${menu.name}\n   → Found   : ${found || '---'}\n   → Not found in DOM or title/text mismatch`);
      notFound.push(menu.name);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`Parent Menus Matched: ${parentMatched} / ${parentMenus.length}`);
  console.log(`Child Menus Matched : ${childMatched} / ${childMenus.length}`);
  console.log(`Total Matched       : ${matched.length} / ${menus.length}`);

  fs.writeFileSync("missing-menus.json", JSON.stringify(notFound, null, 2));
  expect(matched.length).toBe(menus.length);
});
