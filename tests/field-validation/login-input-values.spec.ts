// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Field Validation Coverage', () => {
  test('Reject invalid login input values and allow correction', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const unknownUser = testData.users.find((user) => user.scenario === 'unknown_user');
    expect(standardUser).toBeDefined();
    expect(unknownUser).toBeDefined();

    await pages.loginPage.open('/');
    const rejectedAttempts = [
      { username: unknownUser!.username, password: standardUser!.password },
      { username: standardUser!.username.toUpperCase(), password: standardUser!.password },
      { username: standardUser!.username, password: standardUser!.password.toUpperCase() },
      { username: ` ${standardUser!.username} `, password: standardUser!.password },
      { username: standardUser!.username, password: ` ${standardUser!.password} ` },
      { username: '   ', password: standardUser!.password },
      { username: standardUser!.username, password: '   ' },
    ];

    for (const attempt of rejectedAttempts) {
      await pages.loginPage.username.fill(attempt.username);
      await pages.loginPage.password.fill(attempt.password);
      await pages.loginPage.loginButton.click();
      await expect(pages.loginPage.errorMessage).toBeVisible();
      await expect(page.getByRole('alert')).toBeVisible();
      await expect(page).not.toHaveURL(/\/inventory\.html$/);
      await pages.loginPage.dismissErrorButton.click();
      await expect(pages.loginPage.errorMessage).toBeHidden();
    }

    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pages.loginPage.errorMessage).toHaveCount(0);
  });
});
