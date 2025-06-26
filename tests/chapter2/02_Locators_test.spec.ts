//Import playwright module
import { test, expect } from '@playwright/test';

//write a test
test('Locators Test', async ({ page }) => {

    // // Navigate to the page
    // await page.goto('https://www.hackerrank.com/contests/mountblue-technologies/challenges');

    // //get by role
    // await page.getByRole('link', { name: 'Home' }).first().click();

    // //get by label (ensure the element is visible and interactable)
    // const youtubeLabel = await page.getByLabel('HackerRank', { exact: true });
    // if (await youtubeLabel.isVisible() && await youtubeLabel.isEnabled()) {
    //     await youtubeLabel.first().click();
    // } else {
    //     console.warn('The "hackerrank" label is not visible or not interactable.');
    // }
    // // The label 'YouTube Home' does not exist on the page, so this line is removed to prevent timeout errors.

    // //getByAltText
    // const logo = page.getByAltText('HackerRank Home');
    // if (await logo.isVisible()) {
    //     await logo.click();
    // } else {
    //     console.warn('The "HackerRank Home" alt text element is not visible or not present.');
    // }
    
    // //getByTestId
    // const testIdElement = page.getByTestId('Certify'); 
    // if (await testIdElement.isVisible()) {
    //     await testIdElement.click();
    // } else {
    //     console.warn('The "Certify" test ID element is not visible or not present.');
    // }

    // //getByText
    // const textElement = page.getByText('Sign Up', { exact: true });
    // if (await textElement.isVisible()) {    
    //     await textElement.click();
    // }
    // else {
    //     console.warn('The "Sign Up" text element is not visible or not present.');
    // }   

    //getByPlaceholder
    // Try multiple possible placeholders for the search input
    // let placeholderElement = page.getByPlaceholder('Search for challenges');
    // if (!(await placeholderElement.isVisible())) {
    //     placeholderElement = page.getByPlaceholder('Search');
    // }
    // if (!(await placeholderElement.isVisible())) {
    //     placeholderElement = page.getByPlaceholder(/search/i);
    // }
    // if (await placeholderElement.isVisible()) {
    //     await placeholderElement.fill('Playwright');
    // } else {
    //     console.warn('The "Search" placeholder element is not visible or not present.');
    // }
    // Wait for the search results to appear
   // await page.waitForTimeout(2000); // Adjust the timeout as necessary     
    // Xpath
    // const xpathElement = page.locator('//a[contains(@href, "playwright") and contains(text(), "Playwright")]'); 
    // if (await xpathElement.isVisible()) {
    //     await xpathElement.click();
    // } else {
    //     console.warn('The "Playwright" link is not visible or not present.');
    // }

    //CSS Selector
    // const cssSelectorElement = page.locator('a[href*="playwright"]');
    // if (await cssSelectorElement.isVisible()) {
    //     await cssSelectorElement.click();
    // } else {
    //     console.warn('The "Playwright" link using CSS selector is not visible or not present.');
    // }

//write a test
    //getByTitle
    await page.goto('https://www.google.com/');
    const titleElement = page.getByTitle('Search');
    if (await titleElement.isVisible()) {
        await titleElement.click();
    }
    else {
        console.warn('The "Google Search" title element is not visible or not present.');
    }



});