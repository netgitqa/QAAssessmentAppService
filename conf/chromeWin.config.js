const { defineConfig } = require('@playwright/test');
const commonConfig = require('./common.config');

const capabilities = {
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
    console: true
  }
};

module.exports = defineConfig({
  ...commonConfig,
  use: {
    ...commonConfig.use,
    connectOptions: {
      wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
          JSON.stringify(capabilities)
      )}`
    }
  }
});
