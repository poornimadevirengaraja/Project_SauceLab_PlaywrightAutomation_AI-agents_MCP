// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Shopping Cart', () => {
  test('Verify cart contents, item removal, and continue shopping', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    expect(standardUser).toBeDefined();

    const backpack = testData.inventoryProducts.find((product) => product.productName === 'Sauce Labs Backpack');
    const bikeLight = testData.inventoryProducts.find((product) => product.productName === 'Sauce Labs Bike Light');
    expect(backpack).toBeDefined();
    expect(bikeLight).toBeDefined();

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await pages.inventoryPage.addToCart(backpack!.productName);
    await pages.inventoryPage.addToCart(bikeLight!.productName);
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, 2 items');
    await pages.inventoryPage.cartButton.click();

    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(pages.cartPage.heading).toHaveText('Your Cart');
    await expect(pages.cartPage.items).toHaveCount(2);
    await expect(pages.cartPage.cartButton).toHaveAccessibleName('Cart, 2 items');

    for (const product of [backpack!, bikeLight!]) {
      await expect(pages.cartPage.item(product.productName)).toHaveCount(1);
      await expect(pages.cartPage.itemQuantity(product.productName)).toHaveText('1');
      await expect(pages.cartPage.itemName(product.productName)).toHaveText(product.productName);
      await expect(pages.cartPage.itemDescription(product.productName)).toHaveText(product.description);
      await expect(pages.cartPage.itemPrice(product.productName)).toHaveText(product.price);
      await expect(pages.cartPage.itemRemoveButton(product.productName)).toBeVisible();
    }

    await pages.cartPage.itemRemoveButton(backpack!.productName).click();
    await expect(pages.cartPage.items).toHaveCount(1);
    await expect(pages.cartPage.item(backpack!.productName)).toHaveCount(0);
    await expect(pages.cartPage.item(bikeLight!.productName)).toHaveCount(1);
    await expect(pages.cartPage.cartButton).toHaveAccessibleName('Cart, 1 items');

    await pages.cartPage.continueShopping();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pages.inventoryPage.productAddButton(backpack!.productName)).toBeVisible();
    await expect(pages.inventoryPage.productRemoveButton(bikeLight!.productName)).toBeVisible();
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, 1 items');

    await pages.inventoryPage.cartButton.click();
    await expect(pages.cartPage.items).toHaveCount(1);
    await expect(pages.cartPage.item(bikeLight!.productName)).toHaveCount(1);
    await expect(pages.cartPage.item(backpack!.productName)).toHaveCount(0);
  });
});
