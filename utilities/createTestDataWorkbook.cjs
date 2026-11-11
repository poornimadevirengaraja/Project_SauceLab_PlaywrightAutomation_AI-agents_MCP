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

const navigation = workbook.addWorksheet('Navigation');
navigation.addRow(['scenario', 'label']);
[
  ['open_close_global_navigation_menu', 'All Items'],
  ['open_close_global_navigation_menu', 'Dynamic Catalog'],
  ['open_close_global_navigation_menu', 'About'],
  ['open_close_global_navigation_menu', 'Logout'],
  ['open_close_global_navigation_menu', 'Reset App State'],
  ['open_close_global_navigation_menu', 'Close Menu'],
].forEach((row) => navigation.addRow(row));

const inventory = workbook.addWorksheet('Inventory');
inventory.addRow([
  'scenario',
  'productName',
  'imageAlt',
  'imageSource',
  'description',
  'price',
  'imageNaturalWidth',
  'imageNaturalHeight',
]);
[
  [
    'render_all_six_inventory_product_cards',
    'Sauce Labs Backpack',
    'Sauce Labs Backpack',
    '/assets/sauce-backpack-1200x1500-CjRW-Djj.jpg',
    'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
    '$29.99',
    640,
    960,
  ],
  [
    'render_all_six_inventory_product_cards',
    'Sauce Labs Bike Light',
    'Sauce Labs Bike Light',
    '/assets/bike-light-1200x1500-DxcZRFOA.jpg',
    "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.",
    '$9.99',
    320,
    480,
  ],
  [
    'render_all_six_inventory_product_cards',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Bolt T-Shirt',
    '/assets/bolt-shirt-1200x1500-mR0ldpVS.jpg',
    'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.',
    '$15.99',
    640,
    960,
  ],
  [
    'render_all_six_inventory_product_cards',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Fleece Jacket',
    '/assets/sauce-pullover-1200x1500-BfbI-PSd.jpg',
    "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.",
    '$49.99',
    640,
    960,
  ],
  [
    'render_all_six_inventory_product_cards',
    'Sauce Labs Onesie',
    'Sauce Labs Onesie',
    '/assets/red-onesie-1200x1500-BrSuq0ic.jpg',
    "Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.",
    '$7.99',
    640,
    960,
  ],
  [
    'render_all_six_inventory_product_cards',
    'Test.allTheThings() T-Shirt (Red)',
    'Test.allTheThings() T-Shirt (Red)',
    '/assets/red-tatt-1200x1500-E-qp6aYf.jpg',
    'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.',
    '$15.99',
    640,
    960,
  ],
].forEach((row) => inventory.addRow(row));

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
workbook.xlsx.writeFile(outputPath).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});