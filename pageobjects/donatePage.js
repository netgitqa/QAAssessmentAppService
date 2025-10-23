import * as allureReporter from 'allure-js-commons';

class DonatePage{
  constructor(page) {
    this.page = page;
    this.apiKey = process.env.MANDRILL_API_KEY;
  }

  get donationAmount() { return this.page.locator('#hello-donation-amount'); }
  get monthly_gift0() { return this.page.locator('label[for="monthly_gift-0"]'); }
  get monthly_gift1() { return this.page.locator('label[for="monthly_gift-1"]'); }
  get btn10() { return this.page.locator('#amt1'); }
  get btn25() { return this.page.locator('#amt2'); }
  get btn50() { return this.page.locator('#amt3'); }
  get btn100() { return this.page.locator('#amt4'); }
  get payBtn() { return this.page.locator('#hello-pay-by-card'); }
  get billingName() { return this.page.locator('#billing_name'); }
  get emailInput() { return this.page.locator('#donor_email'); }
  get enterBillingAddressBtn() { return this.page.locator('#enter-cc-info'); }
  get addressState() { return this.page.locator('#address_state'); }
  get addressPostal() { return this.page.locator('#address_zip'); }
  get consentCheck() { return this.page.locator('label[for="donation_consent"]'); }
  get completeDonationBtn() { return this.page.locator('#mc-embedded-subscribe'); }
  get modalCloseBtn() { return this.page.locator('.modal-dialog .btn-close'); }

  async openDonate() {
    await allureReporter.step('Open donate page', async () => {
      await this.page.goto('/donate/?noRecaptcha=true');
    });
  }

  async enterDonationAmount(value) {
    await allureReporter.step(`Enter donation amount: $ ${value}`, async () => {
      await this.donationAmount.fill(value);
    });
  }

  async selectMonthlyOption() {
    await allureReporter.step(`Select monthly option`, async () => {
      await this.monthly_gift1.click();
    });
  }

  async select$10() {
    await allureReporter.step(`Select $10`, async () => {
      await this.btn10.click();
    });
  }

  async select$25() {
    await allureReporter.step(`Select $25`, async () => {
      await this.btn25.click();
    });
  }

  async select$50() {
    await allureReporter.step(`Select $50`, async () => {
      await this.btn50.click();
    });
  }

  async select$100() {
    await allureReporter.step(`Select $100`, async () => {
      await this.btn100.click();
    });
  }

  async clickPayByCreditCardBtn() {
    await allureReporter.step('Click pay by credit card', async () => {
      await this.payBtn.click();
      await this.page.waitForTimeout(10000);
    });
  }

  async enterCardholderName(value) {
    await allureReporter.step(`Enter cardholder name: ${value}`, async () => {
      await this.billingName.fill(value);
    });
  }

  async enterEmail(email) {
    await allureReporter.step(`Enter email: ${email}`, async () => {
      await this.emailInput.fill(email);
    });
  }

  async enterCardValues() {
    await allureReporter.step('Fill in card details', async () => {
      const cardNumberFrame = await this.page.frameLocator('iframe[name^="__privateStripeFrame"]').first();
      await cardNumberFrame.locator('input[name="cardnumber"]').fill('4242424242424242');
      const expFrame = this.page.frameLocator('iframe[name^="__privateStripeFrame"]').nth(1);
      await expFrame.locator('input[name="exp-date"]').fill('12/30');
      const cvcFrame = this.page.frameLocator('iframe[name^="__privateStripeFrame"]').nth(2);
      await cvcFrame.locator('input[name="cvc"]').fill('123');
    });
  }

  async clickEnterBillingAddressBtn() {
    await allureReporter.step('Click enter billing address button', async () => {
      await this.enterBillingAddressBtn.click();
    });
  }

  async enterState(value) {
    await allureReporter.step('Enter billing address state', async () => {
      await this.addressState.fill(value);
    });
  }

  async enterPostal(value) {
    await allureReporter.step('Enter billing address postal', async () => {
      await this.addressPostal.fill(value);
    });
  }

  async selectConsent() {
    await allureReporter.step('Select consent option', async () => {
      await this.consentCheck.click();
    });
  }

  async clickCompleteDonationBtn() {
    await allureReporter.step('Click complete donationBtn button', async () => {
      await this.completeDonationBtn.click();

      await this.page.waitForTimeout(10000);
    });
  }

  async closeModal() {
    await allureReporter.step('Close modal', async () => {
      await this.modalCloseBtn.nth(0).isVisible({ timeout: 10000 });
      await this.modalCloseBtn.nth(0).click();
    });
  }

    async getRegisterErrorNotice() {
        return await allureReporter.step('Check if the error notice appears', async () => {
            return await this.noticeError.textContent();
        });
    }

    async getRegisterTitle() {
        return await allureReporter.step('Check if the title appears', async () => {
            const actualValue = await this.emailTitle.textContent();

            return actualValue;
        });
    }

    async searchEmailBySubject(email, subject) {
        return await allureReporter.step(`Search email by subject: "${subject}", "${email}"`, async () => {
            const limit = 1;
            const maxRetries = 100;
            const delayMs = 1000;
            let response;
            let attempts = 0;

            while (attempts < maxRetries) {
                attempts++;

                response = await fetch('https://mandrillapp.com/api/1.0/messages/search.json', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        key: this.apiKey,
                        query: `subject:"${subject}" AND email:"${email}"`,
                        limit
                    })
                });

                const res = await response.json();

                if (res?.length > 0) {
                    return res[0]._id;
                }

                if (attempts < maxRetries) {
                    await this.page.waitForTimeout(delayMs);
                }
            }

            throw new Error(`Failed to retrieve valid email with subject ${subject} after ${maxRetries} attempts`);
        });
    }

    async getEmailInfo(emailId) {
        return await allureReporter.step(`Email info for ID: ${emailId}`, async () => {
            const response = await fetch('https://mandrillapp.com/api/1.0/messages/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: this.apiKey,
                    id: emailId
                })
            });

            const raw = await response.text();
            const res = JSON.parse(raw);
            const activationLink = this.retrieveActivationLink(res.html);

            if (activationLink) {
                return activationLink;
            }

            throw new Error(`No emails found with subject ${emailId}`);
        });
    }

    async getActivationUrl(email, subject) {
        return await allureReporter.step('Verify reset email was sent to email address', async () => {
            const emailId = await this.searchEmailBySubject(email, subject);
            await this.page.waitForTimeout(3000);
            return await this.getEmailInfo(emailId);
        });
    }

    retrieveActivationLink(htmlContent) {
        const regex = /href="(https:\/\/[^"]+)"/;
        const match = htmlContent.match(regex);

        if (match && match[1]) {
            return match[1];
        }

        throw new Error('Reset password link not found in the email HTML content');
    }
}

module.exports = DonatePage;