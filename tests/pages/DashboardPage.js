class DashboardPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByRole('heading', { name: 'SettleIn' });
    this.homeButton = page.getByTitle('Home');
    this.changeProfileButton = page.getByRole('button', { name: 'Change Profile' });
    this.checklistTab = page.getByRole('button', { name: '✓ Checklist' });
    this.nearbyTab = page.getByRole('button', { name: '📍 Nearby' });
    this.learnTab = page.getByRole('button', { name: '🎓 Learn' });
  }

  async goHome() {
    await this.homeButton.click();
  }

  async changeProfile() {
    await this.changeProfileButton.click();
  }

  async openChecklistTab() {
    await this.checklistTab.click();
  }

  async openNearbyTab() {
    await this.nearbyTab.click();
  }

  async openLearnTab() {
    await this.learnTab.click();
  }
}

module.exports = { DashboardPage };
