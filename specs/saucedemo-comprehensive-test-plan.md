# SauceDemo Comprehensive End-to-End and UI Test Plan

## Application Overview

Comprehensive system and end-to-end coverage for https://www.saucedemo.com/. Covers the login screen and published test accounts, authenticated product listing and all six product details, global menu/header/footer, cart, checkout information, review, completion, dynamic catalog demos, account-dependent UI, responsive presentation, keyboard/accessibility, and route/session behavior. Use a fresh browser context for each test, clear application state before authenticated tests, and avoid treating known demo-account quirks as baseline failures unless they contradict that account's documented behavior. Public demo credentials shown on the page: standard_user / secret_sauce; locked_out_user is intended to show login rejection. Each test is independent and begins from a blank/fresh state unless its steps establish state explicitly.

## Test Scenarios

### 1. Login Screen and Authentication

**Seed:** `tests/seed.spec.ts`

#### 1.1. Render login screen and its informational content

**File:** `tests/login/login-screen-ui.spec.ts`

**Steps:**
  1. Open https://www.saucedemo.com/ in a fresh browser context.
    - expect: The page title is Swag Labs and the login form is visible.
  2. Inspect the login form, username and password inputs, Login button, accepted-usernames text, and shared page branding.
    - expect: Username and Password controls have visible labels or accessible names.
    - expect: The password field masks entered characters.
    - expect: The page lists the supported demo usernames and shared password secret_sauce.
    - expect: The login page has no clipped, overlapping, missing, or broken UI elements at the target viewport.

#### 1.2. Reject empty and invalid login submissions with usable errors

**File:** `tests/login/login-validation.spec.ts`

**Steps:**
  1. Submit the login form with both fields empty.
    - expect: Login remains unsuccessful and a visible error message explains the required credentials.
    - expect: The error is associated with or announced to assistive technology and can be dismissed if a dismiss control is provided.
  2. Dismiss the error if possible, enter an unknown username and a non-empty password, then submit.
    - expect: Authentication is rejected with a clear error state and the user remains on the login page.
  3. Enter a valid username with an incorrect password, then submit.
    - expect: Authentication is rejected with a clear error state and the page does not reveal a protected inventory screen.

#### 1.3. Authenticate standard user and reach inventory

**File:** `tests/login/standard-user-login.spec.ts`

**Steps:**
  1. Enter standard_user and secret_sauce, then submit using the Login button.
    - expect: The user reaches /inventory.html.
    - expect: The Products heading and the authenticated header, cart control, product list, and footer are visible.
  2. Repeat login submission using Enter from the password field in a separate fresh context.
    - expect: Keyboard submission produces the same successful inventory state as clicking Login.

#### 1.4. Show locked-out user error

**File:** `tests/login/locked-out-user.spec.ts`

**Steps:**
  1. Enter locked_out_user and secret_sauce, then submit.
    - expect: The user remains on the login page and receives the expected locked-out message.
    - expect: The error is legible, does not obscure the form irrecoverably, and can be dismissed if a dismiss control is provided.

#### 1.5. Exercise supported account-specific inventory presentation

**File:** `tests/login/account-variants.spec.ts`

**Steps:**
  1. In separate fresh contexts, log in with problem_user, performance_glitch_user, error_user, and visual_user using secret_sauce.
    - expect: Each supported account reaches the expected authenticated route or displays an intentional authentication error.
    - expect: The application remains operable and UI state is observable for each account; document known account-specific image, layout, control, or latency differences rather than silently treating them as standard_user behavior.

### 2. Global Navigation, Header, and Footer

**Seed:** `tests/seed.spec.ts`

#### 2.1. Open and close the global navigation menu

**File:** `tests/navigation/menu-ui.spec.ts`

