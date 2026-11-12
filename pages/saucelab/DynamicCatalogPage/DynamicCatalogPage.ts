import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../common/BasePage';

export class DynamicCatalogPage extends BasePage {
  readonly heading: Locator;
  readonly lazyLoadContainer: Locator;
  readonly lazyLoadCards: Locator;
  readonly lazyLoadPlaceholders: Locator;
  readonly spinner: Locator;
  readonly spinnerGrid: Locator;
  readonly sliderContainer: Locator;
  readonly sliderDots: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByTestId('title');
    this.lazyLoadContainer = page.locator('.dynamic_catalog_lazy_load_container');
    this.lazyLoadCards = this.lazyLoadContainer.locator(
      '.dynamic_catalog_card:not(:has(.dynamic_catalog_card_placeholder))',
    );
    this.lazyLoadPlaceholders = this.lazyLoadContainer.locator('.dynamic_catalog_card_placeholder');
    this.spinner = page.locator('.dynamic_catalog_spinner');
    this.spinnerGrid = page.locator('.dynamic_catalog_spinner_grid');
    this.sliderContainer = page.locator('.dynamic_catalog_slider_container');
    this.sliderDots = page.locator('.dynamic_catalog_slider_dot');
  }

  sliderDot(productName: string): Locator {
    return this.page.getByRole('button', { name: `Show ${productName}`, exact: true });
  }

  get activeSliderDot(): Locator {
    return this.page.locator('.dynamic_catalog_slider_dot.active');
  }
}
