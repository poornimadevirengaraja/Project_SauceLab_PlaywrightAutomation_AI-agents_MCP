// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('User Interface Component Testing', () => {
  test('Verify shared footer and visual consistency across viewports', async ({ page, pages, testData }, testInfo) => {
    test.setTimeout(120000);
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const checkoutProfile = testData.checkoutProfiles.find((profile) => profile.scenario === 'standard_checkout');
    const product = testData.inventoryProducts.find((item) => item.productName === 'Sauce Labs Backpack');
    expect(standardUser).toBeDefined();
    expect(checkoutProfile).toBeDefined();
    expect(product).toBeDefined();

    const viewports = [
      { name: 'mobile', width: 375, height: 812 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1440, height: 900 },
    ];
    const footerDestinations = [
      'https://x.com/saucelabs',
      'https://www.facebook.com/saucelabs',
      'https://www.linkedin.com/company/sauce-labs/',
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await pages.loginPage.open('/');
      await expect(page.getByRole('contentinfo')).toBeHidden();
      await pages.loginPage.login(standardUser!.username, standardUser!.password);

      const inspectFooter = async (screen: string): Promise<void> => {
        const footer = page.getByRole('contentinfo');
        await expect(footer).toBeVisible();
        const links = footer.getByRole('link');
        await expect(links).toHaveCount(3);
        for (const [index, destination] of footerDestinations.entries()) {
          await expect(links.nth(index)).toHaveAttribute('href', destination);
          await expect(links.nth(index)).toBeVisible();
        }
        await expect(footer).toContainText('All Rights Reserved.');
        await expect(footer).toContainText('Terms of Service');
        await expect(footer).toContainText('Privacy Policy');

        const footerBox = await footer.boundingBox();
        expect(footerBox).not.toBeNull();
        expect(footerBox!.x).toBeGreaterThanOrEqual(0);
        expect(footerBox!.x + footerBox!.width).toBeLessThanOrEqual(viewport.width);

        const hasHorizontalOverflow = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth,
        );
        expect(hasHorizontalOverflow, `${viewport.name} ${screen} should not overflow horizontally`).toBe(false);
      };

      await inspectFooter('inventory');
      await pages.inventoryPage.productNameLink(product!.productName).click();
      await inspectFooter('product detail');
      await pages.productDetailPage.backToProductsButton.click();
      await pages.inventoryPage.cartButton.click();
      await inspectFooter('empty cart');
      await pages.cartPage.continueShopping();
      await pages.inventoryPage.addToCart(product!.productName);
      await pages.inventoryPage.cartButton.click();
      await inspectFooter('populated cart');
      await pages.cartPage.checkout();
      await inspectFooter('checkout information');
      await pages.checkoutInformationPage.fillInformation(checkoutProfile!);
      await pages.checkoutInformationPage.continue();
      await inspectFooter('checkout overview');
      await pages.checkoutOverviewPage.finish();
      await inspectFooter('order completion');

      if (viewport.name === 'desktop') {
        await testInfo.attach('desktop-footer-visual-consistency.png', {
          body: await page.screenshot({ fullPage: true }),
          contentType: 'image/png',
        });
      }
    }
  });
});
