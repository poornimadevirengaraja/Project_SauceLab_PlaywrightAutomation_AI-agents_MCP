// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Session, Routing, and Browser Behavior', () => {
  test('Protect authenticated routes and handle browser navigation', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const product = testData.inventoryProducts.find((item) => item.productName === 'Sauce Labs Backpack');
    expect(standardUser).toBeDefined();
    expect(product).toBeDefined();

    await pages.loginPage.open('/');
    for (const route of [
      '/inventory.html',
      '/cart.html',
      '/inventory-item.html?id=4',
      '/checkout-step-one.html',
    ]) {
      await page.goto(route);
      await expect(page).toHaveURL(/\/$/);
      await expect(pages.loginPage.loginButton).toBeVisible();
      await expect(pages.inventoryPage.productsHeading).toHaveCount(0);
    }

    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await pages.inventoryPage.addToCart(product!.productName);
    await pages.inventoryPage.productNameLink(product!.productName).click();
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+$/);
    await expect(pages.productDetailPage.productName).toHaveText(product!.productName);
    await expect(pages.productDetailPage.cartButton).toHaveAccessibleName('Cart, 1 items');

    await pages.productDetailPage.cartButton.click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(pages.cartPage.items).toHaveCount(1);
    await page.goBack();
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+$/);
    await expect(pages.productDetailPage.productName).toHaveText(product!.productName);
    await expect(pages.productDetailPage.productActionButton('Remove')).toBeVisible();
    await page.goForward();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(pages.cartPage.items).toHaveCount(1);

    await pages.cartPage.checkout();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(pages.cartPage.items).toHaveCount(1);
    await expect(pages.cartPage.cartButton).toHaveAccessibleName('Cart, 1 items');
    await page.goForward();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(pages.checkoutInformationPage.heading).toHaveText('Checkout: Your Information');
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, 1 items');
  });
});
