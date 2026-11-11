import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../common/BasePage';
import { CheckoutProfile } from '../../../utilities/sauceDemoTestData';

export class CheckoutInformationPage extends BasePage {
  readonly firstName: Locator;

  constructor(page: Page) {
    super(page);
    this.firstName = page.getByTestId('firstName');
  }

  async fillInformation(profile: CheckoutProfile): Promise<void> {
    await this.firstName.fill(profile.firstName);
    await this.page.getByTestId('lastName').fill(profile.lastName);
    await this.page.getByTestId('postalCode').fill(profile.postalCode);
  }

  async continue(): Promise<void> {
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }
}