// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Integration Testing', () => {
  test('Verify Reset App State across connected components', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const products = testData.inventoryProducts.filter(
      (product) => product.scenario === 'render_all_six_inventory_product_cards',
    );
    expect(standardUser).toBeDefined();
    expect(products).toHaveLength(6);

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await pages.inventoryPage.sortSelect.selectOption('za');
    await pages.inventoryPage.addToCart(products[0].productName);
    await pages.inventoryPage.addToCart(products[1].productName);
    await pages.inventoryPage.productNameLink(products[0].productName).click();
    await expect(pages.productDetailPage.productActionButton('Remove')).toBeVisible();
    await pages.navigationPage.open();
    await pages.navigationPage.resetAppStateLink.click();

    await pages.navigationPage.allItemsLink.click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, empty');
    for (const product of products) {
      await expect(pages.inventoryPage.productAddButton(product.productName)).toBeVisible();
    }

    await pages.inventoryPage.cartButton.click();
    await expect(pages.cartPage.items).toHaveCount(0);
    await pages.cartPage.continueShopping();
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, empty');
    await page.reload();
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, empty');
    for (const product of products) {
      await expect(pages.inventoryPage.productAddButton(product.productName)).toBeVisible();
    }
  });
});
