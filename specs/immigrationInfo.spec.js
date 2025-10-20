import { test, expect } from '@playwright/test';
import * as allureReporter from 'allure-js-commons';
import { webClientInfo } from '../utils/allureUtils';
import ImmigrationGuidePage from '../pageobjects/immigrationGuidePage';

const EMAIL = `testemail${Math.floor(Math.random() * 100000)}@replyloop.com`;
const FAKE_VALUE = 'fakevalue';

let immigrationGuidePage;

test.beforeEach(async ({ page }) => {
  const webClient = await webClientInfo(page);
  await allureReporter.suite(`Sign up for USAHello updates: ${webClient}`);
  await allureReporter.epic(`${webClient}`);
  await allureReporter.feature('Sign up for USAHello updates');

  immigrationGuidePage = new ImmigrationGuidePage(page);
  await immigrationGuidePage.open();
});

test('should signup for USAHello updates with valid email', async ({ page }) => {
  await immigrationGuidePage.closeModal();
  await immigrationGuidePage.clickEmailSignupBtn();
  await immigrationGuidePage.enterEmail(EMAIL);
  await immigrationGuidePage.clickSubmitBtn();

  const actualValue = await immigrationGuidePage.getEmailConfirmationMessage();
  expect(actualValue).toContain('Check your email to confirm your subscription');

  const actualStatus = await immigrationGuidePage.getPendingStatus(EMAIL);
  expect(String(actualStatus).toUpperCase()).toContain('PENDING');
});