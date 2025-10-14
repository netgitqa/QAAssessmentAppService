import { test, expect } from '@playwright/test';
import * as allureReporter from 'allure-js-commons';

import { webClientInfo } from '../utils/allureUtils';

import ResetPasswordPage from '../pageobjects/resetPasswordPage';

const EMAIL = process.env.EMAIL_VALUE;
const FAKE_EMAIL = 'fakevalue@test.com';
const SUBJECT = 'Reset your password';

test.describe('Reset Password', () => {
  test.beforeEach(async ({ page }) => {
    const webClient = await webClientInfo(page);
    await allureReporter.suite(`${webClient}`);
    await allureReporter.epic(`${webClient}`);
  });

  test('should allow the user to send a password reset email to a recipient', async ({ page }) => {
    const resetPasswordPage = new ResetPasswordPage(page);
    await resetPasswordPage.open();
    await resetPasswordPage.enterEmail(EMAIL);
    await resetPasswordPage.clickSubmitBtn();

    await page.waitForTimeout(10000);

    const actualValue = await resetPasswordPage.verifySentEmailTitle('Check your email');
    expect(actualValue).toContain('Check your email');

    const emailSent = await resetPasswordPage.verifyResetEmailSent(EMAIL, SUBJECT);
    // expect(emailSent).toBe(true);
  });

  test('should show error message with incorrect email', async ({ page }) => {
    const resetPasswordPage = new ResetPasswordPage(page);
    await resetPasswordPage.open();
    await resetPasswordPage.enterEmail(FAKE_EMAIL);
    await resetPasswordPage.clickSubmitBtn();

    const expectedError = 'No account found with this email';
    const actualError = await resetPasswordPage.verifyErrorNotice(expectedError);
    expect(actualError).toContain(expectedError);
  });

  test('should not enable submit button with an empty email field', async ({ page }) => {
    const resetPasswordPage = new ResetPasswordPage(page);
    await resetPasswordPage.open();

    const clickableState = await resetPasswordPage.submitBtnClickableState();
    expect(clickableState).toBe(false);
  });
});