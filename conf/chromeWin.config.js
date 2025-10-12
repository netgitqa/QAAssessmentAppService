const { defineConfig, devices } = require('@playwright/test');
const commonConfig = require('./common.config');
const path = require('path')

const specName = path.basename(process.argv[2], '.spec.js');

const capabilities = commonConfig.getCapabilities(
    'Chrome',
    'Windows 10',
    'Login Test',
    'Playwright Chrome Win 10',
    specName
);

capabilities['specsPath'] = path.resolve(__dirname, '../specs');

module.exports = defineConfig({
  ...commonConfig,
  projects: [
    {
      name: 'Playwright Windows 10',
      use: {
        ...devices['Desktop Chrome'],
        connectOptions: {
          wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
              JSON.stringify(capabilities)
          )}`,
        },
      },
    },
  ],
});
