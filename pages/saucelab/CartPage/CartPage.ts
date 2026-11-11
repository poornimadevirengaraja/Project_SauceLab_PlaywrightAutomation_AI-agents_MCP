import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../common/BasePage';

export class CartPage extends BasePage {
  readonly heading: Locator;
  readonly quantityHeading: Locator;
  readonly descriptionHeading: Locator;
  readonly items: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly cartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByTestId('title');
    this.quantityHeading = page.locator('.cart_quantity_label');
    this.descriptionHeading = page.locator('.cart_desc_label');
    this.items = page.locator('.cart_item');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.cartButton = page.getByTestId('shopping-cart-link');
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}