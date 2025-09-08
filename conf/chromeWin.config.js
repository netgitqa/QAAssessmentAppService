const path = require('path');
require('dotenv').config();
const { defineConfig } = require('@playwright/test');

const capabilities = {
  browserName: 'Chrome',
  browserVersion: 'latest',
  'LT:Options': {
    platform: 'Windows 10',
    build: 'Playwright Chrome Win 10',
    name: 'Login Test',
    user: process.env.LT_USERNAME,
    accessKey: process.env.LT_ACCESS_KEY,
    network: true,
    video: true,
    console: true
  }
};



module.exports = defineConfig({
  testDir: path.resolve(__dirname, '../specs'),
  timeout: 30 * 1000,
  retries: 1,
  reporter: [['list'], ['allure-playwright']],
  use: {
    baseURL: process.env.BASE_URL,
    headless: false,
    screenshot: 'off',
    video: 'off',
    viewport: null,
    connectOptions: {
      wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
        JSON.stringify(capabilities)
      )}`
    }
  }
});
