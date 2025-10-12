const { defineConfig, devices } = require('@playwright/test');
const commonConfig = require('./common.config');
const path = require('path')

const capabilities = commonConfig.getCapabilities(
    'Chrome',
    'Windows 10',
    'Login Test',
    'Playwright Chrome Win 10',
    path.basename(__filename, '.config.js')
);

module.exports = defineConfig({
  ...commonConfig,
  projects: [
    {
      name: 'Playwright Windows 10',
      use: {
        ...devices['Desktop Chrome']
      },
      beforeAll: async ({ browser, context, page }) => {
        const wsEndpoint = `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
            JSON.stringify(capabilities)
        )}`;
        await browser.newContext({
          connectOptions: {
            wsEndpoint
          },
        });
      },
    },
  ],
});
