const XLSX = require('xlsx');

// Prepare data
const data = [
  ["skill1", "skill2"],
  ["Playwright by Testers Talk", "Cypress by Testers Talk"],
  ["JavaScript by Testers Talk", "API Testing by Testers Talk"]
];

// Create worksheet and workbook
const ws = XLSX.utils.aoa_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

// Write to file
XLSX.writeFile(wb, "testData.xlsx");
