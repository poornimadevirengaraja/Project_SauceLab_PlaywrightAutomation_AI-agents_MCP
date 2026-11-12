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
  readonly footer: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByTestId('title');
    this.quantityHeading = page.locator('.cart_quantity_label');
    this.descriptionHeading = page.locator('.cart_desc_label');
    this.items = page.locator('.cart_item');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.cartButton = page.getByTestId('shopping-cart-link');
    this.footer = page.getByRole('contentinfo');
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  item(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  itemQuantity(productName: string): Locator {
    return this.item(productName).locator('.cart_quantity');
  }

  itemName(productName: string): Locator {
    return this.item(productName).locator('.inventory_item_name');
  }

  itemDescription(productName: string): Locator {
    return this.item(productName).locator('.inventory_item_desc');
  }

  itemPrice(productName: string): Locator {
    return this.item(productName).locator('.inventory_item_price');
  }

  itemRemoveButton(productName: string): Locator {
    return this.item(productName).getByRole('button', { name: 'Remove', exact: true });
  }
}