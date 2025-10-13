import { expect } from '@playwright/test';
import fetch from 'node-fetch';
import * as allureReporter from 'allure-js-commons';

class ResetPasswordPage {
  constructor(page) {
    this.page = page;
    this.apiKey = process.env.MANDRILL_API_KEY;
    if (!this.apiKey) throw new Error('MANDRILL_API_KEY is not set');
  }

  get emailInput() { return this.page.locator('#email'); }
  get submitBtn() { return this.page.locator('#reset-password-btn'); }
  get noticeError() { return this.page.locator('.usahello-form-error'); }
  get checkEmailTitle() { return this.page.locator('.mb-3.source-serif'); }

  async open() {
    await allureReporter.step('Open reset password page', async () => {
      await this.page.goto('/reset-password');
    });
  }

  async enterEmail(email) {
    await allureReporter.step(`Enter email: ${email}`, async () => {
      await this.emailInput.fill('');
      await this.emailInput.fill(email);
    });
  }

  async clickSubmitBtn() {
    await allureReporter.step('Click submit button', async () => {
      await this.submitBtn.click();
    });
  }

  async submitBtnClickableState() {
    return await allureReporter.step('Check the clickable state of the submit button', async () => {
      // await expect(this.submitBtn).toBeVisible();
      return await this.submitBtn.isEnabled();
    });
  }

  async verifyErrorNotice(expectedValue) {
    return await allureReporter.step('Check if the error notice appears', async () => {
      // await expect(this.noticeError).toBeVisible();
      const actualValue = await this.noticeError.textContent();
      // if (!actualValue.includes(expectedValue)) {
      //   allureReporter.error(`Expected error message "${expectedValue}", but got "${actualValue}"`);
      // }
      return actualValue;
    });
  }

  async verifySentEmailTitle(expectedValue) {
    return await allureReporter.step('Check if the title appears', async () => {
      // await expect(this.checkEmailTitle).toBeVisible();
      const actualValue = await this.checkEmailTitle.textContent();
      // Logger.info(`Actual value: "${actualValue}"`);
      // if (!actualValue.includes(expectedValue)) {
      //   Logger.error(`Expected title "${expectedValue}", but got "${actualValue}"`);
      // }
      return actualValue;
    });
  }

  async searchEmailBySubject(subject, recipient, limit = 1) {
    await allureReporter.step(`Search email by subject: "${subject}", "${recipient}"`, async () => {
      const response = await fetch('https://mandrillapp.com/api/1.0/messages/search.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: this.apiKey,
          query: `subject:"${subject}" AND to:"${recipient}"`,
          limit
        })
      });

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error(`No emails found with subject "${subject}"`);
      }

      return data[0]._id;
    });
  }

  async getEmailInfo(emailId) {
    await allureReporter.step(`Email info for ID: ${emailId}`, async () => {
      const response = await fetch('https://mandrillapp.com/api/1.0/messages/info.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: this.apiKey,
          id: emailId
        })
      });

      const data = await response.json();
      if (data.status === 'error') {
        throw new Error(`Mandrill API error: ${data.message}`);
      }

      return data;
    });
  }

  async verifyResetEmailSent(expectedEmail, subject) {
    return await allureReporter.step('Verify reset email was sent to email address', async () => {
      const emailId = await this.searchEmailBySubject(subject);
      const emailInfo = await this.getEmailInfo(emailId);

      const recipient = emailInfo.email;

      const sent = recipient === expectedEmail;

      return sent;
    });
  }
}

export { ResetPasswordPage };