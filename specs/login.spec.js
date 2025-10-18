import { test, expect } from '@playwright/test';

import * as allureReporter from 'allure-js-commons';

import { webClientInfo } from '../utils/allureUtils';

import LoginPage from '../pageobjects/loginPage';
import LearningPage from '../pageobjects/learningPage';

const EMAIL = process.env.EMAIL_REGISTERED;
const PASSWORD = process.env.PASSWORD;
const FAKE_EMAIL = 'fakevalue@test.com';
const FAKE_PASSWORD = 'fakevalue';

let loginPage;
let learningPage;

test.describe('User Authentication', () => {
  test.beforeEach(async ({ page }) => {
    const webClient = await webClientInfo(page);
    await allureReporter.suite(`${webClient}`);
    await allureReporter.epic(`${webClient}`);

    loginPage = new LoginPage(page);
    learningPage = new LearningPage(page);
    await loginPage.open();
  });

  test('should log in with valid credentials', async ({ page }) => {
    await loginPage.enterEmail(EMAIL);
    await loginPage.enterPassword(PASSWORD);
    // await loginPage.submitLogin();
    //
    // await learning.waitForTitle('My learning');
    // const title = await learning.getTitle();
    // expect(title).toContain('My learning');
  });

  // test('should not log in with incorrect email', async ({ page }) => {
  //   await loginPage.enterEmail(FAKE_EMAIL);
  //   await loginPage.enterPassword(PASSWORD);
  //   await loginPage.submitLogin();
  //
  //   const msg = await login.getErrorMessages();
  //   expect(msg).toContain('This email is not in our system');
  // });
  //
  // test('should not log in with incorrect password', async ({ page }) => {
  //   await loginPage.enterEmail(EMAIL);
  //   await loginPage.enterPassword(FAKE_PASSWORD);
  //   await loginPage.submitLogin();
  //
  //   const msg = await login.getErrorMessages();
  //   expect(msg).toContain('Either email or password are incorrect');
  // });
  //
  // test('should not login with empty credentials', async ({ page }) => {
  //   await loginPage.enterEmail('');
  //   await loginPage.enterPassword('');
  //   await loginPage.submitLogin();
  //
  //   await expect(page).toHaveURL(/login/);
  // });
  //
  // test('should redirect to reset password page after clicking the Forgot password', async ({ page }) => {
  //   await loginPage.clickForgotPassword();
  //   await expect(page).toHaveURL(/reset-password/);
  // });
});