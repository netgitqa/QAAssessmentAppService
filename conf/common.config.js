const { defineConfig } = require('@playwright/test');
const path = require('path');
require('dotenv').config();

const commonCapabilities = {
    network: true,
    video: true,
    console: true,
};

const getCapabilities = (browserName, platform, buildName, testName, specName) => ({
    browserName,
    browserVersion: 'latest',
    'LT:Options': {
        ...commonCapabilities,
        platform,
        build: buildName,
        name: `${testName} - ${specName}`,
        user: process.env.LT_USERNAME,
        accessKey: process.env.LT_ACCESS_KEY,
    },
});

module.exports = defineConfig({
    testDir: path.resolve(__dirname, '../specs'),
    testMatch: ['**/*.spec.js'],
    timeout: 30000,
    retries: 0,
    reporter: [['list'], ['allure-playwright']],
    use: {
        baseURL: process.env.BASE_URL,
        headless: false,
        screenshot: 'off',
        video: 'off',
        viewport: null,
        args: ['--start-maximized']
    },
    getCapabilities,
});
