class NearbyPlacesPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Find What You Need' });
    this.enableLocationButton = page.getByRole('button', { name: 'Enable Location' });
    this.locationEnabledBanner = page.getByText('Location enabled • Showing places near you');
    this.loadingIndicator = page.getByText('Finding places near you...');
  }

  categoryButton(label) {
    return this.page.getByRole('button', { name: label });
  }

  async enableLocation() {
    await this.enableLocationButton.click();
  }

  async searchCategory(label) {
    await this.categoryButton(label).click();
  }
}

module.exports = { NearbyPlacesPage };
