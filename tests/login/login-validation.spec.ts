import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Login Screen and Authentication', { tag: '@smoke' }, () => {
  test('Reject empty and invalid login submissions with usable errors', async ({ page, pages, testData }) => {
    const unknownUser = testData.users.find((user) => user.scenario === 'unknown_user');
    const wrongPasswordUser = testData.users.find((user) => user.scenario === 'standard_user_wrong_password');
    expect(unknownUser).toBeDefined();
    expect(wrongPasswordUser).toBeDefined();

    // 1. Submit both fields empty and verify the accessible, dismissible required-credentials error.
    await pages.loginPage.open('/');
    await pages.loginPage.loginButton.click();
    await expect(pages.loginPage.errorMessage).toBeVisible();
    await expect(pages.loginPage.errorMessage).toContainText('Username is required');
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Dismiss error' })).toBeVisible();

    // 2. Dismiss the error, submit unknown credentials, and verify rejection on the login page.
    await page.getByRole('button', { name: 'Dismiss error' }).click();
    await pages.loginPage.login(unknownUser!.username, unknownUser!.password);
    await expect(pages.loginPage.errorMessage).toBeVisible();
    await expect(pages.loginPage.errorMessage).toContainText(unknownUser!.expectedError);
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
    await expect(pages.loginPage.loginButton).toBeVisible();

    // 3. Submit the supported username with an incorrect password and verify protected inventory stays hidden.
    await pages.loginPage.login(wrongPasswordUser!.username, wrongPasswordUser!.password);
    await expect(pages.loginPage.errorMessage).toBeVisible();
    await expect(pages.loginPage.errorMessage).toContainText(wrongPasswordUser!.expectedError);
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
    await expect(page.getByRole('heading', { name: 'Products' })).toHaveCount(0);
  });
});