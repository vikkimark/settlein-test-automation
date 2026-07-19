const { test, expect } = require('@playwright/test');
const { WelcomePage } = require('./pages/WelcomePage');
const { UserTypeSelectionPage } = require('./pages/UserTypeSelectionPage');
const { OnboardingPage } = require('./pages/OnboardingPage');

async function startOnboarding(page, userType = 'student') {
  const welcome = new WelcomePage(page);
  await welcome.goto();
  await welcome.clickGetStarted();

  const userTypeSelection = new UserTypeSelectionPage(page);
  await userTypeSelection.selectUserType(userType);

  return new OnboardingPage(page);
}

test.describe('Onboarding screen', () => {
  test('shows the university field only for students', async ({ page }) => {
    const onboarding = await startOnboarding(page, 'student');
    await expect(onboarding.universityInput).toBeVisible();
  });

  test('hides the university field for non-students', async ({ page }) => {
    const onboarding = await startOnboarding(page, 'work');
    await expect(onboarding.universityInput).toBeHidden();
  });

  test('blocks submission and alerts when required fields are missing', async ({ page }) => {
    const onboarding = await startOnboarding(page);

    let dialogMessage = '';
    page.once('dialog', async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    await onboarding.submit();

    expect(dialogMessage).toContain('Please fill in all required fields');
    await expect(onboarding.heading).toBeVisible();
  });

  test('completes onboarding and reaches the dashboard when all required fields are filled', async ({ page }) => {
    const onboarding = await startOnboarding(page);

    await onboarding.fill({
      city: 'Waterloo',
      familyStatus: 'spouse',
      arrivalDate: '2026-09-01',
    });
    await onboarding.submit();

    await expect(page.getByText('Welcome to Waterloo, Ontario! 🍁')).toBeVisible();
    await expect(page.getByText('International Student Settlement Guide')).toBeVisible();
  });
});
