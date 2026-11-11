import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../common/BasePage';

export class InventoryPage extends BasePage {
  readonly productsHeading: Locator;
  readonly cartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productsHeading = page.getByTestId('title');
    this.cartButton = page.getByTestId('shopping-cart-link');
  }

  async addToCart(productName: string): Promise<void> {
    const product = this.page.locator('.inventory_item').filter({ hasText: productName });
    await product.getByRole('button', { name: 'Add to cart' }).click();
  }
}