**Steps:**
  1. Log in as standard_user, then activate Open Menu.
    - expect: The navigation drawer opens and exposes All Items, Dynamic Catalog, About, Logout, Reset App State, and Close Menu.
  2. Close the drawer with Close Menu and reopen it.
    - expect: The drawer closes and reopens without shifting or obscuring the page incorrectly.
  3. With the drawer open, use Escape and keyboard navigation where supported.
    - expect: Focus remains visible and the drawer can be dismissed or navigated according to the implemented interaction model.

#### 2.2. Navigate through menu entries and reset app state

**File:** `tests/navigation/menu-actions.spec.ts`

**Steps:**
  1. Open the menu and select All Items.
    - expect: The product listing is shown and the menu's active state reflects All Items.
  2. Open Dynamic Catalog and inspect its Lazy Load, Spinner, and Slider entries; navigate to each entry in turn.
    - expect: Each entry opens its corresponding dynamic catalog experience and displays an appropriate page heading or identity.
    - expect: The menu remains usable from each destination.
  3. Return to the inventory, add an item, then open the menu and select Reset App State.
    - expect: The cart badge and product add/remove state reset to empty/default and the user remains in a usable authenticated state.
  4. Open the menu and select Logout.
    - expect: The session ends and the login page is shown; protected pages are no longer available without logging in again.

#### 2.3. Verify header cart affordance and shared footer links

**File:** `tests/navigation/shared-chrome.spec.ts`

**Steps:**
  1. Inspect the header and footer on login, inventory, product detail, cart, checkout, and completion screens.
    - expect: The Swag Labs brand/header and cart control appear where expected on authenticated screens.
    - expect: The footer displays X, Facebook, LinkedIn, and the copyright/terms/privacy text without overlap or broken layout.
  2. Activate the cart control from authenticated pages with an empty cart and with items in the cart.
    - expect: The cart page opens and the cart badge/accessible name accurately communicates the item count, including the empty state.
  3. Inspect social links and activate each link in an isolated test context if external navigation is permitted.
    - expect: Each link points to its corresponding Sauce Labs social destination and does not accidentally replace the shopping session when opened in a new tab.

### 3. Inventory and Product Catalog

**Seed:** `tests/seed.spec.ts`

#### 3.1. Render all six inventory product cards

**File:** `tests/inventory/product-cards.spec.ts`

**Steps:**
  1. Log in as standard_user and inspect the full inventory page, including the bottom of the page.
    - expect: Exactly six products are displayed: Sauce Labs Backpack, Sauce Labs Bike Light, Sauce Labs Bolt T-Shirt, Sauce Labs Fleece Jacket, Sauce Labs Onesie, and Test.allTheThings() T-Shirt (Red).
  2. Inspect every card's image, product name, description, price, and Add to cart control.
    - expect: Each card has the correct corresponding image and descriptive accessible name, readable name and description, a correctly formatted price, and a visible actionable button.
    - expect: Cards remain consistently aligned and no image is broken, stretched, or associated with the wrong product.

#### 3.2. Verify all product sort options and ordering

**File:** `tests/inventory/product-sorting.spec.ts`

**Steps:**
  1. Select Name (A to Z), Name (Z to A), Price (low to high), and Price (high to low) from Sort products, one at a time.
    - expect: The selected option is reflected in the combobox and the visible products reorder according to the selected criterion.
    - expect: Name orders are alphabetically correct; price orders are numerically correct, including products tied at $15.99.
    - expect: The sort control stays usable after changing selections and does not remove product details or action buttons.

#### 3.3. Add and remove each product from inventory

**File:** `tests/inventory/add-remove-products.spec.ts`

**Steps:**
  1. For each of the six product cards, activate Add to cart once and inspect the control and header cart badge.
    - expect: The selected card changes from Add to cart to Remove.
    - expect: The header badge increments by one and the cart contains the selected product.
  2. Activate Remove for each selected product.
    - expect: The card returns to Add to cart, the cart badge decrements, and removing the final product returns the cart badge to the empty state.

#### 3.4. Inspect inventory presentation across viewports

**File:** `tests/inventory/responsive-inventory.spec.ts`

