// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Global Navigation, Header, and Footer', () => {
  test('Verify shared header, cart control, and footer across primary screens', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const checkoutProfile = testData.checkoutProfiles.find((profile) => profile.scenario === 'standard_checkout');
    const product = testData.inventoryProducts.find((item) => item.productName === 'Sauce Labs Backpack');
    expect(standardUser).toBeDefined();
    expect(checkoutProfile).toBeDefined();
    expect(product).toBeDefined();

    const socialDestinations = [
      'https://x.com/saucelabs',
      'https://www.facebook.com/saucelabs',
      'https://www.linkedin.com/company/sauce-labs/',
    ];
    const inspectFooter = async (): Promise<void> => {
      const footer = page.getByRole('contentinfo');
      await expect(footer).toBeVisible();
      const links = footer.getByRole('link');
      await expect(links).toHaveCount(socialDestinations.length);
      for (const [index, destination] of socialDestinations.entries()) {
        await expect(links.nth(index)).toHaveAttribute('href', destination);
        await expect(links.nth(index)).toBeVisible();
      }
      await expect(footer).toContainText('All Rights Reserved.');
      await expect(footer).toContainText('Terms of Service');
      await expect(footer).toContainText('Privacy Policy');
    };
    const inspectAuthenticatedHeader = async (count: number): Promise<void> => {
      await expect(page.getByRole('banner')).toBeVisible();
      await expect(page.getByText('Swag Labs', { exact: true }).first()).toBeVisible();
      await expect(pages.inventoryPage.cartButton).toBeVisible();
      await expect(pages.inventoryPage.cartButton).toHaveAccessibleName(
        count === 0 ? 'Cart, empty' : `Cart, ${count} items`,
      );
    };

    await pages.loginPage.open('/');
    await expect(page.locator('.login_logo')).toHaveText('Swag Labs');
    await expect(page.getByRole('contentinfo')).toHaveCount(0);
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await inspectAuthenticatedHeader(0);
    await inspectFooter();

    await pages.inventoryPage.cartButton.click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(pages.cartPage.items).toHaveCount(0);
    await expect(pages.cartPage.cartButton).toHaveAccessibleName('Cart, empty');
    await pages.cartPage.continueShopping();

    await pages.inventoryPage.productNameLink(product!.productName).click();
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+$/);
    await expect(pages.productDetailPage.header).toBeVisible();
    await expect(pages.productDetailPage.cartButton).toHaveAccessibleName('Cart, empty');
    await inspectFooter();
    await pages.productDetailPage.cartButton.click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(pages.cartPage.items).toHaveCount(0);

    await pages.cartPage.continueShopping();
    await pages.inventoryPage.addToCart(product!.productName);
    await inspectAuthenticatedHeader(1);
    await inspectFooter();

    await pages.inventoryPage.cartButton.click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(pages.cartPage.items).toHaveCount(1);
    await expect(pages.cartPage.cartButton).toHaveAccessibleName('Cart, 1 items');
    await inspectFooter();

    await pages.cartPage.checkout();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await inspectAuthenticatedHeader(1);
    await inspectFooter();
    await pages.checkoutInformationPage.fillInformation(checkoutProfile!);
    await pages.checkoutInformationPage.continue();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await inspectAuthenticatedHeader(1);
    await inspectFooter();

    await pages.checkoutOverviewPage.finish();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await inspectAuthenticatedHeader(0);
    await inspectFooter();
    await pages.checkoutCompletePage.cartButton.click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(pages.cartPage.items).toHaveCount(0);

    await pages.cartPage.continueShopping();
    await pages.inventoryPage.cartButton.click();
    await pages.cartPage.continueShopping();
    await pages.inventoryPage.addToCart(product!.productName);
    await pages.inventoryPage.cartButton.click();
    const cartUrl = page.url();
    const popupPromise = page.context().waitForEvent('page');
    await pages.cartPage.footer.getByRole('link', { name: 'X' }).click();
    const popup = await popupPromise;
    await expect(popup).toHaveURL('https://x.com/saucelabs');
    await expect(page).toHaveURL(cartUrl);
    await expect(pages.cartPage.items).toHaveCount(1);
  });
});
