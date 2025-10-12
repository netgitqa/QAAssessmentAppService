import Logger from '../utils/logger';

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

  async goto() {
    await Logger.step('Navigating to login page', async () => {
      await this.page.goto('/login');
    });
  }

  async enterEmail(email) {
    await Logger.step(`Entering email: ${email}`, async () => {
      await this.page.fill(this.emailInput, email);
    });
  }

  async enterPassword(password) {
    Logger.step(`Entering password`, async () => {
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

  async refresh() {
    await Logger.step('Refreshing app state', async () => {
        await this.page.waitForTimeout(500);
        await this.page.context().clearCookies();
        await this.page.waitForTimeout(500);
        await this.page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        })
        await this.page.waitForTimeout(500);
        await this.page.reload();
    });
  }
}

module.exports = LoginPage;