**Steps:**
  1. Inspect inventory at desktop, tablet, and narrow mobile viewports; scroll to the final product and footer.
    - expect: All six product cards, sort control, navigation, cart control, and footer remain reachable.
    - expect: Text, prices, and buttons wrap or reflow without horizontal page overflow, overlap, clipping, or loss of interaction.

### 4. Product Detail Pages

**Seed:** `tests/seed.spec.ts`

#### 4.1. Open each product detail from both image and title

**File:** `tests/products/product-detail-pages.spec.ts`

**Steps:**
  1. For each of the six products, open its detail page by activating the product image, then repeat by activating the product name in a fresh state.
    - expect: Both image and name affordances open the matching product detail route.
    - expect: Each detail page shows the matching image, product name, description, price, Add to cart or Remove state, Back to products control, shared header, and footer.

#### 4.2. Use product detail add/remove and back navigation

**File:** `tests/products/product-detail-actions.spec.ts`

**Steps:**
  1. From a product detail page, add the product and then remove it.
    - expect: The product action changes between Add to cart and Remove, and the global cart badge stays in sync.
  2. Add an item, navigate Back to products, and return to the same detail page.
    - expect: Back to products returns to inventory and the cart selection persists across navigation until removed or reset.

### 5. Shopping Cart

**Seed:** `tests/seed.spec.ts`

#### 5.1. Verify empty cart controls and navigation

**File:** `tests/cart/empty-cart.spec.ts`

**Steps:**
  1. Open the cart with no selected products.
    - expect: The Your Cart heading and QTY and Description headings are visible with no item rows.
    - expect: Continue Shopping and Checkout controls are visible and the header indicates an empty cart.
  2. Select Continue Shopping.
    - expect: The user returns to inventory and the empty cart state remains unchanged.
  3. Open the empty cart again and select Checkout.
    - expect: The behavior is consistent and the checkout information page does not show stale cart rows.

#### 5.2. Verify cart contents, item removal, and continue shopping

**File:** `tests/cart/cart-items.spec.ts`

**Steps:**
  1. Add two different products from inventory and open the cart.
    - expect: Each selected product appears once with quantity 1, name, description, price, and an item-level Remove control.
    - expect: The header badge reflects the number of selected products.
  2. Remove one item, then select Continue Shopping.
    - expect: The removed row disappears, remaining items and badge stay accurate, and inventory opens with remaining cart state intact.

#### 5.3. Proceed from cart to checkout

**File:** `tests/cart/cart-checkout-entry.spec.ts`

**Steps:**
  1. Add one or more products and select Checkout from the cart.
    - expect: Checkout: Your Information opens and cart contents remain associated with the in-progress order.

### 6. Checkout and Order Completion

**Seed:** `tests/seed.spec.ts`

#### 6.1. Validate required checkout information fields

**File:** `tests/checkout/checkout-information-validation.spec.ts`

**Steps:**
  1. From a non-empty cart, select Checkout and submit the information form with all fields blank.
    - expect: Checkout: Your Information displays First Name, Last Name, Zip/Postal Code, Cancel, and Continue.
    - expect: Submission is blocked and a visible error identifies the first required field.
  2. Dismiss the error when available, then submit with only First Name populated; repeat with First Name and Last Name populated but Zip/Postal Code blank.
    - expect: Each submission is blocked and the error identifies the next missing required field.
    - expect: Entered values remain available after validation errors and the error can be dismissed if a dismiss control is present.
  3. Enter whitespace-only values in each field and submit.
    - expect: Whitespace-only First Name, Last Name, and Zip/Postal Code values are treated as empty and block submission with an error identifying the missing field.

#### 6.2. Cancel checkout without placing an order

**File:** `tests/checkout/checkout-cancel.spec.ts`

**Steps:**
  1. From checkout information, select Cancel.
    - expect: The user returns to the cart or documented prior shopping page without completing an order.
    - expect: No completion confirmation is shown and the cart contents are preserved.
  2. From checkout overview, select Cancel.
    - expect: The order is not completed and the user returns to shopping without losing the established cart state.

