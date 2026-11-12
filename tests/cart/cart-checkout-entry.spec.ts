// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Shopping Cart', () => {
  test('Proceed from cart to checkout with selected products', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    expect(standardUser).toBeDefined();

    const products = testData.inventoryProducts.filter(
      (product) =>
        product.productName === 'Sauce Labs Backpack' || product.productName === 'Sauce Labs Bike Light',
    );
    expect(products).toHaveLength(2);

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);

    for (const product of products) {
      await pages.inventoryPage.addToCart(product.productName);
    }
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, 2 items');
    await pages.inventoryPage.cartButton.click();

    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(pages.cartPage.items).toHaveCount(products.length);
    for (const product of products) {
      await expect(pages.cartPage.item(product.productName)).toHaveCount(1);
      await expect(pages.cartPage.itemQuantity(product.productName)).toHaveText('1');
    }

    await pages.cartPage.checkout();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(pages.checkoutInformationPage.heading).toHaveText('Checkout: Your Information');
    await expect(pages.checkoutInformationPage.firstName).toBeVisible();
    await expect(pages.checkoutInformationPage.lastName).toBeVisible();
    await expect(pages.checkoutInformationPage.postalCode).toBeVisible();
    await expect(pages.cartPage.cartButton).toHaveAccessibleName('Cart, 2 items');
  });
});
