const ExcelJS = require('exceljs');
const fs = require('node:fs/promises');
const path = require('node:path');

async function worksheetRecords(workbook, name) {
  const worksheet = workbook.getWorksheet(name);
  if (!worksheet) throw new Error(`Missing ${name} worksheet in SauceDemo workbook.`);

  const headers = worksheet.getRow(1).values.slice(1);
  return worksheet
    .getRows(2, worksheet.rowCount - 1)
    .filter((row) => row.hasValues)
    .map((row) => Object.fromEntries(headers.map((header, index) => [header, row.getCell(index + 1).text])));
}

async function main() {
  const root = path.join(__dirname, '..');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path.join(root, 'testdata', 'saucedemo-testdata.xlsx'));
  const users = await worksheetRecords(workbook, 'Users');
  const checkoutProfiles = await worksheetRecords(workbook, 'Checkout');
  const data = {
    sharedPassword: users.find((user) => user.scenario === 'standard_user')?.password ?? '',
    users,
    checkoutProfiles,
  };

  await fs.writeFile(path.join(root, 'testdata', 'saucedemo-testdata.json'), `${JSON.stringify(data, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});