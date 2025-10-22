import * as allureReporter from 'allure-js-commons';

class RegisterPage{
  constructor(page) {
    this.page = page;
    this.apiKey = process.env.MANDRILL_API_KEY;
  }

  get emailInput() { return this.page.locator('#email'); }
  get passwordInput() { return this.page.locator('#password'); }
  get signupBtn() { return this.page.locator('button.g-recaptcha'); }
  get emailTitle() { return this.page.locator('.mb-3.source-serif'); }
  get setPasswordBtn() { return this.page.locator('#set-password-btn'); }
  get noticeError() { return this.page.locator('.usahello-form-error'); }

  async openRegister() {
    await allureReporter.step('Open register page', async () => {
      await this.page.goto('about:blank');
      await this.page.goto(`${process.env.CLASSROOM_URL}/register`);
    });
  }

  async openActivationUrl(value) {
    await allureReporter.step('Open the link ${value}', async () => {
      await this.page.goto('about:blank');
      await this.page.goto(value);
    });
  }

  async enterEmailForRegistration(email) {
    await allureReporter.step(`Enter email: ${email}`, async () => {
      await this.emailInput.fill(email);
    });
  }

    async enterPasswordForRegistration(value) {
        await allureReporter.step(`Enter password: ${value}`, async () => {
            await this.passwordInput.fill(value);
        });
    }

    async clickSignupBtn() {
        await allureReporter.step('Click login button', async () => {
            await this.signupBtn.click();
        });
    }

    async clickSetPasswordBtn() {
        await allureReporter.step('Click set password button', async () => {
            await this.setPasswordBtn.click();
        });
    }

    async verifyErrorNotice() {
        return await allureReporter.step('Check if the error notice appears', async () => {
            return await this.noticeError.textContent();
        });
    }

    async getRegisterEmailTitle() {
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

module.exports = RegisterPage;