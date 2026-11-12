// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Integration Testing', () => {
  test('Verify authentication, logout, and protected-route integration', async ({ page, pages, testData }) => {
    const unknownUser = testData.users.find((user) => user.scenario === 'unknown_user');
    const lockedUser = testData.users.find((user) => user.scenario === 'locked_out_user');
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    expect(unknownUser).toBeDefined();
    expect(lockedUser).toBeDefined();
    expect(standardUser).toBeDefined();

    await pages.loginPage.open('/');
    await pages.loginPage.login(unknownUser!.username, unknownUser!.password);
    await expect(pages.loginPage.errorMessage).toContainText(unknownUser!.expectedError);
    await page.goto('/inventory.html');
    await expect(page).toHaveURL(/\/$/);
    await expect(pages.loginPage.loginButton).toBeVisible();

    await pages.loginPage.login(lockedUser!.username, lockedUser!.password);
    await expect(pages.loginPage.errorMessage).toContainText(lockedUser!.expectedError);
    await page.goto('/cart.html');
    await expect(page).toHaveURL(/\/$/);
    await expect(pages.loginPage.loginButton).toBeVisible();

    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await pages.inventoryPage.addToCart('Sauce Labs Backpack');
    await pages.inventoryPage.cartButton.click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await pages.navigationPage.open();
    await pages.navigationPage.logoutLink.click();
    await expect(page).toHaveURL(/\/$/);
    await expect(pages.loginPage.loginButton).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await page.goto('/inventory.html');
    await expect(page).toHaveURL(/\/$/);
    await expect(pages.loginPage.loginButton).toBeVisible();
  });
});
