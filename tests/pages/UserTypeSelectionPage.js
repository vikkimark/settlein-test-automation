const USER_TYPE_LABELS = {
  student: 'International Student',
  work: 'Work Permit Holder',
  pr: 'Permanent Resident',
  citizen: 'New Citizen',
  traveler: 'Visitor/Traveler',
};

class UserTypeSelectionPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Welcome to Ontario!' });
  }

  optionButton(userType) {
    return this.page.getByRole('button', { name: USER_TYPE_LABELS[userType] });
  }

  async selectUserType(userType) {
    await this.optionButton(userType).click();
  }
}

module.exports = { UserTypeSelectionPage, USER_TYPE_LABELS };
