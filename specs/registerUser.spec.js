import { test, expect } from '@playwright/test';
import * as allureReporter from 'allure-js-commons';
import { webClientInfo } from '../utils/allureUtils';

import RegisterPage from '../pageobjects/registerPage';
import LearningPage from '../pageobjects/learningPage';

const randValue = Array.from({ length: 7 }, () => 'abcdefghijklmnopqrstuvwxyz'.charAt(Math.floor(Math.random() * 26))).join('');

let EMAIL = ``;
const EMAIL_REGISTERED = process.env.EMAIL_REGISTERED;
const FAKE_EMAIL = 'fakevalue@test.com';
const PASSWORD = process.env.PASSWORD;
const SUBJECT = 'Verify your registration';

let registerPage;
let learningPage;

test.beforeEach(async ({ page }) => {
    const webClient = await webClientInfo(page);
    await allureReporter.suite(`User Registration: ${webClient}`);

    registerPage = new RegisterPage(page);
    learningPage = new LearningPage(page);
    EMAIL = `testemail${Math.floor(Math.random() * 100000)}@${randValue}.com`;

    await registerPage.openRegister();
});

test('should register user with a valid email', async ({ page }) => {
    await registerPage.enterEmailForRegistration(EMAIL);
    await registerPage.clickSignupBtn();

    const actualValue = await registerPage.getRegisterEmailTitle();
    expect(actualValue).toContain('Verify your email');

    const value = await registerPage.getActivationUrl(EMAIL, SUBJECT);
    await registerPage.openActivationUrl(value);
    await registerPage.enterPasswordForRegistration(PASSWORD);
    await registerPage.clickSetPasswordBtn();

    await learningPage.waitForTitle('My learning');
    const title = await learningPage.getTitle();
    expect(title).toContain('My learning');
});

test('should not register a user with a registered email', async ({ page }) => {
    await registerPage.enterEmailForRegistration(EMAIL_REGISTERED);
    await registerPage.clickSignupBtn();

    const expectedValue = 'You already have an account, login to your account above';
    const actualValue = await registerPage.verifyErrorNotice(expectedValue);
    expect(actualValue).toContain(expectedValue);
});

test('should not register a user with an incorrect email', async ({ page }) => {
    await registerPage.enterEmailForRegistration(FAKE_EMAIL);
    await registerPage.clickSignupBtn();

    await expect(page).toHaveURL(/register/);
});

test('should not register a user after too many attempts', async ({ page }) => {
    let attempt = 0;
    const limit = 4;

    while (attempt < limit) {
        await registerPage.openRegister();
        await registerPage.enterEmailForRegistration(EMAIL);
        await registerPage.clickSignupBtn();

        attempt++;
    }

    const expectedValue = 'Too many registration attempts. Please try again later';
    const actualValue = await registerPage.verifyErrorNotice();
    expect(actualValue).toContain(expectedValue);
});

test('should not a register user with an empty credentials', async ({ page }) => {
    await registerPage.enterEmailForRegistration('');
    await registerPage.clickSignupBtn();

    await expect(page).toHaveURL(/register/);
});