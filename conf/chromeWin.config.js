const { defineConfig, devices } = require('@playwright/test');
const commonConfig = require('./common.config');
const { getCapabilities } = commonConfig;

const chromeCapabilities = getCapabilities(
    'Chrome',
    'Windows 10',
    'Login Test',
    'Playwright Chrome Win 10'
);

module.exports = defineConfig({
  ...commonConfig,
  projects: [
    {
      name: 'Playwright Windows 10',
      use: {
        ...devices['Desktop Chrome'],
        connectOptions: {
          wsEndpoint: async ({ projectName, specFile, testInfo }) => {
            const specName = path.basename(specFile, '.js');
            const webkitCapabilities = getCapabilities(
                'Chrome',
                'Windows 10',
                'Login Test',
                'Playwright Chrome Win 10',
                specName
            );
            return `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
                JSON.stringify(webkitCapabilities)
          )}`;
          }
        },
      },
    },
  ],
});
