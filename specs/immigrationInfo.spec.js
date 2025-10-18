import { test, expect } from '@playwright/test';
import * as allureReporter from 'allure-js-commons';
import { webClientInfo } from '../utils/allureUtils';
import ImmigrationGuidePage from '../pageobjects/immigrationGuidePage';

const EMAIL = `testemail${Math.floor(Math.random() * 100000)}@replyloop.com`;
const FAKE_VALUE = 'fakevalue';

let immigrationGuidePage;

test.describe('Sign up for USAHello updates', () => {
  test.beforeEach(async ({ page }) => {
    const webClient = await webClientInfo(page);
    await allureReporter.suite(`${webClient}`);
    await allureReporter.epic(`${webClient}`);

    immigrationGuidePage = new ImmigrationGuidePage(page);
    await immigrationGuidePage.open();
  });

  test('should signup for USAHello updates with valid email', async ({ page }) => {
    await immigrationGuidePage.closeModal();
    await immigrationGuidePage.clickEmailSignupBtn();
    await immigrationGuidePage.enterEmail(EMAIL);
    await immigrationGuidePage.clickSubmitBtn();

    const actualStatus = (await immigrationGuidePage.getResponseStatus(EMAIL)).toUpperCase();
    expect(actualStatus).toContain('PENDING');
  });
});