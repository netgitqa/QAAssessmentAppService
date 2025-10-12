const { defineConfig, devices } = require('@playwright/test');
const commonConfig = require('./common.config');
const path = require('path')

const specName = path.basename(process.argv[2], '.spec.js');

const capabilities = commonConfig.getCapabilities(
    'pw-webkit',
    'macOS Big Sur',
    'Login Test',
    'Playwright Webkit Big Sur',
    specName
);

capabilities['specsPath'] = path.resolve(__dirname, '../specs');

module.exports = defineConfig({
  ...commonConfig,
  testDir: path.resolve(__dirname, 'specs'),
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
