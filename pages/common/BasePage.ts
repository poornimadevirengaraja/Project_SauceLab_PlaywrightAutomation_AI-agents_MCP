import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async open(pathname: string): Promise<void> {
    await this.page.goto(pathname);
  }
}