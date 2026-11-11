import { test, expect } from '../fixtures/sauceDemoFixture';

test('standard user can complete checkout using Excel test data', async ({ page, pages, testData }) => {
  const user = testData.users.find((candidate) => candidate.scenario === 'standard_user');
  const checkout = testData.checkoutProfiles.find((candidate) => candidate.scenario === 'standard_checkout');

  expect(user, 'A standard_user row must exist in the Users worksheet').toBeDefined();
  expect(checkout, 'A standard_checkout row must exist in the Checkout worksheet').toBeDefined();

  await pages.loginPage.open('/');
  await pages.loginPage.login(user!.username, user!.password);
  await pages.inventoryPage.addToCart('Sauce Labs Backpack');
  await pages.inventoryPage.cartButton.click();

  await expect(pages.cartPage.items).toHaveCount(1);
  await pages.cartPage.checkout();
  await pages.checkoutInformationPage.fillInformation(checkout!);
  await pages.checkoutInformationPage.continue();

  await expect(pages.checkoutOverviewPage.items).toHaveCount(1);
  await expect(pages.checkoutOverviewPage.subtotal).toHaveText('Item total: $29.99');
  await expect(pages.checkoutOverviewPage.tax).toHaveText('Tax: $2.40');
  await expect(pages.checkoutOverviewPage.total).toHaveText('Total: $32.39');
  await pages.checkoutOverviewPage.finish();

  await expect(page).toHaveURL(/\/checkout-complete\.html$/);
  await expect(pages.checkoutCompletePage.confirmationHeading).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cart, empty' })).toBeVisible();
});
