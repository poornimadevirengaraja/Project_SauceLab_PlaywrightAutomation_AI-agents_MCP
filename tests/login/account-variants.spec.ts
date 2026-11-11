import { test, expect } from '../../fixtures/sauceDemoFixture';
import { PageManager } from '../../pages/common/PageManager';

const accountObservations: Record<string, string> = {
  problem_user: 'All six inventory product images used the account-specific placeholder artwork; inventory controls remained available.',
  performance_glitch_user: 'This account has an intentional login delay; do not apply standard-user timing expectations.',
  error_user: 'The standard six-item inventory layout and product artwork appeared in this pass; this test does not assume standard-user behavior beyond the shared controls.',
  visual_user: 'The backpack used placeholder artwork while the remaining product images loaded in this pass.',
};

test.describe('Login Screen and Authentication', { tag: '@smoke' }, () => {
  const accountScenarios = ['problem_user', 'performance_glitch_user', 'error_user', 'visual_user'];

  for (const accountScenario of accountScenarios) {
    test(`Exercise account-specific inventory for ${accountScenario}`, async ({ browser, testData }) => {
      const account = testData.users.find((user) => user.scenario === accountScenario);
      expect(account).toBeDefined();

      const inventoryTimeout = accountScenario === 'performance_glitch_user' ? 45_000 : 10_000;
      test.setTimeout(accountScenario === 'performance_glitch_user' ? 90_000 : 30_000);

      const context = await browser.newContext();
      const page = await context.newPage();
      const pages = new PageManager(page);

      try {
        // 1. Log in with the account in a fresh context and observe its inventory presentation.
        await pages.loginPage.open('https://www.saucedemo.com/');
        await pages.loginPage.username.fill(account!.username, { timeout: inventoryTimeout });
        await pages.loginPage.password.fill(account!.password, { timeout: inventoryTimeout });
        await pages.loginPage.loginButton.click({ timeout: inventoryTimeout });
        test.info().annotations.push({
          type: 'Account-specific behavior',
          description: accountObservations[accountScenario],
        });

        if (account!.expectedResult === 'success') {
          await expect(page).toHaveURL(/\/inventory\.html$/, { timeout: inventoryTimeout });
          await expect(pages.inventoryPage.productsHeading).toBeVisible({ timeout: inventoryTimeout });
          await expect(page.locator('.inventory_item')).toHaveCount(6, { timeout: inventoryTimeout });
          await expect(pages.inventoryPage.cartButton).toBeVisible({ timeout: inventoryTimeout });
          await expect(page.getByRole('combobox', { name: 'Sort products' })).toBeVisible({ timeout: inventoryTimeout });
          await expect(page.getByRole('button', { name: 'Add to cart' }).first()).toBeVisible({ timeout: inventoryTimeout });
          await expect(page.getByRole('contentinfo')).toBeVisible({ timeout: inventoryTimeout });
        } else {
          await expect(pages.loginPage.errorMessage).toBeVisible({ timeout: inventoryTimeout });
          await expect(pages.loginPage.errorMessage).toContainText(account!.expectedError, { timeout: inventoryTimeout });
          await expect(page).toHaveURL(/saucedemo\.com\/?$/, { timeout: inventoryTimeout });
        }
      } finally {
        await context.close();
      }
    });
  }
});