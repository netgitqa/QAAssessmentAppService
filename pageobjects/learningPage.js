import * as allureReporter from 'allure-js-commons';

class LearningPage {
  constructor(page) {
    this.page = page;
  }

  async getTitle() {
    return allureReporter.step('Getting page title', async () => {
      return await this.page.title();
    });
  }

  async waitForTitle(expected) {
    await allureReporter.step(`Waiting for page title to contain "${expected}"`, async () => {
      await this.page.waitForFunction(
        title => document.title.includes(title), expected, { timeout: 15000 }
      );

      await this.page.waitForTimeout(3000);
    });
  }
}

module.exports = LearningPage;