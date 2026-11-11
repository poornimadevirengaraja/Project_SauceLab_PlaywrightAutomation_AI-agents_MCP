import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Login Screen and Authentication', { tag: '@smoke' }, () => {
  test('Render login screen and its informational content', async ({ page, pages, testData }) => {
    // 1. Open SauceDemo in the fresh test context and confirm the login page is presented.
    await pages.loginPage.open('/');
    await expect(page).toHaveTitle('Swag Labs');
    await expect(page.getByRole('form', { name: 'Login' })).toBeVisible();

    // 2. Inspect accessible controls, password masking, accepted accounts, branding, and layout bounds.
    await expect(pages.loginPage.username).toBeVisible();
    await expect(pages.loginPage.password).toBeVisible();
    await expect(pages.loginPage.username).toHaveAttribute('type', 'text');
    await expect(pages.loginPage.password).toHaveAttribute('type', 'password');
    await expect(pages.loginPage.loginButton).toBeVisible();
    await expect(page.locator('.login_logo')).toHaveText('Swag Labs');
    await expect(pages.loginPage.acceptedUsernames).toBeVisible();
    for (const user of testData.users.filter((candidate) => candidate.expectedResult !== 'failure')) {
      await expect(pages.loginPage.acceptedUsernames).toContainText(user.username);
    }
    await expect(pages.loginPage.sharedPassword).toContainText(testData.sharedPassword);

    const viewport = page.viewportSize();
    const loginButtonBounds = await pages.loginPage.loginButton.boundingBox();
    expect(viewport).not.toBeNull();
    expect(loginButtonBounds).not.toBeNull();
    expect(loginButtonBounds!.x).toBeGreaterThanOrEqual(0);
    expect(loginButtonBounds!.x + loginButtonBounds!.width).toBeLessThanOrEqual(viewport!.width);
  });
});