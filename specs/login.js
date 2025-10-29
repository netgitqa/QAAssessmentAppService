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

test.beforeEach(async ({ page }) => {
  const webClient = await webClientInfo(page);
  await allureReporter.suite(`User Authentication: ${webClient}`);

  loginPage = new LoginPage(page);
  learningPage = new LearningPage(page);
  await loginPage.openLogin();
});

test('should log in with valid credentials', async ({ page }) => {
  await loginPage.enterEmailForLogin(EMAIL);
  await loginPage.enterPasswordForLogin(PASSWORD);
  await loginPage.clickLoginBtn();

  await learningPage.waitForTitle('My learning');
  const title = await learningPage.getTitle();
  expect(title).toContain('My learning');
});

test('should not log in with incorrect email', async ({ page }) => {
  await loginPage.enterEmailForLogin(FAKE_EMAIL);
  await loginPage.enterPasswordForLogin(PASSWORD);
  await loginPage.clickLoginBtn();

  const actual = await loginPage.getLoginErrorNotice();
  expect(actual).toContain('This email is not in our system');
});

test('should not log in with incorrect password', async ({ page }) => {
  await loginPage.enterEmailForLogin(EMAIL);
  await loginPage.enterPasswordForLogin(FAKE_PASSWORD);
  await loginPage.clickLoginBtn();

  const actual = await loginPage.getLoginErrorNotice();
  expect(actual).toContain('Either email or password are incorrect');
});

test('should not login with empty credentials', async ({ page }) => {
  await loginPage.enterEmailForLogin('');
  await loginPage.enterPasswordForLogin('');
  await loginPage.clickLoginBtn();

  await expect(page).toHaveURL(/login/);
});

test('should redirect to reset password page after clicking the Forgot password', async ({ page }) => {
  await loginPage.clickForgotPassword();
  
});