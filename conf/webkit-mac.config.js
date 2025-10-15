const { defineConfig, devices } = require('@playwright/test');
const commonConfig = require('./common.config');
const path = require('path');

const capabilities = commonConfig.getCapabilities(
    'pw-webkit',
    'macOS Big Sur',
    'Login Test'
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

beforeAll: async () => {
  const spec = path.basename(process.argv[2], '.js');
  capabilities['LT:Options'].name = spec;
  console.log(`Test run name set to: ${spec}`);
}