#### 6.3. Review checkout information and order totals

**File:** `tests/checkout/checkout-overview.spec.ts`

**Steps:**
  1. Enter valid first name, last name, and postal code and select Continue.
    - expect: Checkout: Overview displays each selected item, quantity, description, and price, plus payment information, shipping information, item subtotal, tax, and total.
  2. Compare totals for one product and a multi-product cart against the sum of item prices and displayed tax calculation.
    - expect: Subtotal equals the sum of cart item prices and total equals subtotal plus tax, with currency formatted consistently.
    - expect: Finish and Cancel controls are visible, correctly labeled, and operable.

#### 6.4. Complete a full successful purchase

**File:** `tests/checkout/complete-order.spec.ts`

**Steps:**
  1. Start with an empty state, log in as standard_user, add at least two products, open the cart, and begin checkout.
    - expect: Selected products and cart count remain consistent throughout the flow.
  2. Enter valid customer information, continue to overview, verify order contents and totals, then select Finish.
    - expect: Checkout: Complete! appears with the Pony Express image, thank-you heading, dispatch message, Back Home, and Generate PDF order controls.
    - expect: The cart is empty after completion and the order is not duplicated by refreshing the completion page.
  3. Select Back Home.
    - expect: The user returns to inventory with an empty cart and a usable product listing.

#### 6.5. Generate order PDF

**File:** `tests/checkout/order-pdf.spec.ts`

**Steps:**
  1. Complete a purchase and activate Generate PDF order.
    - expect: A PDF is downloaded or opened according to the browser's download behavior, contains a readable order confirmation, and does not corrupt or unexpectedly navigate away from the completion screen.

### 7. Dynamic Catalog Experiences

**Seed:** `tests/seed.spec.ts`

#### 7.1. Verify Lazy Load catalog loading and scrolling

**File:** `tests/dynamic-catalog/lazy-load.spec.ts`

**Steps:**
  1. Log in as standard_user, open the global menu, expand Dynamic Catalog, and select Lazy Load.
    - expect: The Dynamic Catalog - Lazy Load screen is shown with product imagery, names, prices, and initial Loading placeholders.
  2. Wait for loading to settle, scroll through the catalog, and continue to the bottom.
    - expect: Loading placeholders resolve into catalog content without broken images, duplicate cards, or permanently stuck indicators.
    - expect: Additional content is reachable through scrolling and page layout remains stable while content loads.

#### 7.2. Verify Spinner dynamic catalog state

**File:** `tests/dynamic-catalog/spinner.spec.ts`

**Steps:**
  1. Navigate through the menu to Dynamic Catalog > Spinner.
    - expect: The Spinner catalog experience opens with a clear page identity and its loading indicator/state is visible when loading is triggered.
  2. Wait for the loading operation to complete and observe the resulting content.
    - expect: The spinner appears only during loading, then resolves to the intended content or completion state without freezing the page or obscuring controls.

#### 7.3. Verify Slider dynamic catalog interaction

**File:** `tests/dynamic-catalog/slider.spec.ts`

**Steps:**
  1. Navigate through the menu to Dynamic Catalog > Slider.
    - expect: The Slider catalog experience opens with its page identity and visible slider control(s).
  2. Operate the slider using pointer and keyboard input, including its minimum and maximum bounds.
    - expect: The displayed selection/content responds to slider changes, bounds are respected, and the control exposes an accessible name, value, and visible focus state.

### 8. Session, Routing, and Browser Behavior

**Seed:** `tests/seed.spec.ts`

#### 8.1. Protect authenticated routes and handle direct navigation

**File:** `tests/system/authenticated-routes.spec.ts`

