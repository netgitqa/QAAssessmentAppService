import { test, expect } from '@playwright/test';
import * as allureReporter from 'allure-js-commons';
import { webClientInfo } from '../utils/allureUtils';
import DonatePage from '../pageobjects/donatePage';

const randValue = Array.from({ length: 7 }, () => 'abcdefghijklmnopqrstuvwxyz'.charAt(Math.floor(Math.random() * 26))).join('');

const SUBJECT = 'Thank you for your donation';

const cardholderName = 'TestDonate Playwright';
const cardNumber = '4242 4242 4242 4242';
const exp = '12/30';
const cvc = '123';
const donationAmount = '1000';
const expectedDonationNotice = 'Thank you for your support. Your donation receipt has been sent to the email address provided.';

let donatePage;
let EMAIL = ``;

test.beforeEach(async ({ page }) => {
    EMAIL = `testemail${Math.floor(Math.random() * 100000)}@${randValue}.com`;
    const webClient = await webClientInfo(page);
    await allureReporter.suite(`Donation: ${webClient}`);

    donatePage = new DonatePage(page);
    await donatePage.openDonate();
});

test('should complete donation with custom amount and send email', async () => {
  await donatePage.closeDonateModal();
  await donatePage.enterDonationAmount(donationAmount);
  await donatePage.clickPayByCreditCardBtn();
  await donatePage.enterCardholderName(cardholderName);
  await donatePage.enterDonationEmail(EMAIL);
  await donatePage.enterCardValues(cardNumber, exp, cvc);
  await donatePage.clickEnterBillingAddressBtn();
  await donatePage.enterContributorState('PlaywrightState');
  await donatePage.enterContributorPostal('10000');
  await donatePage.selectConsent();
  await donatePage.clickCompleteDonationBtn();

  const actual = await donatePage.getDonationNotice();
  expect(actual).toContain(expectedDonationNotice);

  const values = await donatePage.getContributorNameAndAmount(EMAIL, SUBJECT);
  expect(values.name).toBe(cardholderName);
  expect(values.amount).toBe(donationAmount);
});