import { test, expect, request } from "@playwright/test";

test("AfterBuy login and dashboard data validation", async ({ page }) => {
  // 1. Go to login page
  await page.goto("https://portal.afterbuy.in/#/login");

//   // Wait for the username input to be visible to ensure the page is loaded
  await page.waitForSelector('input[formcontrolname="username"]', {
    state: "visible",
  });

  // 2. Fill in login details (replace with valid credentials)
  await page.fill(
    'input[formcontrolname="username"]',
    "afterbuyprodadmin@ingwalabs.com"
  );
  await page.fill('input[formcontrolname="password"]', "Afterbuy@123");

  //click on SIGN IN button
  await page.click('button:has-text("SIGN IN")');

  
// //   // 3. Validate the dashboard data
// //   //toBeVisible, toBeEnabled
  await expect(page.locator('[class="loggedInUserName"]')).toBeVisible();
  await expect(page.locator('[class="loggedInUserName"]')).toBeEnabled();

// //   //tohaveurl
   await expect(page).toHaveURL("https://portal.afterbuy.in/#/admin/dashboard");

// //   //tohavetitle
   await expect(page).toHaveTitle("AfterBuy24");

// //   //toHaveText
  await expect(page.locator('[class="loggedInUserName"]')).toHaveText(
    "Admin Portal"
  );

// //   //in dashboard just try to validate the data in UI and from API.

// //     // 4. Validate the dashboard data from UI and API

// //   // Get values from UI 
  const moderatorsCount = await page
    .locator("text=Moderators")
    .locator('xpath=../../..//div[contains(@class, "dashboard-card-subtitle")]')
    .textContent();
  const serviceProvidersCount = await page
    .locator('.dashboard-card-title:has-text("Service Providers")')
    .locator('xpath=../../..//div[contains(@class, "dashboard-card-subtitle")]')
    .textContent();
  const brandsCount = await page
    .locator('.dashboard-card-title:has-text("Brands")')
    .locator('xpath=../../..//div[contains(@class, "dashboard-card-subtitle")]')
    .textContent();
  const b2bCount = await page
    .locator('.dashboard-card-title:has-text("B2B")')
    .locator('xpath=../../..//div[contains(@class, "dashboard-card-subtitle")]')
    .textContent();

// //   //API validation
  const requestContext = await request.newContext({
    baseURL: "https://api.afterbuy.in"
    
  });

//   // Call the dashboard API endpoint
  const apiResponse = await requestContext.get("/service/admincounts"); 

  expect(apiResponse.ok()).toBeTruthy(); // validate the call succeeded

  const apiData = await apiResponse.json();
  console.log("API Data:", apiData);

  expect(moderatorsCount?.trim()).toBe(String(apiData.d.ModeratorsCount));
  expect(serviceProvidersCount?.trim()).toBe(
    String(apiData.d.ServiceProvidersCount)
  );
  expect(brandsCount?.trim()).toBe(String(apiData.d.BrandsCount));
  expect(b2bCount?.trim()).toBe(String(apiData.d.B2BMainBranchesCount));
  });
