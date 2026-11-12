// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Field Validation Coverage', () => {
  test('Validate username and password independently', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    expect(standardUser).toBeDefined();

    await pages.loginPage.open('/');
    await pages.loginPage.password.fill(standardUser!.password);
    await pages.loginPage.loginButton.click();
    await expect(pages.loginPage.errorMessage).toContainText('Username is required');
    await expect(pages.loginPage.password).toHaveAttribute('type', 'password');
    await expect(page).not.toHaveURL(/\/inventory\.html$/);

    await pages.loginPage.dismissErrorButton.click();
    await expect(pages.loginPage.errorMessage).toBeHidden();
    await expect(pages.loginPage.password).toHaveValue(standardUser!.password);
    await pages.loginPage.username.fill(standardUser!.username);
    await pages.loginPage.password.fill('');
    await pages.loginPage.loginButton.click();
    await expect(pages.loginPage.errorMessage).toContainText('Password is required');
    await expect(pages.loginPage.username).toHaveValue(standardUser!.username);
    await expect(pages.loginPage.password).toHaveAttribute('type', 'password');
    await expect(page).not.toHaveURL(/\/inventory\.html$/);

    await pages.loginPage.dismissErrorButton.click();
    await pages.loginPage.password.fill(standardUser!.password);
    await pages.loginPage.loginButton.click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pages.loginPage.errorMessage).toHaveCount(0);
  });
});
