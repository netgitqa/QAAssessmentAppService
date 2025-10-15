import * as https from 'https';
import * as allureReporter from 'allure-js-commons';

class ResetPasswordPage {
  constructor(page) {
    this.page = page;
    this.apiKey = process.env.MANDRILL_API_KEY;
    if (!this.apiKey) throw new Error('MANDRILL_API_KEY was not set');
  }

  get emailInput() { return this.page.locator('#email'); }
  get passwordInput() { return this.page.locator('#password'); }
  get submitBtn() { return this.page.locator('#reset-password-btn'); }
  get setPasswordBtn() { return this.page.locator('#set-password-btn'); }
  get noticeError() { return this.page.locator('.usahello-form-error'); }
  get checkEmailTitle() { return this.page.locator('.mb-3.source-serif'); }

  async open() {
    await allureReporter.step('Open reset password page', async () => {
      await this.page.goto('/reset-password/?noRecaptcha=true');
    });
  }

  async openUrl(value) {
    await allureReporter.step('Open the link ${value}', async () => {
      await this.page.goto('about:blank');
      await this.page.goto(value);
    });
  }

  async enterEmail(value) {
    await allureReporter.step(`Enter email: ${value}`, async () => {
      await this.emailInput.fill('');
      await this.emailInput.fill(value);
    });
  }

  async enterPassword(value) {
    await allureReporter.step(`Enter password: ${value}`, async () => {
      await this.passwordInput.fill('');
      await this.passwordInput.fill(value);
    });
  }

  async clickSubmitBtn() {
    await allureReporter.step('Click submit button', async () => {
      await this.submitBtn.click();
    });
  }

  async clickSetPasswordBtn() {
    await allureReporter.step('Click set password button', async () => {
      await this.setPasswordBtn.click();
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

  async getSentEmailTitle() {
    return await allureReporter.step('Check if the title appears', async () => {
      const actualValue = await this.checkEmailTitle.textContent();

      return actualValue;
    });
  }

  async searchEmailBySubject(email, subject) {
    return await allureReporter.step(`Search email by subject: "${subject}", "${email}"`, async () => {
      const limit = 1;
      const maxRetries = 30;
      const delayMs = 5000;
      let checkpoint;
      let response;
      let attempts = 0;

      while (attempts < maxRetries) {
        attempts++;

        response = await this.apiRequest('https://mandrillapp.com/api/1.0/messages/search.json', {
          key: this.apiKey,
          query: `subject:${subject} AND email:${email}`,
          limit
        });

        console.log(response.data[0]);
        console.log(response.data[0]['@timestamp']);
        console.log(response.headers['date']);
        console.log(new Date(response.data[0]['@timestamp']).toISOString());

        const responseTimestamp = new Date(response.data[0]['@timestamp']).getTime();

        if (attempts === 1) {
          checkpoint = new Date(response.headers['date']).getTime();
          checkpoint -= 500;
        }

        console.log(`Test Now ${checkpoint}, Email ${responseTimestamp}`);

        if (checkpoint > responseTimestamp) {
          if (attempts < maxRetries) {
            await this.page.waitForTimeout(delayMs);
          }
        } else {
          return response.data[0]._id;
        }
      }

      throw new Error(`Failed to retrieve valid email after ${maxRetries} attempts.`);
    });
  }

  async getEmailInfo(emailId) {
    return await allureReporter.step(`Email info for ID: ${emailId}`, async () => {
      const response = await this.apiRequest('https://mandrillapp.com/api/1.0/messages/content', {
              key: this.apiKey,
              id: emailId
          }
      );

      console.log('Email Info Response:', response);

      if (response.status === 'error') {
        throw new Error(`Mandrill API error: ${response.message}`);
      }

      const resetPasswordLink = this.retrieveResetPasswordLink(response.html);
      return resetPasswordLink;
    });
  }

  async getResetPassword(emailValue, subjectValue) {
    return await allureReporter.step('Verify reset email was sent to email address', async () => {
      const emailId = await this.searchEmailBySubject(emailValue, subjectValue);
      const linkResetPassword = await this.getEmailInfo(emailId);

      return linkResetPassword;
    });
  }

  retrieveResetPasswordLink(htmlContent) {
    const regex = /href="(https:\/\/[^"]+)"/;
    const match = htmlContent.match(regex);

    if (match && match[1]) {
      return match[1];
    }

    throw new Error('Reset password link not found in the email HTML content');
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

            const serverDateHeader = res.headers['date'];

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);

                    resolve({
                      data: parsedData,
                      headers: res.headers,
                      serverDate: serverDateHeader
                    });
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