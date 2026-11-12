import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../common/BasePage';

export class InventoryPage extends BasePage {
  readonly productsHeading: Locator;
  readonly cartButton: Locator;
  readonly sortSelect: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);
    this.productsHeading = page.getByTestId('title');
    this.cartButton = page.getByTestId('shopping-cart-link');
    this.sortSelect = page.getByRole('combobox', { name: 'Sort products' });
    this.productCards = page.locator('.inventory_item');
  }

  productCard(productName: string): Locator {
    return this.productCards.filter({ hasText: productName });
  }

  productImage(productName: string): Locator {
    return this.productCard(productName).locator('.inventory_item_img img');
  }

  productImageLink(productName: string): Locator {
    return this.productCard(productName).locator('[data-test$="-img-link"]');
  }

  productNameLabel(productName: string): Locator {
    return this.productCard(productName).locator('.inventory_item_name');
  }

  productNameLink(productName: string): Locator {
    return this.productCard(productName).locator('[data-test$="-title-link"]');
  }

  productDescription(productName: string): Locator {
    return this.productCard(productName).locator('.inventory_item_desc');
  }

  productPrice(productName: string): Locator {
    return this.productCard(productName).locator('.inventory_item_price');
  }

  productAddButton(productName: string): Locator {
    return this.productCard(productName).getByRole('button', { name: 'Add to cart', exact: true });
  }

  productRemoveButton(productName: string): Locator {
    return this.productCard(productName).getByRole('button', { name: 'Remove', exact: true });
  }

  async addToCart(productName: string): Promise<void> {
    await this.productAddButton(productName).click();
  }
}