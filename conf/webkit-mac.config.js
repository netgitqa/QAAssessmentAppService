const { defineConfig } = require('@playwright/test');
const path = require('path');
const commonConfig = require('./common.config');

const capabilities = {
    browserName: 'pw-webkit',
    browserVersion: '18.0',
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
        storageState: path.resolve(__dirname, '../storageState.json'),
        connectOptions: {
            wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
        }
    }
});
