// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Inventory and Product Catalog', () => {
  test('Add and remove each product from inventory', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    expect(standardUser).toBeDefined();

    const products = testData.inventoryProducts.filter(
      (product) => product.scenario === 'render_all_six_inventory_product_cards',
    );
    expect(products).toHaveLength(6);

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pages.inventoryPage.productsHeading).toHaveText('Products');
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, empty');

    // Add each product and verify its inventory action, cart badge, and cart entry.
    for (const [index, product] of products.entries()) {
      await pages.inventoryPage.addToCart(product.productName);
      await expect(pages.inventoryPage.productRemoveButton(product.productName)).toBeVisible();
      await expect(pages.inventoryPage.cartButton).toHaveAccessibleName(`Cart, ${index + 1} items`);

      await pages.inventoryPage.cartButton.click();
      await expect(page).toHaveURL(/\/cart\.html$/);
      await expect(pages.cartPage.items).toHaveCount(index + 1);
      await expect(pages.cartPage.items.filter({ hasText: product.productName })).toHaveCount(1);
      await expect(pages.cartPage.cartButton).toHaveAccessibleName(`Cart, ${index + 1} items`);
      await pages.cartPage.continueShopping();
      await expect(page).toHaveURL(/\/inventory\.html$/);
    }

    // Remove each product and verify that the badge decrements to the empty state.
    for (const [index, product] of products.entries()) {
      await pages.inventoryPage.productRemoveButton(product.productName).click();
      await expect(pages.inventoryPage.productAddButton(product.productName)).toBeVisible();
      const remainingCount = products.length - index - 1;
      if (remainingCount === 0) {
        await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, empty');
      } else {
        await expect(pages.inventoryPage.cartButton).toHaveAccessibleName(`Cart, ${remainingCount} items`);
      }
    }

    await pages.inventoryPage.cartButton.click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(pages.cartPage.items).toHaveCount(0);
    await expect(pages.cartPage.cartButton).toHaveAccessibleName('Cart, empty');
  });
});
