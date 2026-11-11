# Project_SauceLab_PlaywrightAutomation_AIagents

This is a Playwright Automation framework of a sample Project "sauce lab" using playwright Typescript and Javascript using Playwright Test AI Agents
🎭 planner explores the app and produces a Markdown test plan
🎭 generator transforms the Markdown plan into the Playwright Test files
🎭 healer executes the test suite and automatically repairs failing tests

## Framework Layout

`fixtures/`, `pages/`, `testdata/`, `utilities/`, and `tests/` are top-level siblings. SauceDemo page objects are grouped by page under `pages/saucelab/`; `pages/common/` contains `BasePage` and `PageManager`. Tests should import `test` and `expect` from `fixtures/sauceDemoFixture.ts` to receive the shared page manager and Excel-backed `testData` fixture.

The Excel workbook is `testdata/saucedemo-testdata.xlsx`. Its worksheets are converted to JSON-shaped records by `utilities/excelToJson.ts` and validated/typed by `utilities/sauceDemoTestData.ts`.

Run `npm test` for the suite or `npm run typecheck` to validate TypeScript.
Run `npm run test:reports` to execute the suite and generate both reports: `playwright-report/index.html` and `allure-report/index.html`. To regenerate the Allure report from existing results, run `npm run allure:generate`.
