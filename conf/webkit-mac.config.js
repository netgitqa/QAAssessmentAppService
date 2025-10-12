const { defineConfig, devices } = require('@playwright/test');
const commonConfig = require('./common.config');
const { getCapabilities } = commonConfig;

const webkitCapabilities = getCapabilities(
    'pw-webkit',
    'macOS Big Sur',
    'Login Test',
    'Playwright Webkit Big Sur'
);

module.exports = defineConfig({
  ...commonConfig,
  projects: [
    {
      name: 'Playwright macOS Big sur',
      use: {
        ...devices['Desktop Safari'],
        connectOptions: {
          wsEndpoint: async ({ projectName, specFile, testInfo }) => {
            const specName = path.basename(specFile, '.js');
            const webkitCapabilities = getCapabilities(
                'pw-webkit',
                'macOS Big Sur',
                'Login Test',
                'Playwright Webkit Big Sur',
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
