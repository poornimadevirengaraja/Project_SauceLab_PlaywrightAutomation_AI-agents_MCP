import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../common/BasePage';

export class CheckoutCompletePage extends BasePage {
  readonly confirmationHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.confirmationHeading = page.getByRole('heading', { name: 'Thank you for your order!' });
  }
}