// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Integration Testing', () => {
  test('Verify navigation preserves in-progress shopping state', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const product = testData.inventoryProducts.find((item) => item.productName === 'Sauce Labs Backpack');
    expect(standardUser).toBeDefined();
    expect(product).toBeDefined();

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await pages.inventoryPage.addToCart(product!.productName);
    await pages.inventoryPage.productNameLink(product!.productName).click();
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+$/);
    await expect(pages.productDetailPage.productActionButton('Remove')).toBeVisible();
    await expect(pages.productDetailPage.cartButton).toHaveAccessibleName('Cart, 1 items');

    await pages.productDetailPage.backToProductsButton.click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, 1 items');
    await pages.navigationPage.openDynamicCatalogEntry('Slider');
    await expect(page).toHaveURL(/\/dynamic-catalog-slider\.html$/);
    await expect(pages.dynamicCatalogPage.heading).toHaveText('Dynamic Catalog - Slider');
    await expect(page.getByTestId('shopping-cart-link')).toHaveAccessibleName('Cart, 1 items');

    await page.goto('/inventory.html');
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, 1 items');
    await expect(pages.inventoryPage.productRemoveButton(product!.productName)).toBeVisible();
    await pages.inventoryPage.cartButton.click();
    await expect(pages.cartPage.items).toHaveCount(1);
    await expect(pages.cartPage.item(product!.productName)).toHaveCount(1);
    await pages.cartPage.continueShopping();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pages.inventoryPage.productRemoveButton(product!.productName)).toBeVisible();

    await pages.inventoryPage.productNameLink(product!.productName).click();
    await pages.productDetailPage.backToProductsButton.click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, 1 items');
    await pages.inventoryPage.cartButton.click();
    await expect(pages.cartPage.items).toHaveCount(1);
  });
});
