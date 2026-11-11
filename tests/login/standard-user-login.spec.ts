import { test, expect } from '../../fixtures/sauceDemoFixture';
import { PageManager } from '../../pages/common/PageManager';

test.describe('Login Screen and Authentication', { tag: '@smoke' }, () => {
  test('Authenticate standard user and reach inventory', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    expect(standardUser).toBeDefined();

    // 1. Submit standard-user credentials with the Login button and verify the authenticated inventory.
    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pages.inventoryPage.productsHeading).toBeVisible();
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('button', { name: /Cart/ })).toBeVisible();
    await expect(page.getByTestId('item-4-img-link')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();

    // 2. Repeat authentication in a fresh browser context using Enter from the password field.
    const browser = page.context().browser();
    expect(browser).not.toBeNull();
    const keyboardPage = await browser!.newPage();
    try {
      const keyboardPages = new PageManager(keyboardPage);
      await keyboardPages.loginPage.open('https://www.saucedemo.com/');
      await keyboardPages.loginPage.username.fill(standardUser!.username);
      await keyboardPages.loginPage.password.fill(standardUser!.password);
      await keyboardPages.loginPage.password.press('Enter');

      await expect(keyboardPage).toHaveURL(/\/inventory\.html$/);
      await expect(keyboardPages.inventoryPage.productsHeading).toBeVisible();
      await expect(keyboardPage.getByRole('banner')).toBeVisible();
      await expect(keyboardPage.getByRole('button', { name: /Cart/ })).toBeVisible();
      await expect(keyboardPage.getByTestId('item-4-img-link')).toBeVisible();
      await expect(keyboardPage.getByRole('contentinfo')).toBeVisible();
    } finally {
      await keyboardPage.context().close();
    }
  });
});