// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Dynamic Catalog Experiences', () => {
  test('Verify Spinner dynamic catalog state', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    expect(standardUser).toBeDefined();

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await pages.navigationPage.openDynamicCatalogEntry('Spinner');

    await expect(page).toHaveURL(/\/dynamic-catalog-spinner\.html$/);
    await expect(pages.dynamicCatalogPage.heading).toHaveText('Dynamic Catalog - Spinner');
    await expect(pages.dynamicCatalogPage.spinner).toBeVisible({ timeout: 3000 });
    await expect(pages.dynamicCatalogPage.spinner).toBeHidden({ timeout: 10000 });

    await expect(pages.dynamicCatalogPage.spinnerGrid).toBeVisible();
    const productNames = [
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)',
      'Sauce Labs Backpack',
      'Sauce Labs Fleece Jacket',
    ];
    const cards = pages.dynamicCatalogPage.spinnerGrid.locator('.dynamic_catalog_card');
    await expect(cards).toHaveCount(productNames.length);

    for (const productName of productNames) {
      const card = cards.filter({ hasText: productName });
      await expect(card).toHaveCount(1);
      await expect(card.locator('img')).toBeVisible();
      await expect(card.locator('.dynamic_catalog_card_name')).toContainText(productName);
      await expect(card.locator('.dynamic_catalog_card_price')).toHaveText(/^\$\d+\.\d{2}$/);
    }

    const imagesAreLoaded = await cards.locator('img').evaluateAll((images) =>
      images.every((image) => {
        const productImage = image as HTMLImageElement;
        return productImage.complete && productImage.naturalWidth > 0;
      }),
    );
    expect(imagesAreLoaded, 'Spinner catalog product images should load successfully').toBe(true);
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });
});
