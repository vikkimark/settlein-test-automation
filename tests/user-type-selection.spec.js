const { test, expect } = require('@playwright/test');
const { WelcomePage } = require('./pages/WelcomePage');
const { UserTypeSelectionPage, USER_TYPE_LABELS } = require('./pages/UserTypeSelectionPage');

test.describe('User type selection screen', () => {
  test.beforeEach(async ({ page }) => {
    const welcome = new WelcomePage(page);
    await welcome.goto();
    await welcome.clickGetStarted();
  });

  test('lists all newcomer profile options', async ({ page }) => {
    const userTypeSelection = new UserTypeSelectionPage(page);
    await expect(userTypeSelection.heading).toBeVisible();

    for (const label of Object.values(USER_TYPE_LABELS)) {
      await expect(page.getByRole('button', { name: label })).toBeVisible();
    }
  });

  for (const [userType, label] of Object.entries(USER_TYPE_LABELS)) {
    test(`selecting "${label}" proceeds to onboarding`, async ({ page }) => {
      const userTypeSelection = new UserTypeSelectionPage(page);
      await userTypeSelection.selectUserType(userType);

      await expect(page.getByRole('heading', { name: 'Almost there!' })).toBeVisible();
    });
  }
});
