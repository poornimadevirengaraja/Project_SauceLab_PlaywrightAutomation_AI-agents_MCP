// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Session, Routing, and Browser Behavior', () => {
  test('Verify session persistence and logout behavior', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const product = testData.inventoryProducts.find((item) => item.productName === 'Sauce Labs Backpack');
    expect(standardUser).toBeDefined();
    expect(product).toBeDefined();

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await pages.inventoryPage.addToCart(product!.productName);
    await page.reload();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pages.inventoryPage.productRemoveButton(product!.productName)).toBeVisible();
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, 1 items');

    await page.goto('/cart.html');
    await expect(pages.cartPage.items).toHaveCount(1);
    await expect(pages.cartPage.item(product!.productName)).toHaveCount(1);
    await page.goto('/inventory.html');
    await expect(pages.inventoryPage.productRemoveButton(product!.productName)).toBeVisible();
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, 1 items');

    await pages.navigationPage.open();
    await pages.navigationPage.logoutLink.click();
    await expect(page).toHaveURL(/\/$/);
    await expect(pages.loginPage.loginButton).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await page.goto('/inventory.html');
    await expect(page).toHaveURL(/\/$/);
    await expect(pages.loginPage.loginButton).toBeVisible();
    await expect(pages.inventoryPage.productsHeading).toHaveCount(0);
  });
});
