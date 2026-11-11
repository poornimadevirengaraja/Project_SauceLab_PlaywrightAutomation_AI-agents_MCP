import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../common/BasePage';

export class CheckoutOverviewPage extends BasePage {
  readonly items: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.locator('.cart_item');
    this.subtotal = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.total = page.locator('.summary_total_label');
  }

  async finish(): Promise<void> {
    await this.page.getByRole('button', { name: 'Finish' }).click();
  }
}