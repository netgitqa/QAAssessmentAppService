const path = require('path');
require('dotenv').config();
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: path.resolve(__dirname, '../specs'),
    timeout: 30000,
    retries: 0,
    reporter: [['list'], ['allure-playwright']],
    use: {
        baseURL: process.env.BASE_URL,
        headless: false,
        screenshot: 'off',
        video: 'off',
        viewport: null
    }
});
