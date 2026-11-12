// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Checkout and Order Completion', () => {
  test('Cancel checkout without placing an order', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const product = testData.inventoryProducts.find((item) => item.productName === 'Sauce Labs Backpack');
    const checkoutProfile = testData.checkoutProfiles.find((profile) => profile.scenario === 'standard_checkout');
    expect(standardUser).toBeDefined();
    expect(product).toBeDefined();
    expect(checkoutProfile).toBeDefined();

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await pages.inventoryPage.addToCart(product!.productName);
    await pages.inventoryPage.cartButton.click();
    await pages.cartPage.checkout();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);

    await pages.checkoutInformationPage.cancelButton.click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toHaveCount(0);
    await expect(pages.cartPage.items).toHaveCount(1);
    await expect(pages.cartPage.item(product!.productName)).toHaveCount(1);
    await pages.cartPage.checkout();
    await pages.checkoutInformationPage.fillInformation(checkoutProfile!);
    await pages.checkoutInformationPage.continue();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(pages.checkoutOverviewPage.items).toHaveCount(1);

    await pages.checkoutOverviewPage.cancelButton.click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toHaveCount(0);
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, 1 items');
    await pages.inventoryPage.cartButton.click();
    await expect(pages.cartPage.items).toHaveCount(1);
    await expect(pages.cartPage.item(product!.productName)).toHaveCount(1);
  });
});
