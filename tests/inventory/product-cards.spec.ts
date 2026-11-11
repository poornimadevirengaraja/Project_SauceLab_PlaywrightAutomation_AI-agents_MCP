// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Inventory and Product Catalog', () => {
  test('Render all six inventory product cards', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    expect(standardUser).toBeDefined();

    const inventoryProducts = testData.inventoryProducts.filter(
      (product) => product.scenario === 'render_all_six_inventory_product_cards',
    );
    expect(inventoryProducts).toHaveLength(6);

    // Step 1: Log in as standard_user and inspect the full inventory page, including the bottom.
    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pages.inventoryPage.productsHeading).toBeVisible();
    await expect(pages.inventoryPage.productCards).toHaveCount(inventoryProducts.length);

    const footer = page.getByRole('contentinfo');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeInViewport();

    // Step 2: Inspect each card's image, name, description, price, and Add to cart control.
    for (const product of inventoryProducts) {
      const card = pages.inventoryPage.productCard(product.productName);
      const image = pages.inventoryPage.productImage(product.productName);

      await expect(card).toBeVisible();
      await expect(pages.inventoryPage.productNameLabel(product.productName)).toHaveText(product.productName);
      await expect(pages.inventoryPage.productDescription(product.productName)).toHaveText(product.description);
      await expect(pages.inventoryPage.productPrice(product.productName)).toHaveText(product.price);
      await expect(image).toBeVisible();
      await expect(image).toHaveAttribute('alt', product.imageAlt);
      await expect(image).toHaveAttribute('src', product.imageSource);
      await expect(image).toHaveJSProperty('complete', true);
      await expect(image).toHaveJSProperty('naturalWidth', product.imageNaturalWidth);
      await expect(image).toHaveJSProperty('naturalHeight', product.imageNaturalHeight);
      await expect(pages.inventoryPage.productAddButton(product.productName)).toBeVisible();
    }

    const cardLocators = await pages.inventoryPage.productCards.all();
    const cardBoxes = await Promise.all(cardLocators.map((card) => card.boundingBox()));
    expect(cardBoxes.every((box) => box !== null)).toBe(true);
    const cardDimensions = cardBoxes.map((box) => ({ width: box!.width, height: box!.height }));
    for (const dimensions of cardDimensions.slice(1)) {
      expect(dimensions.width).toBeCloseTo(cardDimensions[0].width, 1);
      expect(dimensions.height).toBeCloseTo(cardDimensions[0].height, 1);
    }
  });
});
