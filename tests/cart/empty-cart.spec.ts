// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Shopping Cart', () => {
  test('Verify empty cart controls and navigation', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    expect(standardUser).toBeDefined();

    // 1. Open the cart with no selected products.
    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, empty');
    await pages.inventoryPage.cartButton.click();

    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(pages.cartPage.heading).toHaveText('Your Cart');
    await expect(pages.cartPage.quantityHeading).toHaveText('QTY');
    await expect(pages.cartPage.descriptionHeading).toHaveText('Description');
    await expect(pages.cartPage.items).toHaveCount(0);
    await expect(pages.cartPage.continueShoppingButton).toBeVisible();
    await expect(pages.cartPage.checkoutButton).toBeVisible();
    await expect(pages.cartPage.cartButton).toHaveAccessibleName('Cart, empty');

    // 2. Select Continue Shopping.
    await pages.cartPage.continueShopping();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pages.inventoryPage.productsHeading).toHaveText('Products');
    await expect(pages.inventoryPage.productCards).toHaveCount(6);
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, empty');

    // 3. Open the empty cart again and select Checkout.
    await pages.inventoryPage.cartButton.click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(pages.cartPage.heading).toHaveText('Your Cart');
    await expect(pages.cartPage.items).toHaveCount(0);
    await expect(pages.cartPage.cartButton).toHaveAccessibleName('Cart, empty');
    await pages.cartPage.checkout();

    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(page.getByTestId('title')).toHaveText('Checkout: Your Information');
    await expect(page.getByRole('textbox', { name: 'First Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Last Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Zip/Postal Code' })).toBeVisible();
    await expect(pages.cartPage.items).toHaveCount(0);
    await expect(pages.cartPage.cartButton).toHaveAccessibleName('Cart, empty');
  });
});
