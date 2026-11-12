// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('User Interface Component Testing', () => {
  test('Inspect checkout and order-completion components', async ({ page, pages, testData }) => {
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

    await expect(pages.checkoutInformationPage.heading).toHaveText('Checkout: Your Information');
    await expect(pages.checkoutInformationPage.firstName).toBeVisible();
    await expect(pages.checkoutInformationPage.lastName).toBeVisible();
    await expect(pages.checkoutInformationPage.postalCode).toBeVisible();
    await expect(pages.checkoutInformationPage.cancelButton).toBeVisible();
    await expect(pages.checkoutInformationPage.continueButton).toBeVisible();
    await pages.checkoutInformationPage.firstName.focus();
    await expect(pages.checkoutInformationPage.firstName).toBeFocused();
    await pages.checkoutInformationPage.continue();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(pages.checkoutInformationPage.errorMessage).toContainText('First Name is required');
    await pages.checkoutInformationPage.dismissError();
    await expect(pages.checkoutInformationPage.errorMessage).toBeHidden();

    await pages.checkoutInformationPage.fillInformation(checkoutProfile!);
    await pages.checkoutInformationPage.continue();
    await expect(pages.checkoutOverviewPage.heading).toHaveText('Checkout: Overview');
    await expect(pages.checkoutOverviewPage.items).toHaveCount(1);
    await expect(pages.cartPage.itemName(product!.productName)).toHaveText(product!.productName);
    await expect(page.getByText('Payment Information', { exact: false })).toBeVisible();
    await expect(page.getByText('Shipping Information', { exact: false })).toBeVisible();
    await expect(pages.checkoutOverviewPage.subtotal).toHaveText('Item total: $29.99');
    await expect(pages.checkoutOverviewPage.tax).toHaveText('Tax: $2.40');
    await expect(pages.checkoutOverviewPage.total).toHaveText('Total: $32.39');
    await expect(pages.checkoutOverviewPage.cancelButton).toBeVisible();
    await expect(pages.checkoutOverviewPage.finishButton).toBeVisible();

    const overviewOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overviewOverflow, 'Checkout overview should not overflow horizontally').toBe(false);
    await pages.checkoutOverviewPage.finish();

    await expect(page.getByTestId('title')).toHaveText('Checkout: Complete!');
    await expect(pages.checkoutCompletePage.ponyExpressImage).toBeVisible();
    await expect(pages.checkoutCompletePage.ponyExpressImage).toHaveJSProperty('complete', true);
    await expect(pages.checkoutCompletePage.ponyExpressImage).toHaveJSProperty('naturalWidth', 144);
    await expect(pages.checkoutCompletePage.confirmationHeading).toBeVisible();
    await expect(pages.checkoutCompletePage.dispatchMessage).toBeVisible();
    await expect(pages.checkoutCompletePage.backHomeButton).toBeVisible();
    await expect(pages.checkoutCompletePage.generatePdfButton).toBeVisible();
  });
});
