const { test, expect } = require('@playwright/test');
const { WelcomePage } = require('./pages/WelcomePage');
const { UserTypeSelectionPage } = require('./pages/UserTypeSelectionPage');
const { OnboardingPage } = require('./pages/OnboardingPage');
const { DashboardPage } = require('./pages/DashboardPage');
const { TaskDetailPanel } = require('./pages/TaskDetailPanel');

test('full newcomer journey: Welcome -> Profile -> Onboarding -> Dashboard', async ({ page }) => {
  const welcome = new WelcomePage(page);
  await welcome.goto();
  await welcome.clickGetStarted();

  const userTypeSelection = new UserTypeSelectionPage(page);
  await userTypeSelection.selectUserType('work');

  const onboarding = new OnboardingPage(page);
  await onboarding.fill({
    city: 'Ottawa',
    familyStatus: 'family',
    arrivalDate: '2026-08-15',
  });
  await onboarding.submit();

  await expect(page.getByText('Welcome to Ottawa, Ontario! 🍁')).toBeVisible();
  await expect(page.getByText('Work Permit Holder Settlement Guide')).toBeVisible();

  const dashboard = new DashboardPage(page);
  const taskDetail = new TaskDetailPanel(page);

  await page.getByText('Open Bank Account', { exact: true }).click();
  await expect(taskDetail.taskHeading).toHaveText('Open Bank Account');
  await taskDetail.toggleComplete();
  await expect(taskDetail.markCompleteButton).toHaveText('✓ Completed');

  await dashboard.openLearnTab();
  await expect(page.getByRole('heading', { name: 'Learn from Real Experiences' })).toBeVisible();

  await dashboard.openNearbyTab();
  await expect(page.getByRole('heading', { name: 'Find What You Need' })).toBeVisible();

  await dashboard.openChecklistTab();
  await expect(page.getByText('1 of')).toBeVisible();
});
