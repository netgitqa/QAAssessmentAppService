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

    async login(email, password) {
        Logger.step(`Entering credentials: ${email} / ${password ? '******' : ''}`);
        await this.page.fill(this.emailInput, email);
        await this.page.fill(this.passwordInput, password);

        if (await this.page.isVisible(this.separator)) {
            Logger.step('Clicking separator to hide keyboard');
            await this.page.click(this.separator);
        }

        Logger.step('Clicking login button');
        await this.page.click(this.loginButton);
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
