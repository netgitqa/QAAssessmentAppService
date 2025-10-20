const { defineConfig, devices } = require('@playwright/test');
const commonConfig = require('./common.config');
const path = require('path');

const capabilities = commonConfig.getCapabilities(
    'pw-webkit',
    'latest',
    'macOS Big Sur',
    'Login Test',
    'Playwright Webkit Big Sur',
    path.basename(__filename, '.config.js')
);

module.exports = defineConfig({
  ...commonConfig,
  projects: [
    {
      name: 'Playwright macOS Big sur',
      use: {
        ...devices['Desktop Safari'],
        connectOptions: {
          wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
              JSON.stringify(capabilities)
          )}`,
        },
      },
    },
  ],
});