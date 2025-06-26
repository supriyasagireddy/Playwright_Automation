//importing playwright  
import {test,expect} from '@playwright/test';

test.beforeAll(async () => {
    console.log('This runs once before all tests');
});

test.beforeEach(async ({ page }) => {
    console.log('This runs before each test');
    // Navigate to example.com before each test
    await page.goto('https://example.com');
});

test.afterEach(async ({ page }) => {
    console.log('This runs after each test');
});

test.afterAll(async () => {
    console.log('This runs once after all tests');
});

test('Hooks of playwright', async ({ page }) => {
    console.log('test 1 executed');
    // Navigate to example.com as a placeholder for testing
    // await page.goto('https://example.com');

    // Example interaction: check for heading
    await expect(page.getByRole('heading', { name: 'Example Domain' })).toBeVisible();
});

test('test 2', async ({ page }) => {
    console.log('test 2 executed');
    // Navigate to example.com as a placeholder for testing
    // await page.goto('https://example.com');

    // Example interaction: check for heading
    await expect(page.getByRole('heading', { name: 'Example Domain' })).toBeVisible();
});
