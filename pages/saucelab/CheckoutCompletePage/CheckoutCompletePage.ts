import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../common/BasePage';

export class CheckoutCompletePage extends BasePage {
  readonly confirmationHeading: Locator;
  readonly ponyExpressImage: Locator;
  readonly dispatchMessage: Locator;
  readonly backHomeButton: Locator;
  readonly generatePdfButton: Locator;
  readonly cartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.confirmationHeading = page.getByRole('heading', { name: 'Thank you for your order!' });
    this.ponyExpressImage = page.getByRole('img', { name: 'Pony Express', exact: true });
    this.dispatchMessage = page.getByText('Your order has been dispatched, and will arrive just as fast as the pony can get there!', { exact: true });
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
    this.generatePdfButton = page.getByRole('button', { name: 'Generate PDF order' });
    this.cartButton = page.getByTestId('shopping-cart-link');
  }
}