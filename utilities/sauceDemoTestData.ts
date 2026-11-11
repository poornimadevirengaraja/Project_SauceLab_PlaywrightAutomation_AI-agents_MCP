export interface UserCredentials {
  scenario: string;
  username: string;
  password: string;
  expectedResult: 'success' | 'locked' | 'failure';
  expectedError: string;
}

export interface CheckoutProfile {
  scenario: string;
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface NavigationMenuEntry {
  scenario: string;
  label: string;
}

export interface InventoryProduct {
  scenario: string;
  productName: string;
  imageAlt: string;
  imageSource: string;
  description: string;
  price: string;
  imageNaturalWidth: number;
  imageNaturalHeight: number;
}

export interface SauceDemoTestData {
  sharedPassword: string;
  users: UserCredentials[];
  checkoutProfiles: CheckoutProfile[];
  navigationMenuEntries: NavigationMenuEntry[];
  inventoryProducts: InventoryProduct[];
}

export function parseTestData(value: unknown): SauceDemoTestData {
  if (!value || typeof value !== 'object') {
    throw new Error('SauceDemo test data must be a JSON object. Run npm run testdata:build.');
  }

  const data = value as Partial<SauceDemoTestData>;
  if (
    !data.sharedPassword ||
    !Array.isArray(data.users) ||
    !Array.isArray(data.checkoutProfiles) ||
    !Array.isArray(data.navigationMenuEntries) ||
    !Array.isArray(data.inventoryProducts)
  ) {
    throw new Error('SauceDemo test data is incomplete. Run npm run testdata:build.');
  }

  return data as SauceDemoTestData;
}