**Steps:**
  1. In a fresh logged-out context, navigate directly to inventory, cart, product detail, and checkout URLs.
    - expect: Protected pages redirect to login or otherwise prevent access without an authenticated session.
  2. After login, use browser Back and Forward across inventory, detail, cart, and checkout.
    - expect: Navigation shows coherent page state, cart count and selections remain consistent, and browser history does not create duplicate submissions.

#### 8.2. Verify session persistence and logout behavior

**File:** `tests/system/session-lifecycle.spec.ts`

**Steps:**
  1. Log in, add a product, reload the page, then open another authenticated route.
    - expect: The session and cart state follow the application's documented persistence behavior without visual corruption or stale controls.
  2. Log out, then use browser Back or revisit an authenticated URL.
    - expect: A logged-out user cannot interact with protected shopping UI and is returned to the login screen or shown an appropriate access state.

#### 8.3. Verify state reset is complete and repeatable

**File:** `tests/system/reset-app-state.spec.ts`

**Steps:**
  1. Change sort order, add multiple products, navigate to detail/cart, then select Reset App State from the menu.
    - expect: Cart contents, badge, and product button states reset consistently; sorting and navigation return to their documented defaults where applicable.
    - expect: Resetting a second time is safe and does not create errors or stale UI.

### 9. Responsive, Accessibility, and Visual Quality

**Seed:** `tests/seed.spec.ts`

#### 9.1. Verify keyboard and focus accessibility across primary purchase journey

**File:** `tests/accessibility/keyboard-purchase-flow.spec.ts`

**Steps:**
  1. Using only the keyboard, navigate login, inventory sort, product actions, cart, checkout fields, overview, and completion actions.
    - expect: Every interactive element is reachable in a logical order, has a visible focus indicator, and can be activated without a pointer.
    - expect: Form errors and status changes such as cart count and order completion are perceivable without relying solely on color.

#### 9.2. Verify accessible names, semantics, and image alternatives

**File:** `tests/accessibility/semantics-and-images.spec.ts`

**Steps:**
  1. Inspect accessibility tree for login, inventory, product details, cart, checkout, menu, and completion.
    - expect: Inputs and buttons have meaningful accessible names, headings and landmarks identify page structure, and errors use alert/status semantics.
    - expect: Product and Pony Express images have appropriate alternative text; decorative images are not announced as meaningful content.

#### 9.3. Check responsive layout and visual consistency across all screens

**File:** `tests/visual/responsive-all-pages.spec.ts`

**Steps:**
  1. Capture and inspect login, inventory, detail, empty/non-empty cart, checkout information, overview, completion, and dynamic catalog screens at mobile, tablet, and desktop viewport sizes.
    - expect: No content or controls are clipped, overlapping, hidden, or unreachable; page scrolling works and sticky/header/menu elements do not obscure content.
    - expect: Typography, colors, spacing, button states, card layout, error states, and product assets remain consistent with the site's design across routes and viewport changes.

#### 9.4. Check links, assets, and browser console health

**File:** `tests/visual/assets-and-console.spec.ts`

**Steps:**
  1. Visit each primary route and inspect loaded product images, brand assets, footer links, and browser console/network failures.
    - expect: All first-party UI assets load and render correctly, links have valid destinations, and no new uncaught application errors or failed first-party requests occur during standard_user flows.

### 10. Field Validation Coverage

**Seed:** `tests/seed.spec.ts`

#### 10.1. Validate username and password independently

**File:** `tests/field-validation/login-required-fields.spec.ts`

**Steps:**
  1. Leave Username empty, enter a valid password, and submit; then repeat with a valid username and an empty Password.
    - expect: Each submission is rejected on the login page and the visible error identifies the missing required field.
    - expect: The password remains masked and neither case exposes the authenticated inventory page.
  2. Submit with both fields empty, dismiss the error, and correct the missing value(s).
    - expect: The error can be dismissed without losing entered values, and valid credentials clear the error and allow login.

#### 10.2. Validate login input values and rejected credentials

**File:** `tests/field-validation/login-input-values.spec.ts`

