require('dotenv').config();
const { defineConfig } = require('@playwright/test');

const capabilities = {
  browserName: 'Chrome',
  browserVersion: 'latest',
  'LT:Options': {
    platform: 'Windows 10',
    build: 'Chrome Build',
    name: 'Chrome Login Test',
    user: process.env.LT_USERNAME,
    accessKey: process.env.LT_ACCESS_KEY,
    network: true,
    video: true,
    console: true
  }
};

module.exports = defineConfig({
  testDir: './specs',
  timeout: 30 * 1000,
  retries: 1,
  reporter: [['list'], ['allure-playwright']],
  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    connectOptions: {
      wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
        JSON.stringify(capabilities)
      )}`
    }
  }
});
