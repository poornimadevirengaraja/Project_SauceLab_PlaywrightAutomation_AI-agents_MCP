// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Product Detail Pages', () => {
  test('Open each product detail from both image and title', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    expect(standardUser).toBeDefined();

    const products = testData.inventoryProducts.filter(
      (product) => product.scenario === 'render_all_six_inventory_product_cards',
    );
    expect(products).toHaveLength(6);

    // 1. For each of the six products, open its detail page by activating the product image, then repeat by activating the product name in a fresh state.
    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pages.inventoryPage.productsHeading).toHaveText('Products');

    for (const product of products) {
      for (const entryPoint of ['image', 'title'] as const) {
        const productLink = entryPoint === 'image'
          ? pages.inventoryPage.productImageLink(product.productName)
          : pages.inventoryPage.productNameLink(product.productName);
        await expect(productLink).toBeVisible();
        await productLink.click();

        await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+$/);
        await expect(pages.productDetailPage.productImage).toBeVisible();
        await expect(pages.productDetailPage.productImage).toHaveAttribute('alt', product.imageAlt);
        await expect(pages.productDetailPage.productImage).toHaveAttribute('src', product.imageSource);
        await expect(pages.productDetailPage.productName).toHaveText(product.productName);
        await expect(pages.productDetailPage.productDescription).toHaveText(product.description);
        await expect(pages.productDetailPage.productPrice).toHaveText(product.price);
        await expect(pages.productDetailPage.productActionButton('Add to cart')).toBeVisible();
        await expect(pages.productDetailPage.backToProductsButton).toBeVisible();
        await expect(pages.productDetailPage.header).toBeVisible();
        await expect(pages.productDetailPage.cartButton).toHaveAccessibleName('Cart, empty');
        await expect(pages.productDetailPage.footer).toBeVisible();

        await pages.productDetailPage.backToProductsButton.click();
        await expect(page).toHaveURL(/\/inventory\.html$/);
        await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, empty');
      }
    }
  });
});
