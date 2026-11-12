// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Field Validation Coverage', () => {
  test('Accept ordinary checkout names and postal formats', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const product = testData.inventoryProducts.find((item) => item.productName === 'Sauce Labs Backpack');
    expect(standardUser).toBeDefined();
    expect(product).toBeDefined();

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await pages.inventoryPage.addToCart(product!.productName);
    await pages.inventoryPage.cartButton.click();
    await pages.cartPage.checkout();

    const inputSets = [
      { firstName: 'Anne-Marie', lastName: "O'Neill", postalCode: '12345-6789' },
      { firstName: 'Zoë', lastName: 'García', postalCode: 'SW1A 1AA' },
    ];
    for (const values of inputSets) {
      await pages.checkoutInformationPage.firstName.fill(values.firstName);
      await pages.checkoutInformationPage.lastName.fill(values.lastName);
      await pages.checkoutInformationPage.postalCode.fill(values.postalCode);
      await pages.checkoutInformationPage.continue();

      await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
      await expect(pages.checkoutOverviewPage.heading).toHaveText('Checkout: Overview');

      await pages.checkoutOverviewPage.cancelButton.click();
      await expect(page).toHaveURL(/\/inventory\.html$/);
      await pages.inventoryPage.cartButton.click();
      await pages.cartPage.checkout();
    }
  });

  test('Keep unusually long checkout values intact and fields usable', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const product = testData.inventoryProducts.find((item) => item.productName === 'Sauce Labs Backpack');
    expect(standardUser).toBeDefined();
    expect(product).toBeDefined();

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await pages.inventoryPage.addToCart(product!.productName);
    await pages.inventoryPage.cartButton.click();
    await pages.cartPage.checkout();

    const longValues = {
      firstName: 'A'.repeat(160),
      lastName: 'B'.repeat(160),
      postalCode: '1234567890'.repeat(16),
    };
    await pages.checkoutInformationPage.firstName.fill(longValues.firstName);
    await pages.checkoutInformationPage.lastName.fill(longValues.lastName);
    await pages.checkoutInformationPage.postalCode.fill(longValues.postalCode);

    await expect(pages.checkoutInformationPage.firstName).toHaveValue(longValues.firstName);
    await expect(pages.checkoutInformationPage.lastName).toHaveValue(longValues.lastName);
    await expect(pages.checkoutInformationPage.postalCode).toHaveValue(longValues.postalCode);
    for (const field of [
      pages.checkoutInformationPage.firstName,
      pages.checkoutInformationPage.lastName,
      pages.checkoutInformationPage.postalCode,
      pages.checkoutInformationPage.continueButton,
    ]) {
      await expect(field).toBeVisible();
      const box = await field.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(1280);
    }

    await pages.checkoutInformationPage.continue();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(pages.checkoutOverviewPage.heading).toHaveText('Checkout: Overview');
  });

  test.fixme('Reject whitespace-only checkout values', async ({ page, pages, testData }) => {
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

    const whitespaceCases = [
      { field: 'firstName' as const, message: 'First Name is required' },
      { field: 'lastName' as const, message: 'Last Name is required' },
      { field: 'postalCode' as const, message: 'Postal Code is required' },
    ];
    for (const { field, message } of whitespaceCases) {
      await pages.checkoutInformationPage.firstName.fill(checkoutProfile!.firstName);
      await pages.checkoutInformationPage.lastName.fill(checkoutProfile!.lastName);
      await pages.checkoutInformationPage.postalCode.fill(checkoutProfile!.postalCode);
      await pages.checkoutInformationPage[field].fill('   ');
      await pages.checkoutInformationPage.continue();
      await expect(pages.checkoutInformationPage.errorMessage).toContainText(message);
      await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    }
  });
});
