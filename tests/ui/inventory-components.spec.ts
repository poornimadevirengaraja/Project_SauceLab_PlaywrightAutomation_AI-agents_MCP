// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('User Interface Component Testing', () => {
  test('Inspect inventory cards, sort control, and product-action states', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const products = testData.inventoryProducts.filter(
      (product) => product.scenario === 'render_all_six_inventory_product_cards',
    );
    expect(standardUser).toBeDefined();
    expect(products).toHaveLength(6);

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);

    for (const viewport of [
      { width: 1280, height: 900 },
      { width: 375, height: 812 },
    ]) {
      await page.setViewportSize(viewport);
      await expect(pages.inventoryPage.productCards).toHaveCount(products.length);
      await expect(pages.inventoryPage.sortSelect).toBeVisible();
      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(hasHorizontalOverflow).toBe(false);

      for (const product of products) {
        const card = pages.inventoryPage.productCard(product.productName);
        await expect(pages.inventoryPage.productImage(product.productName)).toBeVisible();
        await expect(pages.inventoryPage.productNameLabel(product.productName)).toHaveText(product.productName);
        await expect(pages.inventoryPage.productDescription(product.productName)).toHaveText(product.description);
        await expect(pages.inventoryPage.productPrice(product.productName)).toHaveText(product.price);
        await expect(pages.inventoryPage.productAddButton(product.productName)).toBeVisible();
        const box = await card.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
      }

      await pages.inventoryPage.sortSelect.focus();
      await expect(pages.inventoryPage.sortSelect).toBeFocused();
      await pages.inventoryPage.sortSelect.selectOption('za');
      await expect(pages.inventoryPage.sortSelect).toHaveValue('za');
      await expect(pages.inventoryPage.productCards.locator('.inventory_item_name').first())
        .toHaveText('Test.allTheThings() T-Shirt (Red)');

      const product = products[0];
      const card = pages.inventoryPage.productCard(product.productName);
      const originalBox = await card.boundingBox();
      expect(originalBox).not.toBeNull();
      await pages.inventoryPage.addToCart(product.productName);
      await expect(pages.inventoryPage.productRemoveButton(product.productName)).toBeVisible();
      await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, 1 items');
      const addedBox = await card.boundingBox();
      expect(addedBox).not.toBeNull();
      expect(addedBox!.width).toBeCloseTo(originalBox!.width, 0);
      expect(Math.abs(addedBox!.height - originalBox!.height)).toBeLessThanOrEqual(8);

      await pages.inventoryPage.productRemoveButton(product.productName).click();
      await expect(pages.inventoryPage.productAddButton(product.productName)).toBeVisible();
      await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, empty');
    }
  });
});
