// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Dynamic Catalog Experiences', () => {
  test('Verify Lazy Load catalog loading and scrolling', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    expect(standardUser).toBeDefined();

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await pages.navigationPage.openDynamicCatalogEntry('Lazy Load');

    await expect(page).toHaveURL(/\/dynamic-catalog-lazy-load\.html$/);
    await expect(pages.dynamicCatalogPage.heading).toHaveText('Dynamic Catalog - Lazy Load');
    await expect(pages.dynamicCatalogPage.lazyLoadCards.first()).toBeVisible();
    const initialPlaceholderCount = await pages.dynamicCatalogPage.lazyLoadPlaceholders.count();
    expect(initialPlaceholderCount).toBeGreaterThan(0);

    const initialCardCount = await pages.dynamicCatalogPage.lazyLoadCards.count();
    for (let load = 0; load < 4; load += 1) {
      const previousCardCount = await pages.dynamicCatalogPage.lazyLoadCards.count();
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await expect.poll(
        () => pages.dynamicCatalogPage.lazyLoadCards.count(),
        { timeout: 10000 },
      ).toBeGreaterThan(previousCardCount);
    }
    expect(await pages.dynamicCatalogPage.lazyLoadCards.count()).toBeGreaterThan(initialCardCount);
    expect(await pages.dynamicCatalogPage.lazyLoadPlaceholders.count()).toBeLessThan(initialPlaceholderCount);

    const loadedContentIsValid = await pages.dynamicCatalogPage.lazyLoadCards.evaluateAll((cards) =>
      cards.every((card) => {
        const image = card.querySelector('img');
        const name = card.querySelector('.dynamic_catalog_card_name')?.textContent?.trim();
        const price = card.querySelector('.dynamic_catalog_card_price')?.textContent?.trim();
        return Boolean(
          image &&
            image.complete &&
            image.naturalWidth > 0 &&
            image.alt.trim() &&
            name &&
            price &&
            /^\$\d+\.\d{2}$/.test(price),
        );
      }),
    );
    expect(loadedContentIsValid, 'Loaded catalog cards should have valid imagery, names, and prices').toBe(true);

    const lastLoadedCard = pages.dynamicCatalogPage.lazyLoadCards.last();
    await lastLoadedCard.scrollIntoViewIfNeeded();
    await expect(lastLoadedCard).toBeInViewport();
    await expect(page.getByRole('contentinfo')).toBeVisible();
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasHorizontalOverflow, 'Lazy Load content should not overflow horizontally').toBe(false);
    await expect(pages.dynamicCatalogPage.heading).toHaveText('Dynamic Catalog - Lazy Load');
  });
});
