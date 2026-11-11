import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../common/BasePage';
import { CheckoutProfile } from '../../../utilities/sauceDemoTestData';

export class CheckoutInformationPage extends BasePage {
  readonly heading: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly dismissErrorButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByTestId('title');
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.errorMessage = page.getByRole('alert');
    this.dismissErrorButton = page.getByRole('button', { name: 'Dismiss error' });
  }

  async fillInformation(profile: CheckoutProfile): Promise<void> {
    await this.firstName.fill(profile.firstName);
    await this.lastName.fill(profile.lastName);
    await this.postalCode.fill(profile.postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async dismissError(): Promise<void> {
    await this.dismissErrorButton.click();
  }
}