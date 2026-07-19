class WelcomePage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'SettleIn' });
    this.subheading = page.getByText('Ontario Edition');
    this.getStartedButton = page.getByRole('button', { name: 'Get Started' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickGetStarted() {
    await this.getStartedButton.click();
  }
}

module.exports = { WelcomePage };
