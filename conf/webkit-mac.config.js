const { defineConfig, devices } = require('@playwright/test');
const commonConfig = require('./common.config');
const path = require('path')

const capabilities = commonConfig.getCapabilities(
    'pw-webkit',
    'macOS Big Sur',
    'Login Test',
    'Playwright Webkit Big Sur',
    path.basename(__filename, '.spec.js')
);

module.exports = defineConfig({
  ...commonConfig,
  testDir: './specs',
  testMatch: '**/*.spec.js',
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
