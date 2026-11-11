const ExcelJS = require('exceljs');
const fs = require('node:fs');
const path = require('node:path');

const outputPath = path.join(__dirname, '..', 'testdata', 'saucedemo-testdata.xlsx');
const workbook = new ExcelJS.Workbook();
const users = workbook.addWorksheet('Users');
users.addRow(['scenario', 'username', 'password', 'expectedResult', 'expectedError']);
[
  ['standard_user', 'standard_user', 'secret_sauce', 'success', ''],
  ['locked_out_user', 'locked_out_user', 'secret_sauce', 'locked', 'Sorry, this user has been locked out.'],
  ['problem_user', 'problem_user', 'secret_sauce', 'success', ''],
  ['performance_glitch_user', 'performance_glitch_user', 'secret_sauce', 'success', ''],
  ['error_user', 'error_user', 'secret_sauce', 'success', ''],
  ['visual_user', 'visual_user', 'secret_sauce', 'success', ''],
  ['unknown_user', 'unknown_user', 'invalid_password', 'failure', 'Username and password do not match'],
  ['standard_user_wrong_password', 'standard_user', 'wrong_password', 'failure', 'Username and password do not match'],
].forEach((row) => users.addRow(row));

const checkout = workbook.addWorksheet('Checkout');
checkout.addRow(['scenario', 'firstName', 'lastName', 'postalCode']);
checkout.addRow(['standard_checkout', 'Taylor', 'Morgan', '10001']);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
workbook.xlsx.writeFile(outputPath).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});