import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../common/BasePage';

export class LoginPage extends BasePage {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly dismissErrorButton: Locator;
  readonly acceptedUsernames: Locator;
  readonly sharedPassword: Locator;

  constructor(page: Page) {
    super(page);
    this.username = page.getByPlaceholder('Username');
    this.password = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByTestId('error');
    this.dismissErrorButton = page.getByRole('button', { name: 'Dismiss error' });
    this.acceptedUsernames = page.locator('#login_credentials');
    this.sharedPassword = page.getByRole('heading', { name: 'Password for all users:' }).locator('..');
  }

  async login(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}