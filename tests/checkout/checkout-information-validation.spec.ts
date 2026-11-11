// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Checkout and Order Completion', () => {
  test.beforeEach(async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const cartProduct = testData.inventoryProducts.find((product) => product.productName === 'Sauce Labs Backpack');
    expect(standardUser).toBeDefined();
    expect(cartProduct).toBeDefined();

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await pages.inventoryPage.addToCart(cartProduct!.productName);
    await pages.inventoryPage.cartButton.click();
    await pages.cartPage.checkout();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  });

  test('Validate blank and partial checkout information fields', async ({ page, pages, testData }) => {
    const checkoutProfile = testData.checkoutProfiles.find((profile) => profile.scenario === 'standard_checkout');
    expect(checkoutProfile).toBeDefined();

    // 1. Submit the checkout information form with all fields blank.
    await expect(pages.checkoutInformationPage.heading).toHaveText('Checkout: Your Information');
    await expect(pages.checkoutInformationPage.firstName).toBeVisible();
    await expect(pages.checkoutInformationPage.lastName).toBeVisible();
    await expect(pages.checkoutInformationPage.postalCode).toBeVisible();
    await expect(pages.checkoutInformationPage.cancelButton).toBeVisible();
    await expect(pages.checkoutInformationPage.continueButton).toBeVisible();
    await pages.checkoutInformationPage.continue();
    await expect(pages.checkoutInformationPage.errorMessage).toContainText('First Name is required');
    await expect(pages.checkoutInformationPage.dismissErrorButton).toBeVisible();

    // 2. Dismiss the error when available, then submit with only First Name populated; repeat with First Name and Last Name populated but Zip/Postal Code blank.
    await pages.checkoutInformationPage.dismissError();
    await pages.checkoutInformationPage.firstName.fill(checkoutProfile!.firstName);
    await pages.checkoutInformationPage.continue();
    await expect(pages.checkoutInformationPage.errorMessage).toContainText('Last Name is required');
    await expect(pages.checkoutInformationPage.firstName).toHaveValue(checkoutProfile!.firstName);
    await pages.checkoutInformationPage.dismissError();

    await pages.checkoutInformationPage.lastName.fill(checkoutProfile!.lastName);
    await pages.checkoutInformationPage.continue();
    await expect(pages.checkoutInformationPage.errorMessage).toContainText('Postal Code is required');
    await expect(pages.checkoutInformationPage.firstName).toHaveValue(checkoutProfile!.firstName);
    await expect(pages.checkoutInformationPage.lastName).toHaveValue(checkoutProfile!.lastName);
    await expect(pages.checkoutInformationPage.postalCode).toHaveValue('');
    await expect(pages.checkoutInformationPage.dismissErrorButton).toBeVisible();
  });

  test.fixme('Reject whitespace-only values in each checkout field', async ({ pages, testData }) => {
    const checkoutProfile = testData.checkoutProfiles.find((profile) => profile.scenario === 'standard_checkout');
    expect(checkoutProfile).toBeDefined();

    // SauceDemo currently accepts whitespace-only values and advances to overview instead of showing required-field errors.
    const requiredErrors = {
      firstName: 'First Name is required',
      lastName: 'Last Name is required',
      postalCode: 'Postal Code is required',
    };

    for (const whitespaceField of ['firstName', 'lastName', 'postalCode'] as const) {
      await pages.checkoutInformationPage.firstName.fill(
        whitespaceField === 'firstName' ? '   ' : checkoutProfile!.firstName,
      );
      await pages.checkoutInformationPage.lastName.fill(
        whitespaceField === 'lastName' ? '   ' : checkoutProfile!.lastName,
      );
      await pages.checkoutInformationPage.postalCode.fill(
        whitespaceField === 'postalCode' ? '   ' : checkoutProfile!.postalCode,
      );
      await pages.checkoutInformationPage.continue();
      await expect(pages.checkoutInformationPage.errorMessage).toContainText(requiredErrors[whitespaceField]);
      await expect(pages.checkoutInformationPage.heading).toHaveText('Checkout: Your Information');
    }
  });
});
