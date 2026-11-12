// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Checkout and Order Completion', () => {
  test('Complete a full successful purchase', async ({ page, pages, testData }) => {
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
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, empty');

    for (const product of products) {
      await pages.inventoryPage.addToCart(product.productName);
    }
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, 2 items');
    await pages.inventoryPage.cartButton.click();
    await expect(pages.cartPage.items).toHaveCount(products.length);

    await pages.cartPage.checkout();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await pages.checkoutInformationPage.fillInformation(checkoutProfile!);
    await pages.checkoutInformationPage.continue();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(pages.checkoutOverviewPage.items).toHaveCount(products.length);
    for (const product of products) {
      await expect(pages.cartPage.item(product.productName)).toHaveCount(1);
    }
    await pages.checkoutOverviewPage.finish();

    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(page.getByTestId('title')).toHaveText('Checkout: Complete!');
    await expect(pages.checkoutCompletePage.ponyExpressImage).toBeVisible();
    await expect(pages.checkoutCompletePage.confirmationHeading).toBeVisible();
    await expect(pages.checkoutCompletePage.dispatchMessage).toBeVisible();
    await expect(pages.checkoutCompletePage.backHomeButton).toBeVisible();
    await expect(pages.checkoutCompletePage.generatePdfButton).toBeVisible();

    await expect(pages.checkoutCompletePage.cartButton).toHaveAccessibleName('Cart, empty');
    await page.reload();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(pages.checkoutCompletePage.confirmationHeading).toBeVisible();
    await expect(pages.checkoutCompletePage.cartButton).toHaveAccessibleName('Cart, empty');

    await pages.checkoutCompletePage.backHomeButton.click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pages.inventoryPage.productsHeading).toHaveText('Products');
    await expect(pages.inventoryPage.productCards).toHaveCount(6);
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, empty');
    await expect(pages.inventoryPage.productAddButton(products[0].productName)).toBeVisible();
  });
});
