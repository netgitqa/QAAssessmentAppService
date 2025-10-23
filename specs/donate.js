import { test, expect } from '@playwright/test';
import * as allureReporter from 'allure-js-commons';
import { webClientInfo } from '../utils/allureUtils';

import DonatePage from '../pageobjects/donatePage';
import learningPage from "../pageobjects/immigrationGuidePage";

const EMAIL = process.env.EMAIL_REGISTERED;
const PASSWORD = process.env.PASSWORD;
const FAKE_EMAIL = 'fakevalue@test.com';
const FAKE_PASSWORD = 'fakevalue';

let donatePage;

test.beforeEach(async ({ page }) => {
    const webClient = await webClientInfo(page);
    await allureReporter.suite(`Donation: ${webClient}`);

    donatePage = new DonatePage(page);
    await donatePage.openDonate();
});

test('should complete donation', async ({ page }) => {
    await donatePage.closeModal();
    await donatePage.enterDonationAmount('1000');
    await donatePage.clickPayByCreditCardBtn();
    await donatePage.enterCardholderName('Tester Test');
    await donatePage.enterEmail('testchecktestn123@replyloop.com');
    await donatePage.enterCardValues();
    await donatePage.enterState('BestState');
    await donatePage.enterPostal('10000');
    await donatePage.selectConsent();
    await donatePage.clickCompleteDonationBtn();
});