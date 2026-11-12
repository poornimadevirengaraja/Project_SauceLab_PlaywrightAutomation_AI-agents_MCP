// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Integration Testing', () => {
  test('Verify inventory-to-cart state synchronization', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const products = testData.inventoryProducts.filter(
      (product) => product.scenario === 'render_all_six_inventory_product_cards',
    );
    expect(standardUser).toBeDefined();
    expect(products).toHaveLength(6);

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, empty');

    for (const [index, product] of products.slice(0, 3).entries()) {
      await pages.inventoryPage.addToCart(product.productName);
      await expect(pages.inventoryPage.productRemoveButton(product.productName)).toBeVisible();
      await expect(pages.inventoryPage.cartButton).toHaveAccessibleName(`Cart, ${index + 1} items`);
    }

    await pages.inventoryPage.cartButton.click();
    await expect(pages.cartPage.items).toHaveCount(3);
    for (const product of products.slice(0, 3)) {
      await expect(pages.cartPage.item(product.productName)).toHaveCount(1);
      await expect(pages.cartPage.itemName(product.productName)).toHaveText(product.productName);
      await expect(pages.cartPage.itemDescription(product.productName)).toHaveText(product.description);
      await expect(pages.cartPage.itemPrice(product.productName)).toHaveText(product.price);
    }

    await pages.cartPage.continueShopping();
    await pages.inventoryPage.sortSelect.selectOption('za');
    await expect(pages.inventoryPage.sortSelect).toHaveValue('za');
    await pages.inventoryPage.cartButton.click();
    await expect(pages.cartPage.items).toHaveCount(3);
    await pages.cartPage.itemRemoveButton(products[1].productName).click();
    await expect(pages.cartPage.items).toHaveCount(2);
    await expect(pages.cartPage.cartButton).toHaveAccessibleName('Cart, 2 items');
    await pages.cartPage.continueShopping();
    await expect(pages.inventoryPage.productAddButton(products[1].productName)).toBeVisible();
    await expect(pages.inventoryPage.productRemoveButton(products[0].productName)).toBeVisible();
    await expect(pages.inventoryPage.productRemoveButton(products[2].productName)).toBeVisible();
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, 2 items');
  });
});
