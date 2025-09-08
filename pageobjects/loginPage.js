const Logger = require('../utils/logger');

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
        Logger.step('Navigating to login page');
        await this.page.goto('/login');
    }

    async enterEmail(email) {
        Logger.step(`Entering email: ${email}`);
        await this.page.fill(this.emailInput, email);
    }

    async enterPassword(password) {
        Logger.step(`Entering password`);
        await this.page.fill(this.passwordInput, password);
    }

    async clickForgotPassword() {
        Logger.step('Clicking forgot password link');
        await this.page.click(this.forgotPasswordLink);
    }

    async getErrorMessages() {
        Logger.step('Getting error messages');
        await this.page.waitForSelector(this.errorMessages, {
            timeout: 5000,
            state: 'visible'
        });
    
        const errors = await this.page.$$eval(this.errorMessages, elements =>
            elements.map(el => el.textContent.trim()).join(' ')
        );
        return errors;
    }
}

module.exports = LoginPage;
