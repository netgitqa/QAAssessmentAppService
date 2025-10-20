import * as allureReporter from 'allure-js-commons';

class ResetPasswordPage {
  constructor(page) {
    this.page = page;
    this.apiKey = process.env.MANDRILL_API_KEY;
  }

  get emailInput() { return this.page.locator('#email'); }
  get passwordInput() { return this.page.locator('#password'); }
  get submitBtn() { return this.page.locator('#reset-password-btn'); }
  get setPasswordBtn() { return this.page.locator('#set-password-btn'); }
  get noticeError() { return this.page.locator('.usahello-form-error'); }
  get checkEmailTitle() { return this.page.locator('.mb-3.source-serif'); }

  async open() {
    await allureReporter.step('Open reset password page', async () => {
      await this.page.goto('about:blank');
      await this.page.goto(`${process.env.CLASSROOM_URL}/reset-password`);
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

  async verifyErrorNotice() {
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
      const maxRetries = 100;
      const delayMs = 1000;
      let requestTs;
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

        const responseTs = new Date(res[0]['@timestamp']).getTime();
        if (attempts === 1) {
          requestTs = new Date(response.headers.get('Date')).getTime();
          requestTs -= 10000;
        }

        if (requestTs > responseTs) {
          if (attempts < maxRetries) {
            await this.page.waitForTimeout(delayMs);
          }
        } else {
          return res[0]._id;
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
      console.log('Response Check', raw);

      const res = JSON.parse(raw);
      console.log('Response html:', res);

      const resetPasswordLink = this.retrieveResetPasswordLink(res.html);

      if (resetPasswordLink) {
        return resetPasswordLink;
      }

      throw new Error(`No emails found with subject ${emailId}`);
    });
  }

  async getResetPassword(emailValue, subjectValue) {
    return await allureReporter.step('Verify reset email was sent to email address', async () => {
      const emailId = await this.searchEmailBySubject(emailValue, subjectValue);
      await this.page.waitForTimeout(3000);
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
}

module.exports = ResetPasswordPage;