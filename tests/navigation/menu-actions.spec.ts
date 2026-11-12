// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Global Navigation, Header, and Footer', () => {
  test('Navigate through menu entries, reset app state, and log out', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const product = testData.inventoryProducts.find((item) => item.productName === 'Sauce Labs Backpack');
    expect(standardUser).toBeDefined();
    expect(product).toBeDefined();

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await pages.navigationPage.open();
    await pages.navigationPage.allItemsLink.click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pages.inventoryPage.productsHeading).toHaveText('Products');

    for (const [label, pathname] of [
      ['Lazy Load', '/dynamic-catalog-lazy-load.html'],
      ['Spinner', '/dynamic-catalog-spinner.html'],
      ['Slider', '/dynamic-catalog-slider.html'],
    ] as const) {
      await pages.navigationPage.openDynamicCatalogEntry(label);
      await expect(page).toHaveURL(new RegExp(`${pathname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
      await expect(pages.dynamicCatalogPage.heading).toHaveText(`Dynamic Catalog - ${label}`);
      if (!(await pages.navigationPage.closeMenuButton.isVisible())) {
        await pages.navigationPage.open();
      }
      await expect(pages.navigationPage.drawer).toBeVisible();
      await expect(pages.navigationPage.menuEntry('All Items')).toBeVisible();
      await pages.navigationPage.close();
      await pages.navigationPage.closeMenuButton.waitFor({ state: 'hidden' });
    }

    await page.goto('/inventory.html');
    await pages.inventoryPage.addToCart(product!.productName);
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, 1 items');
    await pages.navigationPage.open();
    await pages.navigationPage.resetAppStateLink.click();
    await page.reload();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pages.inventoryPage.cartButton).toHaveAccessibleName('Cart, empty');
    await expect(pages.inventoryPage.productAddButton(product!.productName)).toBeVisible();
    await expect(pages.inventoryPage.productsHeading).toHaveText('Products');

    await pages.navigationPage.open();
    await pages.navigationPage.logoutLink.click();
    await expect(page).toHaveURL(/\/$/);
    await expect(pages.loginPage.loginButton).toBeVisible();
    await page.goto('/inventory.html');
    await expect(page).toHaveURL(/\/$/);
    await expect(pages.loginPage.loginButton).toBeVisible();
  });
});