**Steps:**
  1. Submit an unknown username, a case-changed username, and a password with an incorrect case in separate fresh attempts.
    - expect: Invalid credential values are rejected with visible feedback and do not authenticate the user.
  2. Enter leading/trailing whitespace and whitespace-only values in Username and Password in separate attempts.
    - expect: Whitespace-only required values are rejected; leading/trailing whitespace must not silently authenticate an otherwise invalid credential, and feedback remains visible.
  3. Enter a supported username and password after a rejected attempt and submit again.
    - expect: Correcting the fields allows successful login and removes any stale validation error.

#### 10.3. Validate each checkout field independently

**File:** `tests/field-validation/checkout-required-fields.spec.ts`

**Steps:**
  1. Start checkout with a non-empty cart; leave First Name blank while entering valid Last Name and Zip/Postal Code, then select Continue.
    - expect: Checkout remains on the information page and identifies First Name as required.
  2. Enter First Name, leave Last Name blank, provide Zip/Postal Code, and select Continue.
    - expect: Checkout remains on the information page and identifies Last Name as required.
  3. Enter First Name and Last Name, leave Zip/Postal Code blank, and select Continue.
    - expect: Checkout remains on the information page and identifies Zip/Postal Code as required.
  4. Enter valid non-empty values in all three fields and select Continue.
    - expect: The form advances to Checkout: Overview and no required-field error remains visible.

#### 10.4. Validate whitespace, format, and boundary values in checkout fields

**File:** `tests/field-validation/checkout-input-values.spec.ts`

**Steps:**
  1. Submit each checkout field as whitespace-only while the other two fields contain valid values.
    - expect: Whitespace-only values are treated as empty and rejected with an error identifying the affected field.
  2. Enter ordinary names containing supported punctuation or international letters and postal values in common formats, including ZIP+4; submit the form.
    - expect: Values are accepted when non-empty because the UI publishes no stricter format guidance, and they remain readable without unexpected truncation or layout breakage.
  3. Enter unusually long values in each checkout field and submit.
    - expect: The interface remains usable and does not overlap or clip; any enforced length limit gives clear feedback, while values are not silently changed without an explicit product rule.

#### 10.5. Verify validation error presentation and recovery

**File:** `tests/field-validation/error-recovery.spec.ts`

**Steps:**
  1. Trigger a login error and a checkout required-field error in separate fresh flows; inspect their visual and accessibility presentation.
    - expect: Each error is visible, readable, associated with the relevant form state, and announced through an appropriate alert or status semantic.
    - expect: Error text and dismiss controls do not cover the inputs or primary action buttons.
  2. Dismiss each error if a dismiss control is provided, correct the affected field, and resubmit.
    - expect: Dismissal removes the error presentation, values already entered are preserved, and a valid resubmission proceeds without stale errors.

### 11. User Interface Component Testing

**Seed:** `tests/seed.spec.ts`

#### 11.1. Inspect login screen components and visual states

**File:** `tests/ui/login-screen-components.spec.ts`

**Steps:**
  1. Open the login page and inspect the Swag Labs branding, login form, Username and Password fields, Login button, accepted-usernames panel, and shared-password text.
    - expect: Components are aligned, legible, visually distinct, and consistent with the page layout; input labels and button text are not clipped.
  2. Inspect default, focused, filled, and validation-error states for both inputs and the Login button.
    - expect: Focus is visible, entered text remains readable, password characters stay masked, and validation feedback does not overlap or permanently displace the form.

#### 11.2. Inspect authenticated header and navigation drawer

**File:** `tests/ui/header-and-menu-components.spec.ts`

**Steps:**
  1. Log in and inspect the Swag Labs header, Open Menu button, cart icon, and empty/non-empty cart badge states.
    - expect: Header elements are aligned and actionable, the cart count is accurate, and the badge does not obscure the cart icon or header branding.
  2. Open the menu and inspect every menu item, its active/expanded state, and Close Menu control.
    - expect: Menu text and controls are legible, keyboard focus is visible, and the open drawer does not make underlying content or the close control unusable.

