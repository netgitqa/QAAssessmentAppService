import * as https from 'https';
import * as allureReporter from 'allure-js-commons';
import * as md5 from 'md5';
import { createHash } from 'crypto';

class ImmigrationGuidePage {
  constructor(page) {
    this.page = page;
    this.apiKey = process.env.MAILCHIMP_API_KEY;
  }

  get modalCloseBtn() { return this.page.locator('.modal-dialog .btn-close'); }
  get title() { return this.page.locator('title'); }
  get introSection() { return this.page.locator('.updates-signup-pane-intro'); }
  get emailSignupBtn() { return this.page.locator('button[data-target="updates-signup-pane-email"]'); }
  get textSignupBtn() { return this.page.locator('button[data-target="updates-signup-pane-text"]'); }
  get returnToSignupBtn() { return this.page.locator('.updates-signup-pane-email .signup-btn[data-target="updates-signup-pane-intro"]'); }
  get emailInput() { return this.page.locator('#input_3_1'); }
  get emailSubmitBtn() { return this.page.locator('#gform_submit_button_3'); }
  get btnShowResources() { return this.page.locator('a.immigration-guide-more-btn'); }
  get emailConfirmationMessage() { return this.page.locator('#hello-imguide-top-confirmation-msg'); }

  async open() {
    await allureReporter.step('Open Immigration Guide page', async () => {
      await this.page.goto(`/safety`);
    });
  }

  async getTitleText() {
    await allureReporter.step('Fetch the page title', async () => {
      const title = await this.page.title();
    return title;
    });
  }

  async waitForTitle(expected) {
    await allureReporter.step(`Wait for the page title to be "${expected}"`, async () => {
      await this.page.waitForFunction(
        (expectedTitle) => document.title.includes(expectedTitle),
        expected
      );
    });
  }

  async returnToUSAHelloUpdates() {
    await allureReporter.step('Navigate to Sign up for USAHello updates section', async () => {
      await this.returnToSignupBtn.click();
    });
  }

  async clickEmailSignupBtn() {
    await allureReporter.step('Click Email Signup button', async () => {
      await this.introSection.scrollIntoViewIfNeeded();
      await this.emailSignupBtn.click();
    });
  }

  async enterEmail(email) {
    await allureReporter.step(`Enter email: ${email}`, async () => {
      await this.emailInput.waitFor({ state: 'visible' });
      await this.emailInput.fill(email);
    });
  }

  async clickSubmitBtn(email) {
    await allureReporter.step('Click Submit button', async () => {
      await this.emailSubmitBtn.click();
    });
  }

  async getEmailConfirmationMessage() {
    await allureReporter.step('Wait for email confirmation message', async () => {
      await this.btnShowResources.scrollIntoViewIfNeeded();
      await this.emailConfirmationMessage.waitFor({ state: 'visible', timeout: 3000 });
      return this.emailConfirmationMessage.innerText();
    });
  }

  async closeModal() {
    await allureReporter.step('Close modal', async () => {
      await this.modalCloseBtn.nth(0).isVisible({ timeout: 10000 });
      await this.modalCloseBtn.nth(0).click();
    });
  }

  async fetchMailchimpListId() {
    return await allureReporter.step('Fetch lists from Mailchimp API', async () => {
      const response = await this.apiRequest(
        'https://us1.api.mailchimp.com/3.0/lists',
        this.apiKey
      );

      if (response?.lists?.length > 0) {
        console.log(response.lists[0].id);
        return response.lists[0].id;
      }
      throw new Error('No lists available in the Mailchimp API response');
    });
  }

  async getResponseStatus(email) {
    return await allureReporter.step('Check member pending status', async () => {
      const emailHashed = createHash('md5').update(email).digest('hex');
      const listId = await this.fetchMailchimpListId();

      const maxRetries = 100;
      const delayMs = 1000;
      let response;
      let attempts = 0;

      while (attempts < maxRetries) {
        attempts++;

        response = await this.apiRequest(
          `https://us1.api.mailchimp.com/3.0/lists/${listId}/members/${emailHashed}`,
          this.apiKey
        );

        if (response?.status) {
          return response.status;
        }

        if (attempts < maxRetries) {
          await this.page.waitForTimeout(delayMs);
        }
      }

      throw new Error(`Failed to retrieve status after ${maxRetries} attempts.`);
    });
  }

  async apiRequest(url, apiKey) {
    const options = {
      hostname: 'us1.api.mailchimp.com',
      path: new URL(url).pathname,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            resolve(parsedData);
          } catch (error) {
            reject(new Error(`Error parsing response: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Error making API request: ${error.message}`));
      });

      req.end();
    });
  }
}

module.exports = ImmigrationGuidePage;