import { test, expect } from '@playwright/test';
import * as allureReporter from 'allure-js-commons';
import { viewportInfo } from '../utils/allureUtils';
import LoginPage from '../pageobjects/loginPage';
import LearningPage from '../pageobjects/learningPage';
import dotenv from 'dotenv';

const EMAIL = process.env.EMAIL_VALUE;
const PASSWORD = process.env.PASSWORD_VALUE;
const FAKE_EMAIL = 'fakevalue@test.com';
const FAKE_PASSWORD = 'fakevalue';

test.describe('User Authentication', () => {
  let login;
  let learning;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    learning = new LearningPage(page);
    await login.goto();
  });

  test('should log in with valid credentials', async ({ page }) => {
    await allureReporter.epic("User Authentication");
    await allureReporter.label('suite', 'User Authentication');
    await login.enterEmail(EMAIL);
    await login.enterPassword(PASSWORD);
    await login.submitLogin();

    await learning.waitForTitle('My learning');
    const title = await learning.getTitle();
    expect(title).toContain('My learning');
  });

  test('should not log in with incorrect email', async () => {
    await allureReporter.epic("User Authentication");
    await allureReporter.label('suite', 'User Authentication');
    await login.enterEmail(FAKE_EMAIL);
    await login.enterPassword(PASSWORD);
    await login.submitLogin();

    const msg = await login.getErrorMessages();
    expect(msg).toContain('This email is not in our system');
  });

  // test('should not log in with incorrect password', async () => {
  //   await login.enterEmail(EMAIL);
  //   await login.enterPassword(FAKE_PASSWORD);
  //   await login.submitLogin();
  //
  //   const msg = await login.getErrorMessages();
  //   expect(msg).toContain('Either email or password are incorrect');
  // });
  //
  // test('should not login with empty credentials', async () => {
  //   await login.enterEmail('');
  //   await login.enterPassword('');
  //   await login.submitLogin();
  //
  //   const msg = await login.getErrorMessages();
  //   expect(msg).toContain('Please enter an email address');
  //   expect(msg).toContain('Please enter a password');
  // });
  //
  // test('should redirect to reset password page after clicking the Forgot password', async ({ page }) => {
  //   await login.clickForgotPassword();
  //   await expect(page).toHaveURL(/reset-password/);
  // });
});
