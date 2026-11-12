// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Checkout and Order Completion', () => {
  test('Review checkout information and order totals for one and multiple products', async ({ page, pages, testData }) => {
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
    await pages.inventoryPage.addToCart(products[0].productName);

    for (const [index, productCount] of [1, 2].entries()) {
      if (index === 1) {
        await pages.inventoryPage.addToCart(products[1].productName);
      }

      await pages.inventoryPage.cartButton.click();
      await expect(pages.cartPage.items).toHaveCount(productCount);
      await pages.cartPage.checkout();
      await pages.checkoutInformationPage.fillInformation(checkoutProfile!);
      await pages.checkoutInformationPage.continue();

      await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
      await expect(pages.checkoutOverviewPage.heading).toHaveText('Checkout: Overview');
      await expect(pages.checkoutOverviewPage.items).toHaveCount(productCount);
      await expect(page.getByText('Payment Information', { exact: false })).toBeVisible();
      await expect(page.getByText('Shipping Information', { exact: false })).toBeVisible();
      await expect(pages.checkoutOverviewPage.finishButton).toBeVisible();
      await expect(pages.checkoutOverviewPage.cancelButton).toBeVisible();

      const selectedProducts = products.slice(0, productCount);
      let subtotalCents = 0;
      for (const product of selectedProducts) {
        await expect(pages.cartPage.item(product.productName)).toHaveCount(1);
        await expect(pages.cartPage.itemQuantity(product.productName)).toHaveText('1');
        await expect(pages.cartPage.itemDescription(product.productName)).toHaveText(product.description);
        await expect(pages.cartPage.itemPrice(product.productName)).toHaveText(product.price);
        subtotalCents += Math.round(Number(product.price.replace('$', '')) * 100);
      }

      const taxCents = Math.round(subtotalCents * 0.08);
      const totalCents = subtotalCents + taxCents;
      const currency = (cents: number): string => `$${(cents / 100).toFixed(2)}`;
      await expect(pages.checkoutOverviewPage.subtotal).toHaveText(`Item total: ${currency(subtotalCents)}`);
      await expect(pages.checkoutOverviewPage.tax).toHaveText(`Tax: ${currency(taxCents)}`);
      await expect(pages.checkoutOverviewPage.total).toHaveText(`Total: ${currency(totalCents)}`);

      if (productCount === 1) {
        await pages.checkoutOverviewPage.cancelButton.click();
        await expect(page).toHaveURL(/\/inventory\.html$/);
      }
    }
  });
});
