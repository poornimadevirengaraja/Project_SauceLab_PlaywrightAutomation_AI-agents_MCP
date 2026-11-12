// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('User Interface Component Testing', () => {
  test('Inspect dynamic catalog loading and interactive states', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const products = testData.inventoryProducts.filter(
      (product) => product.scenario === 'render_all_six_inventory_product_cards',
    );
    expect(standardUser).toBeDefined();
    expect(products).toHaveLength(6);

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await pages.navigationPage.openDynamicCatalogEntry('Lazy Load');
    await expect(pages.dynamicCatalogPage.heading).toHaveText('Dynamic Catalog - Lazy Load');
    await expect(pages.dynamicCatalogPage.lazyLoadPlaceholders.first()).toBeVisible();
    await expect(pages.dynamicCatalogPage.lazyLoadCards.first()).toBeVisible();

    const firstLoadedCardBox = await pages.dynamicCatalogPage.lazyLoadCards.first().boundingBox();
    expect(firstLoadedCardBox).not.toBeNull();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect.poll(() => pages.dynamicCatalogPage.lazyLoadCards.count()).toBeGreaterThan(8);
    await expect(pages.dynamicCatalogPage.lazyLoadCards.first()).toBeVisible();
    await expect(pages.dynamicCatalogPage.lazyLoadPlaceholders.first()).toBeVisible();
    const firstLoadedCardAfterScroll = await pages.dynamicCatalogPage.lazyLoadCards.first().boundingBox();
    expect(firstLoadedCardAfterScroll).not.toBeNull();
    expect(firstLoadedCardAfterScroll!.x).toBeCloseTo(firstLoadedCardBox!.x, 0);
    expect(firstLoadedCardAfterScroll!.width).toBeCloseTo(firstLoadedCardBox!.width, 0);

    await pages.navigationPage.openDynamicCatalogEntry('Spinner');
    await expect(pages.dynamicCatalogPage.heading).toHaveText('Dynamic Catalog - Spinner');
    await expect(pages.dynamicCatalogPage.spinner).toBeVisible({ timeout: 3000 });
    await expect(pages.dynamicCatalogPage.spinner).toBeHidden({ timeout: 10000 });
    await expect(pages.dynamicCatalogPage.spinnerGrid).toBeVisible();
    await expect(pages.dynamicCatalogPage.spinnerGrid.locator('.dynamic_catalog_card')).toHaveCount(6);

    await pages.navigationPage.openDynamicCatalogEntry('Slider');
    await expect(pages.dynamicCatalogPage.heading).toHaveText('Dynamic Catalog - Slider');
    await expect(pages.dynamicCatalogPage.sliderDots).toHaveCount(products.length);
    const sliderProductNames = [
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)',
      'Sauce Labs Backpack',
      'Sauce Labs Fleece Jacket',
    ];

    const firstDot = pages.dynamicCatalogPage.sliderDot(sliderProductNames[0]);
    await firstDot.click();
    await expect(firstDot).toHaveAttribute('aria-current', 'true');
    await expect(pages.dynamicCatalogPage.sliderContainer).toContainText(sliderProductNames[0]);

    const lastDot = pages.dynamicCatalogPage.sliderDot(sliderProductNames[sliderProductNames.length - 1]);
    await firstDot.focus();
    for (let tab = 1; tab < sliderProductNames.length; tab += 1) {
      await page.keyboard.press('Tab');
    }
    await expect(lastDot).toBeFocused();
    await expect(page.locator(':focus-visible')).toHaveCount(1);
    await page.keyboard.press('Enter');
    await expect(lastDot).toHaveAttribute('aria-current', 'true');
    await expect(pages.dynamicCatalogPage.sliderContainer).toContainText(
      sliderProductNames[sliderProductNames.length - 1],
    );
  });
});
