import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

type TestRecords = {
  Skill1: string;
  Skill2: string;
};

// Use an absolute path directly or construct it properly
const csvFilePath = './src/test-data/qa/testdata.csv';
let csvContent = fs.readFileSync(csvFilePath, 'utf-8');

// Remove lines that are empty, commented, start with a quote, or have fewer columns than expected
const lines = csvContent.split('\n').filter(line => {
  const trimmed = line.trim();
  // Exclude empty lines, comments, and lines starting with a quote
  if (trimmed === '' || trimmed.startsWith('//') || trimmed.startsWith('"')) return false;
  // Count commas to estimate columns (columns = commas + 1)
  const columnCount = line.split(',').length;
  return columnCount === 2;
});
csvContent = lines.join('\n');

const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
}) as TestRecords[];

for (const record of records) {
  if (!record.Skill1) continue;

  test("Data Driven Test for" , async ({ page }) => {
    await page.goto('https://www.google.com/');
    await page.getByRole('textbox', { name: /search/i }).fill(record.Skill1);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000); // Let results load

    // Optional: Log to console to verify test runs
    // console.log(`Tested search for: ${record.Skill1}`);
  });
}
