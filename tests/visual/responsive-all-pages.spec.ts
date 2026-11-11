// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Responsive, Accessibility, and Visual Quality', () => {
  test('Check responsive layout and visual consistency across all screens', async ({ page, pages, testData }, testInfo) => {
    test.setTimeout(120000);

    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const checkoutProfile = testData.checkoutProfiles.find((profile) => profile.scenario === 'standard_checkout');
    const backpack = testData.inventoryProducts.find((product) => product.productName === 'Sauce Labs Backpack');
    const bikeLight = testData.inventoryProducts.find((product) => product.productName === 'Sauce Labs Bike Light');
    expect(standardUser).toBeDefined();
    expect(checkoutProfile).toBeDefined();
    expect(backpack).toBeDefined();
    expect(bikeLight).toBeDefined();

    const viewports = [
      { name: 'mobile', width: 375, height: 812 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1440, height: 900 },
    ];
    const capture = async (viewportName: string, screenName: string, hasFooter = true): Promise<void> => {
      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(hasHorizontalOverflow, `${viewportName} ${screenName} should not overflow horizontally`).toBe(false);
      if (hasFooter) {
        await expect(page.getByRole('contentinfo')).toBeVisible();
      }
      await testInfo.attach(`${viewportName}-${screenName}.png`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    };

    // 1. Capture and inspect the planned screens at mobile, tablet, and desktop viewport sizes.
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await pages.loginPage.open('/');
      await expect(page.getByRole('main')).toBeVisible();
      await capture(viewport.name, 'login', false);

      await pages.loginPage.login(standardUser!.username, standardUser!.password);
      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(pages.inventoryPage.productsHeading).toBeVisible();
      await expect(pages.inventoryPage.productCards).toHaveCount(6);
      await capture(viewport.name, 'inventory');

      await pages.inventoryPage.productNameLink(backpack!.productName).click();
      await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+$/);
      await expect(pages.productDetailPage.productName).toHaveText(backpack!.productName);
      await expect(pages.productDetailPage.productImage).toBeVisible();
      await capture(viewport.name, 'product-detail');
      await pages.productDetailPage.backToProductsButton.click();

      await pages.inventoryPage.cartButton.click();
      await expect(pages.cartPage.items).toHaveCount(0);
      await capture(viewport.name, 'empty-cart');
      await pages.cartPage.continueShopping();

      await pages.inventoryPage.addToCart(backpack!.productName);
      await pages.inventoryPage.addToCart(bikeLight!.productName);
      await pages.inventoryPage.cartButton.click();
      await expect(pages.cartPage.items).toHaveCount(2);
      await capture(viewport.name, 'populated-cart');
      await pages.cartPage.checkout();

      await expect(pages.checkoutInformationPage.heading).toHaveText('Checkout: Your Information');
      await expect(pages.checkoutInformationPage.firstName).toBeVisible();
      await capture(viewport.name, 'checkout-information');
      await pages.checkoutInformationPage.fillInformation(checkoutProfile!);
      await pages.checkoutInformationPage.continue();

      await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
      await expect(pages.checkoutOverviewPage.items).toHaveCount(2);
      await capture(viewport.name, 'checkout-overview');
      await pages.checkoutOverviewPage.finish();

      await expect(pages.checkoutCompletePage.confirmationHeading).toBeVisible();
      await capture(viewport.name, 'checkout-complete');

      for (const catalog of ['Lazy Load', 'Spinner', 'Slider']) {
        if (!(await pages.navigationPage.drawer.isVisible())) {
          await pages.navigationPage.open();
        }
        await expect(pages.navigationPage.drawer).toBeVisible();
        if (await pages.navigationPage.dynamicCatalogLink.getAttribute('aria-expanded') !== 'true') {
          await pages.navigationPage.dynamicCatalogLink.click();
        }
        await expect(pages.navigationPage.menuEntry(catalog)).toBeVisible();
        await pages.navigationPage.menuEntry(catalog).click();
        await expect(page.getByTestId('title')).toHaveText(`Dynamic Catalog - ${catalog}`);
        await capture(viewport.name, `dynamic-${catalog.toLowerCase().replace(' ', '-')}`);
      }
    }
  });
});
