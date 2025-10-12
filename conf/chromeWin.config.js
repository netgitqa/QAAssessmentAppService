const { defineConfig, devices } = require('@playwright/test');
const commonConfig = require('./common.config');
const path = require('path')

const capabilities = commonConfig.getCapabilities(
    'Chrome',
    'Windows 10',
    'Login Test',
    'Playwright Chrome Win 10',
    path.basename(__filename, '.spec.js')
);

module.exports = defineConfig({
  ...commonConfig,
  testDir: path.resolve(__dirname, 'specs'),
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
