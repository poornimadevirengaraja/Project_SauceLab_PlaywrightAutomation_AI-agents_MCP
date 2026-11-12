// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { readFile } from 'node:fs/promises';
import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Checkout and Order Completion', () => {
  test('Generate a PDF order from the completion page', async ({ page, pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    const checkoutProfile = testData.checkoutProfiles.find((profile) => profile.scenario === 'standard_checkout');
    const product = testData.inventoryProducts.find((item) => item.productName === 'Sauce Labs Backpack');
    expect(standardUser).toBeDefined();
    expect(checkoutProfile).toBeDefined();
    expect(product).toBeDefined();

    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser!.username, standardUser!.password);
    await pages.inventoryPage.addToCart(product!.productName);
    await pages.inventoryPage.cartButton.click();
    await pages.cartPage.checkout();
    await pages.checkoutInformationPage.fillInformation(checkoutProfile!);
    await pages.checkoutInformationPage.continue();
    await pages.checkoutOverviewPage.finish();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(pages.checkoutCompletePage.confirmationHeading).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await pages.checkoutCompletePage.generatePdfButton.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
    const filePath = await download.path();
    expect(filePath).not.toBeNull();
    const pdf = await readFile(filePath!);
    expect(pdf.subarray(0, 5).toString('ascii')).toBe('%PDF-');
    expect(await download.failure()).toBeNull();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(pages.checkoutCompletePage.confirmationHeading).toBeVisible();
  });
});
