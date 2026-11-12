// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('User Interface Component Testing', () => {
  test('Inspect login screen components and visual states', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    expect(standardUser).toBeDefined();

    await pages.loginPage.open('/');
    await expect(page.locator('.login_logo')).toHaveText('Swag Labs');
    await expect(page.getByRole('form', { name: 'Login' })).toBeVisible();
    await expect(pages.loginPage.username).toBeVisible();
    await expect(pages.loginPage.password).toBeVisible();
    await expect(pages.loginPage.loginButton).toBeVisible();
    await expect(pages.loginPage.acceptedUsernames).toBeVisible();
    await expect(pages.loginPage.sharedPassword).toContainText(testData.sharedPassword);

    for (const control of [pages.loginPage.username, pages.loginPage.password, pages.loginPage.loginButton]) {
      const box = await control.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(1280);
    }

    await pages.loginPage.username.focus();
    await expect(pages.loginPage.username).toBeFocused();
    await expect(page.locator(':focus-visible')).toHaveCount(1);
    await pages.loginPage.username.fill(standardUser!.username);
    await pages.loginPage.password.fill(standardUser!.password);
    await expect(pages.loginPage.password).toHaveAttribute('type', 'password');
    await expect(pages.loginPage.password).toHaveValue(standardUser!.password);

    await pages.loginPage.password.fill('');
    await pages.loginPage.loginButton.click();
    await expect(pages.loginPage.errorMessage).toContainText('Password is required');
    await expect(page.getByRole('alert')).toBeVisible();
    const alertBox = await page.getByRole('alert').boundingBox();
    const loginButtonBox = await pages.loginPage.loginButton.boundingBox();
    expect(alertBox).not.toBeNull();
    expect(loginButtonBox).not.toBeNull();
    expect(alertBox!.y + alertBox!.height).toBeLessThanOrEqual(loginButtonBox!.y);

    await pages.loginPage.dismissErrorButton.click();
    await expect(pages.loginPage.errorMessage).toBeHidden();
    await expect(pages.loginPage.username).toHaveValue(standardUser!.username);
    await pages.loginPage.password.fill(standardUser!.password);
    await pages.loginPage.loginButton.click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
  });
});
