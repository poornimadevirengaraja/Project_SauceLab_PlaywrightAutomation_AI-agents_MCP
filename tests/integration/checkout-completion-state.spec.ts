// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Integration Testing', () => {
  test('Verify order completion updates global application state', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const checkoutProfile = testData.checkoutProfiles.find((profile) => profile.scenario === 'standard_checkout');
    const product = testData.inventoryProducts.find((item) => item.productName === 'Sauce Labs Backpack');
    expect(standardUser).toBeDefined();
    expect(checkoutProfile).toBeDefined();
    expect(product).toBeDefined();

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await pages.inventoryPage.addToCart(product!.productName);
    await pages.inventoryPage.cartButton.click();
    await pages.cartPage.checkout();
    await pages.checkoutInformationPage.fillInformation(checkoutProfile!);
    await pages.checkoutInformationPage.continue();
    await pages.checkoutOverviewPage.finish();

    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(pages.checkoutCompletePage.confirmationHeading).toHaveCount(1);
    await expect(pages.checkoutCompletePage.cartButton).toHaveAccessibleName('Cart, empty');
    await page.reload();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(pages.checkoutCompletePage.confirmationHeading).toHaveCount(1);
    await expect(pages.checkoutCompletePage.cartButton).toHaveAccessibleName('Cart, empty');

    await pages.checkoutCompletePage.backHomeButton.click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pages.inventoryPage.productAddButton(product!.productName)).toBeVisible();
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, empty');

    await pages.inventoryPage.addToCart(product!.productName);
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, 1 items');
    await pages.inventoryPage.cartButton.click();
    await expect(pages.cartPage.items).toHaveCount(1);
    await expect(pages.cartPage.item(product!.productName)).toHaveCount(1);
  });
});
