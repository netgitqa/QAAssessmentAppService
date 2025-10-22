import { test, expect } from '@playwright/test';
import * as allureReporter from 'allure-js-commons';
import { webClientInfo } from '../utils/allureUtils';
import ResetPasswordPage from '../pageobjects/resetPasswordPage';
import LearningPage from '../pageobjects/learningPage';

const EMAIL = process.env.EMAIL_RESET;
const EMAIL_LIMIT = process.env.EMAIL_LIMIT;
const FAKE_EMAIL = 'fakevalue@test.com';
const PASSWORD = `Test${Math.floor(Math.random() * 100000)}`;
const SUBJECT = 'Reset your password';
const incorrectEmailNotice = 'No account found with this email';

let resetPasswordPage;
let learningPage;

test.beforeEach(async ({ page }) => {
  const webClient = await webClientInfo(page);
  await allureReporter.suite(`Reset Password: ${webClient}`);
  await allureReporter.epic(`${webClient}`);
  await allureReporter.feature('Reset Password');

  resetPasswordPage = new ResetPasswordPage(page);
  learningPage = new LearningPage(page);
  await resetPasswordPage.open();
});

test('should allow the user to reset a password', async ({ page }) => {
  await resetPasswordPage.enterEmail(EMAIL);
  await resetPasswordPage.clickSubmitBtn();

  const actualValue = await resetPasswordPage.getSentEmailTitle();
  expect(actualValue).toContain('Check your email');

  const value = await resetPasswordPage.getResetPassword(EMAIL, SUBJECT);
  await resetPasswordPage.openUrl(value);
  await resetPasswordPage.enterPassword(PASSWORD);
  await resetPasswordPage.clickSetPasswordBtn();

  await learningPage.waitForTitle('My learning');
  const title = await learningPage.getTitle();
  expect(title).toContain('My learning');
});

test('should show error message with incorrect email', async ({ page }) => {
  await resetPasswordPage.enterEmail(FAKE_EMAIL);
  await resetPasswordPage.clickSubmitBtn();

  const actualError = await resetPasswordPage.verifyErrorNotice();
  expect(actualError).toContain('No account found with this email');
});

test('should not enable submit button with an empty email field', async ({ page }) => {
  const clickableState = await resetPasswordPage.submitBtnClickableState();
  expect(clickableState).toBe(false);
});