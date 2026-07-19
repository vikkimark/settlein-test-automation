const { WelcomePage } = require('../pages/WelcomePage');
const { UserTypeSelectionPage } = require('../pages/UserTypeSelectionPage');
const { OnboardingPage } = require('../pages/OnboardingPage');

const DEFAULT_PROFILE = {
  userType: 'student',
  city: 'Toronto',
  familyStatus: 'solo',
  arrivalDate: '2026-09-01',
};

/**
 * Drives Welcome -> UserTypeSelection -> Onboarding to land on the Dashboard.
 */
async function onboardUser(page, overrides = {}) {
  const profile = { ...DEFAULT_PROFILE, ...overrides };

  const welcome = new WelcomePage(page);
  await welcome.goto();
  await welcome.clickGetStarted();

  const userTypeSelection = new UserTypeSelectionPage(page);
  await userTypeSelection.selectUserType(profile.userType);

  const onboarding = new OnboardingPage(page);
  await onboarding.fill(profile);
  await onboarding.submit();

  return profile;
}

module.exports = { onboardUser, DEFAULT_PROFILE };
