const { defineConfig, devices } = require('@playwright/test');
const commonConfig = require('./common.config');
const path = require('path');

const spec = path.basename(__filename, '.spec.js');

console.log(`Running spec: ${spec}`);

const capabilities = commonConfig.getCapabilities(
    'Chrome',
    'Windows 10',
    'Login Test',
    spec
);

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
