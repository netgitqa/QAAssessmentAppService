const { defineConfig, devices } = require('@playwright/test');
const commonConfig = require('./common.config');
const path = require('path');
const fs = require('fs');

const getSpecName = () => {
  const stack = new Error().stack;
  const match = stack && stack.match(/\/specs\/([^\/]+)\.spec\.js/);
  return match ? match[1] : 'unknown-spec';
};

const specName = getSpecName();
const capabilities = commonConfig.getCapabilities(
    'pw-webkit',
    'macOS Big Sur',
    'Login Test',
    'Playwright Webkit Big Sur',
    specName
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
