const { defineConfig, devices } = require('@playwright/test');
const commonConfig = require('./common.config');

module.exports = defineConfig({
  ...commonConfig,
  projects: [
    {
      name: 'Chrome Windows 10',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'Chrome',
        browserVersion: 'latest',
        connectOptions: {
          wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
              JSON.stringify({
                browserName: 'Chrome',
                browserVersion: 'latest',
                'LT:Options': {
                  platform: 'Windows 10',
                  build: 'Login Test',
                  name: 'Playwright Chrome Win 10',
                  user: process.env.LT_USERNAME,
                  accessKey: process.env.LT_ACCESS_KEY,
                  network: true,
                  video: true,
                  console: true,
                },
              })
          )}`,
        },
      },
    },
  ],
});







