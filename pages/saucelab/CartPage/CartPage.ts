import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../common/BasePage';

export class CartPage extends BasePage {
  readonly items: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.locator('.cart_item');
  }

  async checkout(): Promise<void> {
    await this.page.getByRole('button', { name: 'Checkout' }).click();
  }
}