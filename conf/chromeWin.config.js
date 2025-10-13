const { defineConfig, devices } = require('@playwright/test');
const commonConfig = require('./common.config');
const path = require('path');
const fs = require('fs');

const getSpecName = () => {
  const stack = new Error().stack;
  const match = stack && stack.match(/\/specs\/([^\/]+)\.spec\.js/);
  return match ? match[1] : 'unknown-spec';
};

const capabilities = commonConfig.getCapabilities(
    'Chrome',
    'Windows 10',
    'Login Test',
    'Playwright Chrome Win 10',
    getSpecName()
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
