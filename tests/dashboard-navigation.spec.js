const { test, expect } = require('@playwright/test');
const { onboardUser } = require('./helpers/onboard');
const { DashboardPage } = require('./pages/DashboardPage');

test.describe('Dashboard - header navigation', () => {
  test('Home resets progress and returns to the Welcome screen', async ({ page }) => {
    await onboardUser(page, { userType: 'student' });

    await page.getByText('Get SIN Number', { exact: true }).click();
    await page.getByRole('button', { name: 'Mark Complete' }).click();

    const dashboard = new DashboardPage(page);
    await dashboard.goHome();

    await expect(page.getByRole('heading', { name: 'SettleIn' })).toBeVisible();
    await expect(page.getByText('Ontario Edition')).toBeVisible();

    // Progress resets: re-onboarding shows 0 completed instead of resuming.
    await page.getByRole('button', { name: 'Get Started' }).click();
    await page.getByRole('button', { name: 'International Student' }).click();
    await page.getByPlaceholder('e.g., Toronto, Ottawa, Waterloo').fill('Toronto');
    await page.locator('select').selectOption('solo');
    await page.locator('input[type="date"]').fill('2026-09-01');
    await page.getByRole('button', { name: 'Create My Checklist' }).click();

    await expect(page.getByText('0 of')).toBeVisible();
  });

  test('Change Profile asks for confirmation before resetting', async ({ page }) => {
    await onboardUser(page);
    const dashboard = new DashboardPage(page);

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Change your profile?');
      await dialog.dismiss();
    });
    await dashboard.changeProfile();

    // Dismissed: still on the dashboard.
    await expect(page.getByRole('button', { name: '✓ Checklist' })).toBeVisible();

    page.once('dialog', (dialog) => dialog.accept());
    await dashboard.changeProfile();

    await expect(page.getByRole('heading', { name: 'Welcome to Ontario!' })).toBeVisible();
  });

  test('switching between Checklist, Nearby, and Learn tabs updates content', async ({ page }) => {
    await onboardUser(page);
    const dashboard = new DashboardPage(page);

    await dashboard.openNearbyTab();
    await expect(page.getByRole('heading', { name: 'Find What You Need' })).toBeVisible();

    await dashboard.openLearnTab();
    await expect(page.getByRole('heading', { name: 'Learn from Real Experiences' })).toBeVisible();

    await dashboard.openChecklistTab();
    await expect(page.getByText('Settlement Progress')).toBeVisible();
  });
});
