const Logger = require('../utils/logger');

class LearningPage {
    constructor(page) {
        this.page = page;
    }

    async getTitle() {
        Logger.step('Getting page title');
        return await this.page.title();
    }

    async waitForTitle(expected) {
        Logger.step(`Waiting for page title to contain "${expected}"`);
        await this.page.waitForFunction(
            title => document.title.includes(title),
            expected,
            { timeout: 15000 }
        );

        
        await this.page.waitForTimeout(3000);
    }
}

module.exports = LearningPage;
