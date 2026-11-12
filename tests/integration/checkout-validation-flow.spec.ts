// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Integration Testing', () => {
  test('Verify checkout errors block completion and corrected data completes the order', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const checkoutProfile = testData.checkoutProfiles.find((profile) => profile.scenario === 'standard_checkout');
    const products = testData.inventoryProducts.filter(
      (product) =>
        product.productName === 'Sauce Labs Backpack' || product.productName === 'Sauce Labs Bike Light',
    );
    expect(standardUser).toBeDefined();
    expect(checkoutProfile).toBeDefined();
    expect(products).toHaveLength(2);

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    for (const product of products) {
      await pages.inventoryPage.addToCart(product.productName);
    }
    await pages.inventoryPage.cartButton.click();
    await expect(pages.cartPage.items).toHaveCount(2);
    await pages.cartPage.checkout();

    await pages.checkoutInformationPage.firstName.fill(checkoutProfile!.firstName);
    await pages.checkoutInformationPage.continue();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(pages.checkoutInformationPage.errorMessage).toContainText('Last Name is required');
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, 2 items');
    await pages.checkoutInformationPage.dismissError();
    await pages.checkoutInformationPage.fillInformation(checkoutProfile!);
    await pages.checkoutInformationPage.continue();

    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(pages.checkoutOverviewPage.items).toHaveCount(2);
    for (const product of products) {
      await expect(pages.cartPage.item(product.productName)).toHaveCount(1);
    }
    await pages.checkoutOverviewPage.finish();

    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(pages.checkoutCompletePage.confirmationHeading).toHaveCount(1);
    await expect(pages.checkoutCompletePage.cartButton).toHaveAccessibleName('Cart, empty');
  });
});
