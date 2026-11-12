// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Inventory and Product Catalog', () => {
  test('Verify all product sort options and ordering', async ({ page, pages, testData }) => {
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
    await expect(pages.inventoryPage.productCards).toHaveCount(products.length);

    const sortingOptions = [
      {
        label: 'Name (A to Z)',
        value: 'az',
        expectedOrder: [
          'Sauce Labs Backpack',
          'Sauce Labs Bike Light',
          'Sauce Labs Bolt T-Shirt',
          'Sauce Labs Fleece Jacket',
          'Sauce Labs Onesie',
          'Test.allTheThings() T-Shirt (Red)',
        ],
      },
      {
        label: 'Name (Z to A)',
        value: 'za',
        expectedOrder: [
          'Test.allTheThings() T-Shirt (Red)',
          'Sauce Labs Onesie',
          'Sauce Labs Fleece Jacket',
          'Sauce Labs Bolt T-Shirt',
          'Sauce Labs Bike Light',
          'Sauce Labs Backpack',
        ],
      },
      {
        label: 'Price (low to high)',
        value: 'lohi',
        expectedOrder: [
          'Sauce Labs Onesie',
          'Sauce Labs Bike Light',
          'Sauce Labs Bolt T-Shirt',
          'Test.allTheThings() T-Shirt (Red)',
          'Sauce Labs Backpack',
          'Sauce Labs Fleece Jacket',
        ],
      },
      {
        label: 'Price (high to low)',
        value: 'hilo',
        expectedOrder: [
          'Sauce Labs Fleece Jacket',
          'Sauce Labs Backpack',
          'Sauce Labs Bolt T-Shirt',
          'Test.allTheThings() T-Shirt (Red)',
          'Sauce Labs Bike Light',
          'Sauce Labs Onesie',
        ],
      },
    ] as const;

    for (const option of sortingOptions) {
      await pages.inventoryPage.sortSelect.selectOption(option.value);
      await expect(pages.inventoryPage.sortSelect).toHaveValue(option.value);
      await expect(pages.inventoryPage.productCards.locator('.inventory_item_name')).toHaveText(
        option.expectedOrder,
      );

      for (const productName of option.expectedOrder) {
        const product = products.find((item) => item.productName === productName);
        expect(product, `Expected test data for ${productName}`).toBeDefined();
        await expect(pages.inventoryPage.productDescription(productName)).toHaveText(product!.description);
        await expect(pages.inventoryPage.productPrice(productName)).toHaveText(product!.price);
        await expect(pages.inventoryPage.productAddButton(productName)).toBeVisible();
      }
    }

    const tiedPriceProducts = products.filter((product) => product.price === '$15.99');
    expect(tiedPriceProducts.map((product) => product.productName)).toEqual([
      'Sauce Labs Bolt T-Shirt',
      'Test.allTheThings() T-Shirt (Red)',
    ]);
  });
});
