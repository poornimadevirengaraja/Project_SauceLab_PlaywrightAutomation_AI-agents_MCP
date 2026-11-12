// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Integration Testing', () => {
  test('Verify checkout item data and calculated totals', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const checkoutProfile = testData.checkoutProfiles.find((profile) => profile.scenario === 'standard_checkout');
    const products = testData.inventoryProducts.filter(
      (product) =>
        product.productName === 'Sauce Labs Backpack' ||
        product.productName === 'Sauce Labs Bolt T-Shirt' ||
        product.productName === 'Test.allTheThings() T-Shirt (Red)',
    );
    expect(standardUser).toBeDefined();
    expect(checkoutProfile).toBeDefined();
    expect(products).toHaveLength(3);

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);

    let selectedCount = 0;
    for (const count of [1, products.length]) {
      for (const product of products.slice(selectedCount, count)) {
        await pages.inventoryPage.addToCart(product.productName);
      }
      selectedCount = count;
      await pages.inventoryPage.cartButton.click();
      await expect(pages.cartPage.items).toHaveCount(count);
      await pages.cartPage.checkout();
      await pages.checkoutInformationPage.fillInformation(checkoutProfile!);
      await pages.checkoutInformationPage.continue();
      await expect(pages.checkoutOverviewPage.heading).toHaveText('Checkout: Overview');
      await expect(pages.checkoutOverviewPage.items).toHaveCount(count);
      await expect(page.getByText('Payment Information', { exact: false })).toBeVisible();
      await expect(page.getByText('Shipping Information', { exact: false })).toBeVisible();

      const selectedProducts = products.slice(0, count);
      let subtotalCents = 0;
      for (const product of selectedProducts) {
        await expect(pages.cartPage.item(product.productName)).toHaveCount(1);
        await expect(pages.cartPage.itemPrice(product.productName)).toHaveText(product.price);
        await expect(pages.cartPage.itemQuantity(product.productName)).toHaveText('1');
        subtotalCents += Math.round(Number(product.price.slice(1)) * 100);
      }

      const taxCents = Math.round(subtotalCents * 0.08);
      const formatCurrency = (cents: number): string => `$${(cents / 100).toFixed(2)}`;
      await expect(pages.checkoutOverviewPage.subtotal).toHaveText(`Item total: ${formatCurrency(subtotalCents)}`);
      await expect(pages.checkoutOverviewPage.tax).toHaveText(`Tax: ${formatCurrency(taxCents)}`);
      await expect(pages.checkoutOverviewPage.total).toHaveText(
        `Total: ${formatCurrency(subtotalCents + taxCents)}`,
      );

      if (count === 1) {
        await pages.checkoutOverviewPage.cancelButton.click();
        await expect(page).toHaveURL(/\/inventory\.html$/);
      }
    }
  });
});
