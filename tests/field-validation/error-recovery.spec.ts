// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Field Validation Coverage', () => {
  test('Recover from login validation error', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    expect(standardUser).toBeDefined();

    await pages.loginPage.open('/');
    await pages.loginPage.username.fill(standardUser!.username);
    await pages.loginPage.loginButton.click();
    await expect(pages.loginPage.errorMessage).toContainText('Password is required');
    await expect(page.getByRole('alert')).toBeVisible();

    const alertBox = await page.getByRole('alert').boundingBox();
    const loginButtonBox = await pages.loginPage.loginButton.boundingBox();
    expect(alertBox).not.toBeNull();
    expect(loginButtonBox).not.toBeNull();
    expect(alertBox!.y + alertBox!.height).toBeLessThanOrEqual(loginButtonBox!.y);

    await pages.loginPage.dismissErrorButton.click();
    await expect(pages.loginPage.errorMessage).toBeHidden();
    await expect(pages.loginPage.username).toHaveValue(standardUser!.username);
    await pages.loginPage.password.fill(standardUser!.password);
    await pages.loginPage.loginButton.click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pages.loginPage.errorMessage).toHaveCount(0);
  });

  test('Recover from checkout validation error', async ({ page, pages, testData }) => {
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

    await pages.checkoutInformationPage.firstName.fill(checkoutProfile!.firstName);
    await pages.checkoutInformationPage.postalCode.fill(checkoutProfile!.postalCode);
    await pages.checkoutInformationPage.continue();
    await expect(pages.checkoutInformationPage.errorMessage).toContainText('Last Name is required');
    await expect(page.getByRole('alert')).toBeVisible();
    const alertBox = await page.getByRole('alert').boundingBox();
    const continueButtonBox = await pages.checkoutInformationPage.continueButton.boundingBox();
    expect(alertBox).not.toBeNull();
    expect(continueButtonBox).not.toBeNull();
    expect(alertBox!.y + alertBox!.height).toBeLessThanOrEqual(continueButtonBox!.y);

    await pages.checkoutInformationPage.dismissError();
    await expect(pages.checkoutInformationPage.errorMessage).toBeHidden();
    await expect(pages.checkoutInformationPage.firstName).toHaveValue(checkoutProfile!.firstName);
    await expect(pages.checkoutInformationPage.postalCode).toHaveValue(checkoutProfile!.postalCode);
    await pages.checkoutInformationPage.lastName.fill(checkoutProfile!.lastName);
    await pages.checkoutInformationPage.continue();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(pages.checkoutInformationPage.errorMessage).toHaveCount(0);
  });
});
