import { test, expect } from '@playwright/test';
import * as allureReporter from 'allure-js-commons';

import { webClientInfo } from '../utils/allureUtils';

import ResetPasswordPage from '../pageobjects/resetPasswordPage';
import LearningPage from '../pageobjects/learningPage';

const EMAIL = process.env.EMAIL_RESET;
const FAKE_EMAIL = 'fakevalue@test.com';
const PASSWORD = `Test${Math.floor(Math.random() * 100000)}`;
const SUBJECT = 'Reset your password';

let resetPasswordPage;

test.describe('Reset Password', () => {
  test.beforeEach(async ({ page }) => {
    const webClient = await webClientInfo(page);
    await allureReporter.suite(`${webClient}`);
    await allureReporter.epic(`${webClient}`);

    resetPasswordPage = new ResetPasswordPage(page);
  });

  test('should allow the user to reset a password', async ({ page }) => {
    await resetPasswordPage.open();
    await resetPasswordPage.enterEmail(EMAIL);
    await resetPasswordPage.clickSubmitBtn();

    const actualValue = await resetPasswordPage.getSentEmailTitle();
    expect(actualValue).toContain('Check your email');

    const linkResetPass = await resetPasswordPage.linkFromEmail(EMAIL, SUBJECT);
    await resetPasswordPage.openUrl(linkResetPass);
    await resetPasswordPage.enterPassword(PASSWORD);
    await resetPasswordPage.clickSetPasswordBtn();

    const learning = new LearningPage(page);
    await learning.waitForTitle('My learning');
    const title = await learning.getTitle();
    expect(title).toContain('My learning');
  });

  test('should show error message with incorrect email', async ({ page }) => {
    await resetPasswordPage.open();
    await resetPasswordPage.enterEmail(FAKE_EMAIL);
    await resetPasswordPage.clickSubmitBtn();

    const expectedError = 'No account found with this email';
    const actualError = await resetPasswordPage.verifyErrorNotice(expectedError);
    expect(actualError).toContain(expectedError);
  });

  test('should not enable submit button with an empty email field', async ({ page }) => {
    await resetPasswordPage.open();

    const clickableState = await resetPasswordPage.submitBtnClickableState();
    expect(clickableState).toBe(false);
  });
});