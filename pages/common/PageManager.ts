import { Page } from '@playwright/test';
import { CartPage } from '../saucelab/CartPage/CartPage';
import { CheckoutCompletePage } from '../saucelab/CheckoutCompletePage/CheckoutCompletePage';
import { CheckoutInformationPage } from '../saucelab/CheckoutInformationPage/CheckoutInformationPage';
import { CheckoutOverviewPage } from '../saucelab/CheckoutOverviewPage/CheckoutOverviewPage';
import { InventoryPage } from '../saucelab/InventoryPage/InventoryPage';
import { LoginPage } from '../saucelab/LoginPage/LoginPage';

export class PageManager {
  readonly loginPage: LoginPage;
  readonly inventoryPage: InventoryPage;
  readonly cartPage: CartPage;
  readonly checkoutInformationPage: CheckoutInformationPage;
  readonly checkoutOverviewPage: CheckoutOverviewPage;
  readonly checkoutCompletePage: CheckoutCompletePage;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
    this.cartPage = new CartPage(page);
    this.checkoutInformationPage = new CheckoutInformationPage(page);
    this.checkoutOverviewPage = new CheckoutOverviewPage(page);
    this.checkoutCompletePage = new CheckoutCompletePage(page);
  }
}