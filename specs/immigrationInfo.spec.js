import { test, expect } from '@playwright/test';
import * as allureReporter from 'allure-js-commons';
import { webClientInfo } from '../utils/allureUtils';
import ImmigrationGuidePage from '../pageobjects/immigrationGuidePage';

let EMAIL = ``;
const randValue = Array.from({ length: 7 }, () => 'abcdefghijklmnopqrstuvwxyz'.charAt(Math.floor(Math.random() * 26))).join('');
const FAKE_VALUE = 'fakevalue';

let immigrationGuidePage;

test.beforeEach(async ({ page }) => {
  EMAIL = `testemail${Math.floor(Math.random() * 100000)}@${randValue}.com`;
  const webClient = await webClientInfo(page);
  await allureReporter.suite(`Sign up for USAHello updates: ${webClient}`);

  immigrationGuidePage = new ImmigrationGuidePage(page);
  await immigrationGuidePage.openImmigrationGuide();
});

test('should signup for USAHello updates with valid email', async ({ page }) => {
  await immigrationGuidePage.closeModal();
  await immigrationGuidePage.clickImmigrationEmailSignupBtn();
  await immigrationGuidePage.enterImmigrationEmailForRegistration(EMAIL);
  await immigrationGuidePage.clickSubmitBtn();

  const actual = await immigrationGuidePage.getConfirmationSubscriptionTitle();
  expect(actual).toContain('Check your email to confirm your subscription');

  const status = await immigrationGuidePage.getUserStatus(EMAIL);
  expect(String(status).toUpperCase()).toContain('PENDING');
});