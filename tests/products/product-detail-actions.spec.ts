// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Product Detail Pages', () => {
  test('Use product detail add/remove and back navigation', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    expect(standardUser).toBeDefined();

    const products = testData.inventoryProducts.filter(
      (product) => product.scenario === 'render_all_six_inventory_product_cards',
    );
    expect(products).toHaveLength(6);

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, empty');

    for (const product of products) {
      await pages.inventoryPage.productNameLink(product.productName).click();
      await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+$/);
      await expect(pages.productDetailPage.productName).toHaveText(product.productName);
      await expect(pages.productDetailPage.productActionButton('Add to cart')).toBeVisible();
      await expect(pages.productDetailPage.cartButton).toHaveAccessibleName('Cart, empty');

      // Confirm adding and removing on the detail page keeps the global cart state synchronized.
      await pages.productDetailPage.productActionButton('Add to cart').click();
      await expect(pages.productDetailPage.productActionButton('Remove')).toBeVisible();
      await expect(pages.productDetailPage.cartButton).toHaveAccessibleName('Cart, 1 items');

      await pages.productDetailPage.productActionButton('Remove').click();
      await expect(pages.productDetailPage.productActionButton('Add to cart')).toBeVisible();
      await expect(pages.productDetailPage.cartButton).toHaveAccessibleName('Cart, empty');

      // Verify an added item remains selected when leaving and reopening its detail page.
      await pages.productDetailPage.productActionButton('Add to cart').click();
      await expect(pages.productDetailPage.cartButton).toHaveAccessibleName('Cart, 1 items');
      await pages.productDetailPage.backToProductsButton.click();
      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(pages.inventoryPage.productRemoveButton(product.productName)).toBeVisible();
      await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, 1 items');

      await pages.inventoryPage.productNameLink(product.productName).click();
      await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+$/);
      await expect(pages.productDetailPage.productName).toHaveText(product.productName);
      await expect(pages.productDetailPage.productActionButton('Remove')).toBeVisible();
      await expect(pages.productDetailPage.cartButton).toHaveAccessibleName('Cart, 1 items');

      await pages.productDetailPage.productActionButton('Remove').click();
      await expect(pages.productDetailPage.productActionButton('Add to cart')).toBeVisible();
      await expect(pages.productDetailPage.cartButton).toHaveAccessibleName('Cart, empty');
      await pages.productDetailPage.backToProductsButton.click();
      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(pages.inventoryPage.productAddButton(product.productName)).toBeVisible();
      await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, empty');
    }
  });
});
