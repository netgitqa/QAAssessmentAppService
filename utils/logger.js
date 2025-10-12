import * as allure from 'allure-js-commons';

class Logger {
    static async step(message) {
        allure.step(message, async () => {
            await action();
        });
        console.log(`STEP: ${message}`);
    }

    static info(message) {
        allure.step(`INFO: ${message}`, async () => {});
        console.log(`INFO: ${message}`);
    }

    static warn(message) {
        allure.step(`WARN: ${message}`, async () => {});
        console.warn(`WARN: ${message}`);
    }

    static error(message) {
        allure.step(`ERROR: ${message}`, async () => {});
        console.error(`ERROR: ${message}`);
    }
}

module.exports = Logger;