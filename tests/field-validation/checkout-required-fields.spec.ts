// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Field Validation Coverage', () => {
  test('Validate each checkout field independently', async ({ page, pages, testData }) => {
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
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);

    const requiredFields = [
      { locator: pages.checkoutInformationPage.firstName, message: 'First Name is required' },
      { locator: pages.checkoutInformationPage.lastName, message: 'Last Name is required' },
      { locator: pages.checkoutInformationPage.postalCode, message: 'Postal Code is required' },
    ];

    for (const { locator, message } of requiredFields) {
      await pages.checkoutInformationPage.firstName.fill(checkoutProfile!.firstName);
      await pages.checkoutInformationPage.lastName.fill(checkoutProfile!.lastName);
      await pages.checkoutInformationPage.postalCode.fill(checkoutProfile!.postalCode);
      await locator.fill('');
      await pages.checkoutInformationPage.continue();

      await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
      await expect(pages.checkoutInformationPage.errorMessage).toContainText(message);
      await expect(pages.checkoutInformationPage.dismissErrorButton).toBeVisible();
      await pages.checkoutInformationPage.dismissError();
      await expect(pages.checkoutInformationPage.errorMessage).toBeHidden();
    }

    await pages.checkoutInformationPage.fillInformation(checkoutProfile!);
    await pages.checkoutInformationPage.continue();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(pages.checkoutOverviewPage.heading).toHaveText('Checkout: Overview');
    await expect(pages.checkoutInformationPage.errorMessage).toHaveCount(0);
  });
});