#### 11.3. Inspect inventory cards, sort control, and product-action states

**File:** `tests/ui/inventory-components.spec.ts`

**Steps:**
  1. Inspect all six product cards and the Sort products control at desktop and mobile widths.
    - expect: Card images use consistent sizing, names/descriptions/prices are associated with the correct products, and cards reflow without overlap or horizontal overflow.
  2. Inspect sort-control default, focus, and selected states; change each sort option.
    - expect: The current option is visually apparent and changing the option updates ordering without breaking card alignment.
  3. Inspect Add to cart and Remove button states on multiple cards.
    - expect: Button labels and visual states change with cart state, remain readable, and do not cause card dimensions or neighboring content to jump unexpectedly.

#### 11.4. Inspect product detail and cart layouts

**File:** `tests/ui/product-detail-and-cart-components.spec.ts`

**Steps:**
  1. Open a product detail page and inspect the image, name, description, price, product action, Back to products control, header, and footer.
    - expect: Product image and text hierarchy are clear, content is not clipped, and controls remain visually associated with the correct product.
  2. Inspect both empty and populated cart views, including QTY and Description headings, item rows, item-level Remove controls, Continue Shopping, and Checkout.
    - expect: Columns and row content align consistently; the empty state has no stale rows; cart actions remain visible and usable at supported viewport sizes.

#### 11.5. Inspect checkout and order-completion components

**File:** `tests/ui/checkout-components.spec.ts`

**Steps:**
  1. Inspect Checkout: Your Information fields, Cancel and Continue buttons, and the required-field error state.
    - expect: Field labels, borders, focus states, and error presentation are visually clear and do not overlap one another.
  2. Inspect Checkout: Overview item rows, Payment Information, Shipping Information, subtotal, tax, total, Cancel, and Finish.
    - expect: Labels and amounts are easy to scan, monetary values align consistently, and the total is visually distinguishable without losing readability.
  3. Complete checkout and inspect the Pony Express image, confirmation heading/message, Back Home, and Generate PDF order controls.
    - expect: The confirmation state is visually distinct, the image renders without distortion, and both actions are visible and usable.

#### 11.6. Inspect dynamic catalog loading and interactive states

**File:** `tests/ui/dynamic-catalog-components.spec.ts`

**Steps:**
  1. Inspect Dynamic Catalog - Lazy Load during initial loading and after scrolling loads additional content.
    - expect: Loading placeholders are visually distinguishable from loaded product content, and loaded items do not overlap or shift surrounding content unexpectedly.
  2. Inspect the Spinner and Slider experiences from the Dynamic Catalog menu.
    - expect: Loading indication is visible only during the loading state; slider control, current value, and resulting content/state are visible and usable with pointer and keyboard.

#### 11.7. Verify shared footer and visual consistency

**File:** `tests/ui/footer-and-visual-consistency.spec.ts`

**Steps:**
  1. Inspect the X, Facebook, and LinkedIn links and copyright/Terms of Service/Privacy Policy text on pages where the footer is present.
    - expect: Footer text and links are legible, correctly spaced, and reachable without obscuring page content.
  2. Capture consistent screenshots of login, inventory, product detail, cart, checkout, completion, and dynamic catalog pages at agreed desktop, tablet, and mobile viewports.
    - expect: No unexpected visual regressions in alignment, spacing, typography, colors, image rendering, text wrapping, or control states; dynamic content is compared only after it reaches a stable state.

### 12. Integration Testing

**Seed:** `tests/seed.spec.ts`

#### 12.1. Verify inventory-to-cart state synchronization

**File:** `tests/integration/inventory-cart-integration.spec.ts`

