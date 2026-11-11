// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Responsive, Accessibility, and Visual Quality', () => {
  test('Check links, assets, and browser console health', async ({ page, pages, testData }) => {
    test.setTimeout(90000);

    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const checkoutProfile = testData.checkoutProfiles.find((profile) => profile.scenario === 'standard_checkout');
    const product = testData.inventoryProducts.find((item) => item.productName === 'Sauce Labs Backpack');
    expect(standardUser).toBeDefined();
    expect(checkoutProfile).toBeDefined();
    expect(product).toBeDefined();

    const appOrigin = new URL(process.env.BASE_URL ?? 'https://www.saucedemo.com').origin;
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error' && !message.text().includes('Permissions policy violation: unload is not allowed')) {
        consoleErrors.push(`${page.url()}: ${message.text()}`);
      }
    });
    page.on('pageerror', (error) => pageErrors.push(`${page.url()}: ${error.message}`));
    page.on('requestfailed', (request) => {
      if (new URL(request.url()).origin === appOrigin) {
        failedRequests.push(`${request.url()}: ${request.failure()?.errorText ?? 'request failed'}`);
      }
    });
    page.on('response', (response) => {
      if (new URL(response.url()).origin === appOrigin && response.status() >= 400) {
        failedRequests.push(`${response.url()}: HTTP ${response.status()}`);
      }
    });

    const checkPageHealth = async (hasFooter = true): Promise<void> => {
      const brokenImages = await page.locator('img:visible').evaluateAll(async (imageElements) => {
        const images = imageElements.filter((image): image is HTMLImageElement => image instanceof HTMLImageElement);
        await Promise.all(images.map((image) => image.complete ? Promise.resolve() : image.decode().catch(() => undefined)));
        return images
          .filter((image) => !image.complete || image.naturalWidth === 0)
          .map((image) => image.getAttribute('src') ?? image.getAttribute('alt') ?? 'image without source');
      });
      expect(brokenImages, `Broken images on ${page.url()}`).toEqual([]);

      if (hasFooter) {
        const footerLinks = page.getByRole('contentinfo').getByRole('link');
        await expect(footerLinks).toHaveCount(3);
        await expect(footerLinks.nth(0)).toHaveAttribute('href', 'https://x.com/saucelabs');
        await expect(footerLinks.nth(1)).toHaveAttribute('href', 'https://www.facebook.com/saucelabs');
        await expect(footerLinks.nth(2)).toHaveAttribute('href', 'https://www.linkedin.com/company/sauce-labs/');
      }
    };

    // 1. Visit each primary route and inspect loaded product images, brand assets, footer links, and browser console/network failures.
    await pages.loginPage.open('/');
    await expect(page.getByText('Swag Labs', { exact: true }).first()).toBeVisible();
    await checkPageHealth(false);

    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await checkPageHealth();

    await pages.inventoryPage.productNameLink(product!.productName).click();
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+$/);
    await checkPageHealth();
    await pages.productDetailPage.productActionButton('Add to cart').click();
    await pages.productDetailPage.cartButton.click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await checkPageHealth();

    await pages.cartPage.checkout();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await checkPageHealth();
    await pages.checkoutInformationPage.fillInformation(checkoutProfile!);
    await pages.checkoutInformationPage.continue();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await checkPageHealth();
    await pages.checkoutOverviewPage.finish();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(page.getByRole('img', { name: 'Pony Express', exact: true })).toBeVisible();
    await checkPageHealth();

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
      await checkPageHealth();
    }

    expect(consoleErrors, 'Unexpected browser console errors').toEqual([]);
    expect(pageErrors, 'Uncaught application errors').toEqual([]);
    expect(failedRequests, 'Failed first-party requests').toEqual([]);
  });
});
