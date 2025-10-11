const { defineConfig, devices } = require('@playwright/test');
const commonConfig = require('./common.conf');

module.exports = defineConfig({
  ...commonConfig,
  projects: [
    {
      name: 'WebKit macOS Big Sur',
      use: {
        ...devices['Desktop Safari'],
        browserName: 'pw-webkit',
        browserVersion: '18.0',
        connectOptions: {
          wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
              JSON.stringify({
                browserName: 'pw-webkit',
                browserVersion: '18.0',
                'LT:Options': {
                  platform: 'macOS Big Sur',
                  build: 'Login Test',
                  name: 'Playwright WebKit Big Sur',
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
