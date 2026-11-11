import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { test as base, expect } from '@playwright/test';
import { PageManager } from '../pages/common/PageManager';
import { parseTestData, SauceDemoTestData } from '../utilities/sauceDemoTestData';

type SauceDemoFixtures = {
  pages: PageManager;
  testData: SauceDemoTestData;
};

export const test = base.extend<SauceDemoFixtures>({
  pages: async ({ page }, use) => {
    await use(new PageManager(page));
  },
  testData: async ({}, use) => {
    const dataPath = path.join(__dirname, '..', 'testdata', 'saucedemo-testdata.json');
    const contents = await readFile(dataPath, 'utf8');
    await use(parseTestData(JSON.parse(contents)));
  },
});

export { expect };