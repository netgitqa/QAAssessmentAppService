import * as allureReporter from 'allure-js-commons';

class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = '#email';
    this.passwordInput = '#password';
    this.loginButton = 'button.g-recaptcha';
    this.separator = '.signup-separator';
    this.forgotPasswordLink = 'text=Forgot password?';
    this.errorMessages = 'p.usahello-form-error.usahello-form-validation_msg';
  }

  async open() {
    await allureReporter.step('Navigating to login page', async () => {
      await this.page.goto('/login');
    });
  }

  async enterEmail(email) {
    await allureReporter.step(`Entering email: ${email}`, async () => {
      await this.page.fill(this.emailInput, email);
    });
  }

  async enterPassword(password) {
    await allureReporter.step(`Entering password`, async () => {
      await this.page.fill(this.passwordInput, password);
    });
  }

  async submitLogin() {
    await Logger.step('Clicking login button', async () => {
      await this.page.click(this.loginButton);
    });
  }

  async clickForgotPassword() {
    await Logger.step('Clicking forgot password link', async () => {
      await this.page.click(this.forgotPasswordLink);
    });
  }

  async getErrorMessages() {
    await Logger.step('Getting error messages', async () => {
      await this.page.waitForSelector(this.errorMessages, {
        timeout: 5000,
        state: 'visible'
      });

      const errors = await this.page.$$eval(this.errorMessages, elements =>
        elements.map(el => el.textContent.trim()).join(' ')
      );
      return errors;
    });
  }
}

module.exports = LoginPage;