const { defineConfig, devices } = require('@playwright/test');
const commonConfig = require('./common.config');
const path = require('path');

const getSpecName = () => {
  const aFile = test.info().file;
  const specName = path.basename(aFile, '.spec.js');
  return specName;
}

const specName = getSpecName();

const capabilities = commonConfig.getCapabilities(
    'Chrome',
    'Windows 10',
    'Login Test',
    specName
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
