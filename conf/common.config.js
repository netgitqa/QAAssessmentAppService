const { defineConfig } = require('@playwright/test');
const path = require('path');
require('dotenv').config();

const commonCapabilities = {
    network: true,
    video: true,
    console: true,
};

const getCapabilities = (browserName, browserVersion, platform, buildName, testName, specName) => {
    process.env.RUN_CONTEXT = `${platform} ${browserName} ${browserVersion}`;

    return {
        browserName,
        'LT:Options': {
            ...commonCapabilities,
            platform,
            build: buildName,
            name: `${specName}`,
            user: process.env.LT_USERNAME,
            accessKey: process.env.LT_ACCESS_KEY,
        },
    };
};

module.exports = defineConfig({
    testDir: path.resolve(__dirname, '../specs'),
    timeout: 150000,
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
