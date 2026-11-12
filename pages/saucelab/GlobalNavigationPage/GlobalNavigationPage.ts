import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../common/BasePage';

export class GlobalNavigationPage extends BasePage {
  readonly drawer: Locator;
  readonly openMenuButton: Locator;
  readonly closeMenuButton: Locator;
  readonly allItemsLink: Locator;
  readonly dynamicCatalogLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly focusedElement: Locator;

  constructor(page: Page) {
    super(page);
    this.drawer = page.locator('.bm-menu-wrap');
    this.openMenuButton = page.getByRole('button', { name: 'Open Menu' });
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
    this.allItemsLink = page.locator('#inventory_sidebar_link');
    this.dynamicCatalogLink = page.locator('#dynamic_catalog_sidebar_link');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.resetAppStateLink = page.locator('#reset_sidebar_link');
    this.focusedElement = page.locator(':focus');
  }

  async open(): Promise<void> {
    await this.openMenuButton.click();
  }

  async close(): Promise<void> {
    await this.closeMenuButton.click();
  }

  async openDynamicCatalogEntry(label: string): Promise<void> {
    if (!(await this.closeMenuButton.isVisible())) {
      await this.open();
      await this.closeMenuButton.waitFor({ state: 'visible' });
    }
    await this.dynamicCatalogLink.waitFor({ state: 'visible' });
    if (await this.dynamicCatalogLink.getAttribute('aria-expanded') !== 'true') {
      await this.dynamicCatalogLink.click();
    }
    await this.menuEntry(label).click();
  }

  menuEntry(label: string): Locator {
    return label === 'Close Menu'
      ? this.closeMenuButton
      : this.drawer.getByText(label, { exact: true });
  }

  async pressEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }

  async pressTab(): Promise<void> {
    await this.page.keyboard.press('Tab');
  }
}