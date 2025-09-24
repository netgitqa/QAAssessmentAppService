const { defineConfig } = require('@playwright/test');
const commonConfig = require('./common.config');

const playwrightVersion = '1.50';

const capabilities = {
  browserName: 'pw-webkit',
  browserVersion: 'latest',
  'LT:Options': {
    platform: 'macOS Big sur',
    build: 'Login Test',
    name: 'Playwright Webkit Big sur',
    user: process.env.LT_USERNAME,
    accessKey: process.env.LT_ACCESS_KEY,
    network: true,
    video: true,
    console: true,
    
  }
};

module.exports = defineConfig({
  ...commonConfig,
  use: {
    ...commonConfig.use,
    launchOptions: {
      headless: true,
      args: [
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding'
      ],
    },
    connectOptions: {
      wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
        JSON.stringify(capabilities)
      )}`
    }
  }
});
