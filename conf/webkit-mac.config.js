const { defineConfig, devices } = require('@playwright/test');
const commonConfig = require('./common.config');
const path = require('path');

const spec = path.basename(__filename, '.spec.js');

console.log(`Running spec: ${spec}`);

const capabilities = commonConfig.getCapabilities(
    'pw-webkit',
    'macOS Big Sur',
    'Login Test',
    spec
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
