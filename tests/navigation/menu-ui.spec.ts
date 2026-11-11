import { test, expect } from '../../fixtures/sauceDemoFixture';

test.describe('Global Navigation, Header, and Footer', () => {
  test('Open and close the global navigation menu', async ({ pages, testData }) => {
    const standardUser = testData.users.find((user) => user.scenario === 'standard_user');
    if (!standardUser) {
      throw new Error('standard_user credentials are missing from test data.');
    }

    // Step 1: Log in as standard_user, then activate Open Menu.
    await pages.loginPage.open('/');
    await pages.loginPage.login(standardUser.username, standardUser.password);
    await pages.navigationPage.open();
    await expect(pages.navigationPage.drawer).toBeVisible();
    const navigationEntries = testData.navigationMenuEntries.filter(
      (entry) => entry.scenario === 'open_close_global_navigation_menu',
    );
    expect(navigationEntries).toHaveLength(6);
    for (const { label } of navigationEntries) {
      await expect(pages.navigationPage.menuEntry(label)).toBeVisible();
    }

    // Step 2: Close the drawer with Close Menu and reopen it.
    await pages.navigationPage.close();
    await expect(pages.navigationPage.drawer).toBeHidden();
    await expect(pages.inventoryPage.productsHeading).toBeVisible();
    await expect(pages.navigationPage.openMenuButton).toBeVisible();
    await pages.navigationPage.open();
    await expect(pages.navigationPage.drawer).toBeVisible();
    await expect(pages.inventoryPage.productsHeading).toBeVisible();

    // Step 3: With the drawer open, use Escape and keyboard navigation where supported.
    await pages.navigationPage.pressTab();
    await expect(pages.navigationPage.focusedElement).toBeVisible();
    await expect(pages.navigationPage.focusedElement).toBeFocused();
    await pages.navigationPage.pressEscape();
    await expect(pages.navigationPage.drawer).toBeHidden();
    await pages.navigationPage.pressTab();
    await expect(pages.navigationPage.focusedElement).toBeVisible();
    await expect(pages.navigationPage.focusedElement).toBeFocused();
    await pages.navigationPage.open();
    await pages.navigationPage.pressTab();
    await expect(pages.navigationPage.drawer).toBeVisible();
    await expect(pages.navigationPage.focusedElement).toBeVisible();
    await expect(pages.navigationPage.focusedElement).toBeFocused();
  });
});
