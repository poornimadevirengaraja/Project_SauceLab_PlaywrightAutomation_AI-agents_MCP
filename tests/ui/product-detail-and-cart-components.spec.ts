// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('User Interface Component Testing', () => {
  test('Inspect product detail and empty and populated cart layouts', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const product = testData.inventoryProducts.find((item) => item.productName === 'Sauce Labs Backpack');
    expect(standardUser).toBeDefined();
    expect(product).toBeDefined();

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);

    for (const viewport of [
      { width: 1280, height: 900 },
      { width: 375, height: 812 },
    ]) {
      await page.setViewportSize(viewport);
      await pages.inventoryPage.productNameLink(product!.productName).click();
      await expect(pages.productDetailPage.productImage).toBeVisible();
      await expect(pages.productDetailPage.productImage).toHaveAttribute('alt', product!.imageAlt);
      await expect(pages.productDetailPage.productName).toHaveText(product!.productName);
      await expect(pages.productDetailPage.productDescription).toHaveText(product!.description);
      await expect(pages.productDetailPage.productPrice).toHaveText(product!.price);
      await expect(pages.productDetailPage.productActionButton('Add to cart')).toBeVisible();
      await expect(pages.productDetailPage.backToProductsButton).toBeVisible();
      await expect(pages.productDetailPage.header).toBeVisible();
      await expect(pages.productDetailPage.footer).toBeVisible();

      const detailOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(detailOverflow, 'Product detail should not overflow horizontally').toBe(false);
      await pages.productDetailPage.backToProductsButton.click();

      await pages.inventoryPage.cartButton.click();
      await expect(pages.cartPage.items).toHaveCount(0);
      await expect(pages.cartPage.quantityHeading).toHaveText('QTY');
      await expect(pages.cartPage.descriptionHeading).toHaveText('Description');
      await expect(pages.cartPage.continueShoppingButton).toBeVisible();
      await expect(pages.cartPage.checkoutButton).toBeVisible();
      await expect(pages.cartPage.footer).toBeVisible();
      await pages.cartPage.continueShopping();

      await pages.inventoryPage.addToCart(product!.productName);
      await pages.inventoryPage.cartButton.click();
      await expect(pages.cartPage.items).toHaveCount(1);
      await expect(pages.cartPage.itemName(product!.productName)).toHaveText(product!.productName);
      await expect(pages.cartPage.itemQuantity(product!.productName)).toHaveText('1');
      await expect(pages.cartPage.itemRemoveButton(product!.productName)).toBeVisible();
      await expect(pages.cartPage.continueShoppingButton).toBeVisible();
      await expect(pages.cartPage.checkoutButton).toBeVisible();
      const cartOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(cartOverflow, 'Cart should not overflow horizontally').toBe(false);
      await pages.cartPage.itemRemoveButton(product!.productName).click();
      await expect(pages.cartPage.items).toHaveCount(0);
      await pages.cartPage.continueShopping();
    }
  });
});
