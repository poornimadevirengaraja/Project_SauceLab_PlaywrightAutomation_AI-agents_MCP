import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Login Screen and Authentication', { tag: '@smoke' }, () => {
  test('Show locked-out user error', async ({ page, pages, testData }) => {
    const lockedUser = testData.users.find((user) => user.expectedResult === 'locked');
    expect(lockedUser).toBeDefined();

    // 1. Submit the locked-out user's credentials and verify the accessible error remains usable.
    await pages.loginPage.open('/');
    await pages.loginPage.login(lockedUser!.username, lockedUser!.password);

    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(pages.loginPage.errorMessage).toContainText(lockedUser!.expectedError);
    await expect(page.getByRole('button', { name: 'Dismiss error' })).toBeVisible();
    await expect(pages.loginPage.username).toBeVisible();
    await expect(pages.loginPage.password).toBeVisible();
    await expect(pages.loginPage.loginButton).toBeVisible();
  });
});