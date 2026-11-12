// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('User Interface Component Testing', () => {
  test('Inspect authenticated header and navigation drawer', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const product = testData.inventoryProducts.find((item) => item.productName === 'Sauce Labs Backpack');
    expect(standardUser).toBeDefined();
    expect(product).toBeDefined();

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByText('Swag Labs', { exact: true }).first()).toBeVisible();
    await expect(pages.navigationPage.openMenuButton).toBeVisible();
    await expect(pages.inventoryPage.cartButton).toBeVisible();
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, empty');

    await pages.inventoryPage.addToCart(product!.productName);
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, 1 items');
    const cartBox = await pages.inventoryPage.cartButton.boundingBox();
    const headerBox = await page.getByRole('banner').boundingBox();
    expect(cartBox).not.toBeNull();
    expect(headerBox).not.toBeNull();
    expect(cartBox!.x).toBeGreaterThanOrEqual(headerBox!.x);
    expect(cartBox!.x + cartBox!.width).toBeLessThanOrEqual(headerBox!.x + headerBox!.width);

    await pages.navigationPage.open();
    await expect(pages.navigationPage.drawer).toBeVisible();
    for (const label of ['All Items', 'Dynamic Catalog', 'About', 'Logout', 'Reset App State', 'Close Menu']) {
      await expect(pages.navigationPage.menuEntry(label)).toBeVisible();
    }
    await expect(pages.navigationPage.dynamicCatalogLink).toHaveAttribute('aria-expanded', 'false');
    await pages.navigationPage.dynamicCatalogLink.click();
    await expect(pages.navigationPage.dynamicCatalogLink).toHaveAttribute('aria-expanded', 'true');
    await expect(pages.navigationPage.menuEntry('Lazy Load')).toBeVisible();

    await page.keyboard.press('Tab');
    await expect(pages.navigationPage.focusedElement).toBeVisible();
    await expect(pages.navigationPage.focusedElement).toBeFocused();
    await pages.navigationPage.close();
    await expect(pages.navigationPage.drawer).toBeHidden();
    await expect(pages.inventoryPage.productRemoveButton(product!.productName)).toBeVisible();
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, 1 items');
  });
});
