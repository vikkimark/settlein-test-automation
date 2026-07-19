class OnboardingPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Almost there!' });
    this.cityInput = page.getByPlaceholder('e.g., Toronto, Ottawa, Waterloo');
    this.universityInput = page.getByPlaceholder('e.g., University of Toronto');
    this.familyStatusSelect = page.locator('select');
    this.arrivalDateInput = page.locator('input[type="date"]');
    this.submitButton = page.getByRole('button', { name: 'Create My Checklist' });
  }

  async fill({ city, familyStatus, arrivalDate, university }) {
    if (city !== undefined) await this.cityInput.fill(city);
    if (university !== undefined) await this.universityInput.fill(university);
    if (familyStatus !== undefined) await this.familyStatusSelect.selectOption(familyStatus);
    if (arrivalDate !== undefined) await this.arrivalDateInput.fill(arrivalDate);
  }

  async submit() {
    await this.submitButton.click();
  }
}

module.exports = { OnboardingPage };
