import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../common/BasePage';

export class ProductDetailPage extends BasePage {
  readonly productImage: Locator;
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly backToProductsButton: Locator;
  readonly header: Locator;
  readonly cartButton: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    super(page);
    this.productImage = page.locator('.inventory_details_img');
    this.productName = page.locator('.inventory_details_name');
    this.productDescription = page.locator('.inventory_details_desc');
    this.productPrice = page.locator('.inventory_details_price');
    this.backToProductsButton = page.getByRole('button', { name: 'Back to products' });
    this.header = page.getByRole('banner');
    this.cartButton = page.getByRole('button', { name: /Cart/ });
    this.footer = page.getByRole('contentinfo');
  }

  productActionButton(action: 'Add to cart' | 'Remove'): Locator {
    return this.page.getByRole('button', { name: action, exact: true });
  }
}