// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Inventory and Product Catalog', () => {
  test('Inspect inventory presentation across viewports', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    expect(standardUser).toBeDefined();

    const products = testData.inventoryProducts.filter(
      (product) => product.scenario === 'render_all_six_inventory_product_cards',
    );
    expect(products).toHaveLength(6);

    const viewports = [
      { name: 'desktop', width: 1440, height: 900 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 375, height: 812 },
    ];

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      await expect(pages.inventoryPage.productsHeading).toBeVisible();
      await expect(pages.inventoryPage.sortSelect).toBeVisible();
      await expect(pages.inventoryPage.cartButton).toBeVisible();
      await expect(page.getByRole('button', { name: 'Open Menu' })).toBeVisible();
      await expect(pages.inventoryPage.productCards).toHaveCount(products.length);

      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(hasHorizontalOverflow, `${viewport.name} inventory should not overflow horizontally`).toBe(false);

      const cardBoxes = await pages.inventoryPage.productCards.evaluateAll((cards) =>
        cards.map((card) => {
          const box = card.getBoundingClientRect();
          return {
            x: box.x + window.scrollX,
            y: box.y + window.scrollY,
            width: box.width,
            height: box.height,
          };
        }),
      );
      for (const product of products) {
        const card = pages.inventoryPage.productCard(product.productName);
        await expect(card).toBeVisible();
        await expect(pages.inventoryPage.productNameLabel(product.productName)).toHaveText(product.productName);
        await expect(pages.inventoryPage.productDescription(product.productName)).toHaveText(product.description);
        await expect(pages.inventoryPage.productPrice(product.productName)).toHaveText(product.price);

        const addButton = pages.inventoryPage.productAddButton(product.productName);
        await addButton.scrollIntoViewIfNeeded();
        await expect(addButton).toBeInViewport();

        const box = await card.boundingBox();
        expect(box, `${viewport.name} ${product.productName} should have a layout box`).not.toBeNull();
        expect(box!.x, `${viewport.name} ${product.productName} should not be clipped on the left`).toBeGreaterThanOrEqual(0);
        expect(
          box!.x + box!.width,
          `${viewport.name} ${product.productName} should not be clipped on the right`,
        ).toBeLessThanOrEqual(viewport.width);
      }

      for (let first = 0; first < cardBoxes.length; first += 1) {
        for (let second = first + 1; second < cardBoxes.length; second += 1) {
          const overlaps =
            cardBoxes[first].x < cardBoxes[second].x + cardBoxes[second].width &&
            cardBoxes[first].x + cardBoxes[first].width > cardBoxes[second].x &&
            cardBoxes[first].y < cardBoxes[second].y + cardBoxes[second].height &&
            cardBoxes[first].y + cardBoxes[first].height > cardBoxes[second].y;
          expect(overlaps, `${viewport.name} product cards should not overlap`).toBe(false);
        }
      }

      const lastProduct = products[products.length - 1];
      await pages.inventoryPage.productCard(lastProduct.productName).scrollIntoViewIfNeeded();
      await expect(pages.inventoryPage.productCard(lastProduct.productName)).toBeInViewport();
      const footer = page.getByRole('contentinfo');
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toBeInViewport();
    }
  });
});