**Steps:**
  1. Log in as standard_user, add products from inventory, and inspect each selected product's button state and the header cart badge.
    - expect: Product action state and cart badge update together for every add and remove operation.
  2. Open the cart and compare its rows with the products selected in inventory.
    - expect: Cart product names, descriptions, prices, and row count match the selected inventory items exactly.
  3. Change the inventory sort order, return to the cart, and remove an item there.
    - expect: Sorting does not change cart contents, and removing the item updates the cart badge and inventory button state consistently.

#### 12.2. Verify navigation preserves in-progress shopping state

**File:** `tests/integration/navigation-cart-state.spec.ts`

**Steps:**
  1. Add an item, navigate between inventory, product detail, cart, and Dynamic Catalog using the available controls, then return to the cart.
    - expect: The authenticated session and selected item remain consistent across supported internal navigation, and no duplicate item is created by visiting another route.
  2. Use Continue Shopping and Back to products from their respective screens.
    - expect: Each control returns to the expected shopping page without losing or altering the cart selection.

#### 12.3. Verify cart-to-checkout data handoff

**File:** `tests/integration/cart-checkout-data.spec.ts`

**Steps:**
  1. Add multiple distinct products, open the cart, and select Checkout.
    - expect: Checkout opens with the same in-progress cart and does not add, remove, or duplicate items.
  2. Submit incomplete checkout information, correct the missing fields, and continue to the overview.
    - expect: Validation blocks incomplete data while preserving the cart; after correction, the overview shows exactly the items selected before checkout.
  3. Cancel from checkout information and reopen checkout from the cart.
    - expect: No order is created, cart data is preserved, and the checkout flow can be restarted.

#### 12.4. Verify order review data and calculated totals

**File:** `tests/integration/checkout-totals.spec.ts`

**Steps:**
  1. Add Sauce Labs Backpack ($29.99) and proceed through checkout with valid customer information.
    - expect: Overview maps the correct product, price, payment information, and shipping information; item subtotal is $29.99, tax is $2.40, and total is $32.39.
  2. Repeat with multiple products, including products with equal prices.
    - expect: Every overview row matches the cart, item subtotal equals the sum of item prices, tax and total follow the displayed calculation, and tied-price products are not omitted or duplicated.

#### 12.5. Verify order completion updates global application state

**File:** `tests/integration/checkout-completion-state.spec.ts`

**Steps:**
  1. Complete checkout for a non-empty cart and inspect the completion screen and header cart control.
    - expect: Confirmation appears once, the cart badge is empty, and purchased items no longer show as selected after navigating Back Home.
  2. Refresh the completion page and then start a new shopping flow.
    - expect: Refresh does not submit a second order, and the next flow begins with a consistent empty cart state.

#### 12.6. Verify Reset App State across connected components

**File:** `tests/integration/reset-state-integration.spec.ts`

**Steps:**
  1. Log in, change sort order, add several products, open a detail page, and use Reset App State from the menu.
    - expect: Cart badge, cart rows, product Add/Remove controls, and relevant inventory state return to their defaults together.
  2. Navigate to the cart and inventory after reset and refresh once.
    - expect: No stale cart contents or mismatched button states return after navigation or reload.

#### 12.7. Verify authentication, logout, and protected-route integration

**File:** `tests/integration/auth-session-integration.spec.ts`

**Steps:**
  1. Submit invalid and locked-out credentials, then attempt to open an authenticated route directly.
    - expect: Failed authentication does not create an authenticated session or expose shopping data.
  2. Log in successfully, navigate to the cart, then log out and revisit an authenticated route using browser history and direct navigation.
    - expect: Logout ends access to protected shopping pages and does not restore a usable authenticated session through browser navigation.

#### 12.8. Verify checkout errors block order completion

**File:** `tests/integration/checkout-validation-flow.spec.ts`

**Steps:**
  1. Start checkout with a non-empty cart and submit incomplete customer information.
    - expect: The user remains on checkout information, an actionable validation error is shown, and the cart remains unchanged.
  2. Correct the missing field, continue through overview, and finish the order.
    - expect: The corrected flow proceeds once to completion, and the review and completion screens reflect the same cart contents.
