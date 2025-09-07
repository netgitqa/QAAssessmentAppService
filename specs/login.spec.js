const { test, expect } = require('@playwright/test');
const LoginPage = require('../pageobjects/loginPage');
const LearningPage = require('../pageobjects/learningPage');
require('dotenv').config();

const EMAIL = process.env.EMAIL_VALUE;
const PASSWORD = process.env.PASSWORD_VALUE;
const FAKE_EMAIL = 'fakevalue@test.com';
const FAKE_PASSWORD = 'fakevalue';

test.describe('User Authentication', () => {
    test('should log in with valid credentials', async ({ page }) => {
        const login = new LoginPage(page);
        const learning = new LearningPage(page);

        await login.goto();
        await login.login(EMAIL, PASSWORD);

        await learning.waitForTitle('My learning');
        const title = await learning.getTitle();
        expect(title).toContain('My learning');
    });

    test('should not log in with incorrect email', async ({ page }) => {
        const login = new LoginPage(page);
        await login.goto();
        await login.login(FAKE_EMAIL, PASSWORD);

        const msg = await login.getErrorMessages();
        expect(msg).toContain('This email is not in our system');
    });

    test('should not log in with incorrect password', async ({ page }) => {
        const login = new LoginPage(page);
        await login.goto();
        await login.login(EMAIL, FAKE_PASSWORD);

        const msg = await login.getErrorMessages();
        expect(msg).toContain('Either email or password are incorrect');
    });

    test('should not login with empty credentials', async ({ page }) => {
        const login = new LoginPage(page);
        await login.goto();
        await login.login('', '');

        const msg = await login.getErrorMessages();
        expect(msg).toContain('Please enter an email address');
        expect(msg).toContain('Please enter a password');
    });

    test('should redirect to reset password page after clicking the Forgot password', async ({ page }) => {
        const login = new LoginPage(page);
        await login.goto();
        await login.clickForgotPassword();
        await expect(page).toHaveURL(/reset-password/);
    });
});