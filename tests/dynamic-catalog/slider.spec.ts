// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Dynamic Catalog Experiences', () => {
  test('Verify Slider dynamic catalog interaction', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    expect(standardUser).toBeDefined();

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await pages.navigationPage.openDynamicCatalogEntry('Slider');

    await expect(page).toHaveURL(/\/dynamic-catalog-slider\.html$/);
    await expect(pages.dynamicCatalogPage.heading).toHaveText('Dynamic Catalog - Slider');

    const sliderProductNames = [
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)',
      'Sauce Labs Backpack',
      'Sauce Labs Fleece Jacket',
    ];
    await expect(pages.dynamicCatalogPage.sliderDots).toHaveCount(sliderProductNames.length);
    for (const productName of sliderProductNames) {
      await expect(pages.dynamicCatalogPage.sliderDot(productName)).toHaveAccessibleName(`Show ${productName}`);
    }

    const firstDot = pages.dynamicCatalogPage.sliderDot(sliderProductNames[0]);
    await firstDot.click();
    await expect(firstDot).toHaveAttribute('aria-current', 'true');
    await expect(pages.dynamicCatalogPage.activeSliderDot).toHaveCount(1);
    await expect(pages.dynamicCatalogPage.sliderContainer.getByRole('img')).toHaveAttribute(
      'alt',
      sliderProductNames[0],
    );
    await expect(pages.dynamicCatalogPage.sliderContainer).toContainText(sliderProductNames[0]);

    const lastDot = pages.dynamicCatalogPage.sliderDot(sliderProductNames[sliderProductNames.length - 1]);
    await firstDot.focus();
    for (let index = 1; index < sliderProductNames.length; index += 1) {
      await page.keyboard.press('Tab');
    }
    await expect(lastDot).toBeFocused();
    await expect(page.locator(':focus-visible')).toHaveCount(1);
    await page.keyboard.press('Enter');

    await expect(lastDot).toHaveAttribute('aria-current', 'true');
    await expect(pages.dynamicCatalogPage.activeSliderDot).toHaveCount(1);
    await expect(pages.dynamicCatalogPage.sliderContainer.getByRole('img')).toHaveAttribute(
      'alt',
      sliderProductNames[sliderProductNames.length - 1],
    );
    await expect(pages.dynamicCatalogPage.sliderContainer).toContainText(
      sliderProductNames[sliderProductNames.length - 1],
    );
  });
});
