import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {

  await test.step('Navigating to url', async () => {
    await page.goto('https://github.com/');
  });

  await test.step('click on signin', async () => {
    await page.getByRole('link', { name: 'Sign in' }).click();
  });

  await test.step('Enter username & password', async () => {
    await page.getByRole('textbox', { name: 'Username or email address' }).click();
    await page.getByRole('textbox', { name: 'Username or email address' }).fill('kvmf;o');
    await page.getByText('Password', { exact: true }).click();
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('pvmd0igj');
  });



  await test.step('validate error message', async () => {
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();

  });



});