import * as allureReporter from 'allure-js-commons';

class LoginPage {
  constructor(page) {
    this.page = page;
    this.errorNotices = 'p.usahello-form-error.usahello-form-validation_msg';
  }

  get emailInput() { return this.page.locator('#email'); }
  get passwordInput() { return this.page.locator('#password'); }
  get loginButton() { return this.page.locator('button.g-recaptcha'); }
  get forgotPasswordLink() { return this.page.locator('text=Forgot password?'); }
  get noticeError() { return this.page.locator('.usahello-form-error'); }

  async openLogin() {
    await allureReporter.step('Open login page', async () => {
      await this.page.goto('about:blank');
      await this.page.goto(`${process.env.CLASSROOM_URL}/login`);
    });
  }

  async enterEmailForLogin(email) {
    await allureReporter.step(`Enter email: ${email}`, async () => {
      await this.emailInput.fill(email);
    });
  }

  async enterPasswordForLogin(password) {
    await allureReporter.step(`Enter password`, async () => {
      await this.passwordInput.fill(password);
    });
  }

  async clickLoginBtn() {
    await allureReporter.step('Click login button', async () => {
      await this.loginButton.click();
    });
  }

  async clickForgotPassword() {
    await allureReporter.step('Click forgot password link', async () => {
      await this.forgotPasswordLink.click();
    });
  }

  async getLoginErrorNotice() {
    return allureReporter.step('Fetch the error notice', async () => {
      await this.page.waitForSelector(this.errorNotices, {
        timeout: 10000,
        state: 'visible'
      });

      return await this.page.$$eval(this.errorNotices, elements =>
        elements.map(el => el.textContent.trim()).join(' ')
      );
    });
  }
}

module.exports = LoginPage;