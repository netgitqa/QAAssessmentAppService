import * as https from 'https';
import * as allureReporter from 'allure-js-commons';

class ImmigrationGuidePage {
  constructor(page) {
    this.page = page;
    this.apiKey = process.env.MANDRILL_API_KEY;
    if (!this.apiKey) throw new Error('MANDRILL_API_KEY was not set');
  }

  get modalCloseBtn() { return this.page.locator('.modal-dialog .btn-close'); }
  get title() { return this.page.locator('title'); }
  get introSection() { return this.page.locator('.updates-signup-pane-intro'); }
  get emailSignupBtn() { return this.page.locator('button[data-target="updates-signup-pane-email"]'); }
  get textSignupBtn() { return this.page.locator('button[data-target="updates-signup-pane-text"]'); }
  get returnToSignupBtn() { return this.page.locator('.updates-signup-pane-email .signup-btn[data-target="updates-signup-pane-intro"]'); }
  get emailInput() { return this.page.locator('#input_3_1'); }
  get emailSubmitBtn() { return this.page.locator('#gform_submit_button_3'); }
  get btnShowResources() { return this.page.locator('a.immigration-guide-more-btn'); }
  get emailConfirmationMessage() { return this.page.locator('#hello-imguide-top-confirmation-msg'); }

  async open() {
    await allureReporter.step('Open Immigration Guide page', async () => {
      await this.page.goto('about:blank');
      await this.page.goto(`${process.env.BASE_URL_USAHello}/safety`);

      const userAgent = await this.page.evaluate(() => navigator.userAgent);
      const userAgentTag = userAgentInfo(userAgent);

      Logger.addTag(userAgentTag);
    });
  }

  async getTitleText() {
    await allureReporter.step('Fetch the page title', async () => {
      const title = await this.page.title();
    return title;
    });
  }

  async waitForTitle(expected) {
    await allureReporter.step(`Wait for the page title to be "${expected}"`, async () => {
      await this.page.waitForFunction(
        (expectedTitle) => document.title.includes(expectedTitle),
        expected
      );
    });
  }

  async returnToUSAHelloUpdates() {
    await allureReporter.step('Navigate to Sign up for USAHello updates section', async () => {
      await this.returnToSignupBtn.click();
    });
  }

  async clickEmailSignupBtn() {
    await allureReporter.step('Click Email Signup button', async () => {
      await this.introSection.scrollIntoViewIfNeeded();
      await this.emailSignupBtn.click();
    });
  }

  async enterEmail(email) {
    await allureReporter.step(`Enter email: ${email}`, async () => {
      await this.emailInput.waitFor({ state: 'visible' });
      await this.emailInput.fill(email);
    });
  }

  async clickSubmitBtn(email) {
    await allureReporter.step('Click Submit button', async () => {
      await this.emailSubmitBtn.click();
    });
  }

  async getEmailConfirmationMessage() {
    await allureReporter.step('Wait for email confirmation message', async () => {
      await this.btnShowResources.scrollIntoViewIfNeeded();
      await this.emailConfirmationMessage.waitFor({ state: 'visible', timeout: 3000 });
      return this.emailConfirmationMessage.innerText();
    });
  }

  async closeModal() {
    await allureReporter.step('Close modal', async () => {
      const modalDisplayed = await this.modalCloseBtn.isVisible({ timeout: 10000 });
      if (modalDisplayed) {
        await this.modalCloseBtn.click();
      Logger.info('The modal closed successfully');
      } else {
        Logger.info('The modal was not displayed');
      }
    });
  }
}

module.exports = ImmigrationGuidePage;