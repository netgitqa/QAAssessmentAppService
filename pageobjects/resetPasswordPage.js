import * as https from 'https';
import * as allureReporter from 'allure-js-commons';

class ResetPasswordPage {
  constructor(page) {
    this.page = page;
    this.apiKey = process.env.MANDRILL_API_KEY;
    if (!this.apiKey) throw new Error('MANDRILL_API_KEY was not set');
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
      return await this.submitBtn.isEnabled();
    });
  }

  async verifyErrorNotice(expectedValue) {
    return await allureReporter.step('Check if the error notice appears', async () => {
      const actualValue = await this.noticeError.textContent();

      return actualValue;
    });
  }

  async verifySentEmailTitle(expectedValue) {
    return await allureReporter.step('Check if the title appears', async () => {
      const actualValue = await this.checkEmailTitle.textContent();

      return actualValue;
    });
  }

  async searchEmailBySubject(email, subject, limit = 1) {
    await allureReporter.step(`Search email by subject: "${subject}", "${email}"`, async () => {
      const response = await this.apiRequest('https://mandrillapp.com/api/1.0/messages/search.json', {
        key: this.apiKey,
        query: `subject:${subject} AND email:${email}`,
        limit
      });

      console.log(response[0]);

      if (!Array.isArray(response) || response.length === 0) {
        throw new Error(`No emails found with subject "${subject}"`);
      }

      return response[0]._id;
    });
  }

  async getEmailInfo(emailId) {
    await allureReporter.step(`Email info for ID: ${emailId}`, async () => {
      const response = await this.apiRequest('https://mandrillapp.com/api/1.0/messages/info.json', {
          key: this.apiKey,
          id: emailId
        }
      );

      if (response.status === 'error') {
        throw new Error(`Mandrill API error: ${data.message}`);
      }

      return response;
    });
  }

  async verifyResetEmailSent(emailValue, subjectValue) {
    return await allureReporter.step('Verify reset email was sent to email address', async () => {
      const emailId = await this.searchEmailBySubject(emailValue, subjectValue);
      const emailInfo = await this.getEmailInfo(emailId);

      const recipient = emailInfo.email;

      const sent = recipient === emailValue;

      return sent;
    });
  }

  async apiRequest(url, body) {
    const postData = JSON.stringify(body);

    const options = {
        hostname: 'mandrillapp.com',
        port: 443,
        path: new URL(url).pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
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

        req.write(postData);
        req.end();
    });
  }
}

module.exports = ResetPasswordPage;