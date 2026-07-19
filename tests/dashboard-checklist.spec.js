const { test, expect } = require('@playwright/test');
const { onboardUser } = require('./helpers/onboard');
const { TaskDetailPanel } = require('./pages/TaskDetailPanel');

test.describe('Dashboard - Checklist tab', () => {
  test('shows tasks relevant to the selected profile and hides irrelevant ones', async ({ page }) => {
    await onboardUser(page, { userType: 'student' });

    await expect(page.getByText('Get SIN Number')).toBeVisible();
    await expect(page.getByText('Find Student Housing')).toBeVisible();
    await expect(page.getByText('Validate Work Permit at Border')).not.toBeVisible();
    await expect(page.getByText('Purchase Visitor Health Insurance')).not.toBeVisible();
  });

  test('filters differently for a traveler profile', async ({ page }) => {
    await onboardUser(page, { userType: 'traveler', familyStatus: 'solo' });

    await expect(page.getByText('Purchase Visitor Health Insurance')).toBeVisible();
    await expect(page.getByText('Get Tourist/Prepaid SIM Card')).toBeVisible();
    await expect(page.getByText('Get SIN Number')).not.toBeVisible();
  });

  test('shows an empty state in the detail panel until a task is selected', async ({ page, isMobile }) => {
    // The split-screen detail panel is intentionally hidden below the `lg` breakpoint (TaskDetail.js).
    test.skip(isMobile, 'Detail panel is hidden on mobile viewports by design');

    await onboardUser(page);
    const taskDetail = new TaskDetailPanel(page);

    await expect(taskDetail.emptyStateHeading).toBeVisible();
  });

  test('selecting a task shows its details in the detail panel', async ({ page }) => {
    await onboardUser(page, { userType: 'student' });
    const taskDetail = new TaskDetailPanel(page);

    await page.getByText('Get SIN Number', { exact: true }).click();

    await expect(taskDetail.taskHeading).toHaveText('Get SIN Number');
    await expect(taskDetail.documentsHeading).toBeVisible();
    await expect(taskDetail.timelineHeading).toBeVisible();
    await expect(taskDetail.proTipsHeading).toBeVisible();
  });

  test('marking a task complete updates progress and the detail panel button', async ({ page }) => {
    await onboardUser(page, { userType: 'student' });
    const taskDetail = new TaskDetailPanel(page);

    await expect(page.getByText('0 of')).toBeVisible();

    await page.getByText('Get SIN Number', { exact: true }).click();
    await expect(taskDetail.markCompleteButton).toHaveText('Mark Complete');

    await taskDetail.toggleComplete();

    await expect(taskDetail.markCompleteButton).toHaveText('✓ Completed');
    await expect(page.getByText('1 of')).toBeVisible();
  });

  test('toggling complete from the checklist row also updates the detail panel', async ({ page }) => {
    await onboardUser(page, { userType: 'student' });
    const taskDetail = new TaskDetailPanel(page);

    await page.getByText('Get SIN Number', { exact: true }).click();
    await expect(taskDetail.markCompleteButton).toHaveText('Mark Complete');

    // Circle toggle button sits to the left of the task title within its row.
    const row = page.locator('div.cursor-pointer', { hasText: 'Get SIN Number' });
    await row.getByRole('button').click();

    await expect(taskDetail.markCompleteButton).toHaveText('✓ Completed');
  });
});
