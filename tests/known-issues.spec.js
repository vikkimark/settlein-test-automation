/**
 * Known, unfixed defects — tracked deliberately as failing/expected-fail tests.
 *
 * These are NOT flaky or broken tests to "fix" in this suite. Each one encodes
 * the *correct* expected behavior and is annotated with test.fail() so the
 * Playwright report shows it as an expected failure (linked to a bug ID below)
 * rather than a red herring. If the underlying bug is ever fixed, the test
 * will start unexpectedly passing, which itself flags that this file needs
 * updating.
 */
const { test, expect } = require('@playwright/test');
const { onboardUser } = require('./helpers/onboard');
const { TaskDetailPanel } = require('./pages/TaskDetailPanel');

// Domains that are legitimate Canadian/Ontario government sources.
const GOV_DOMAIN_PATTERN = /(^|\.)(canada\.ca|gc\.ca|ontario\.ca)$/;

test.describe('BUG-001: "Official Government Resources" link is not a government URL for Housing tasks', () => {
  test.fail(); // Marks this suite as a known/expected failure — see bug report.

  test('Find Housing (work/pr/traveler) — link should point to a government domain', async ({ page }) => {
    await onboardUser(page, { userType: 'pr', familyStatus: 'solo' });
    const taskDetail = new TaskDetailPanel(page);

    await page.getByText('Find Housing', { exact: true }).click();
    await expect(taskDetail.govResourcesHeading).toBeVisible();

    const href = await taskDetail.govResourcesLink.getAttribute('href');
    const hostname = new URL(href).hostname;

    // Actual: href is "https://www.rentals.ca/" — a commercial real estate
    // listings/affiliate site, not a .gc.ca or ontario.ca government page.
    // See lib/tasks.js, task id "housing", `link` field.
    expect(hostname).toMatch(GOV_DOMAIN_PATTERN);
  });

  test('Find Student Housing (student) — link should point to a government domain', async ({ page }) => {
    await onboardUser(page, { userType: 'student' });
    const taskDetail = new TaskDetailPanel(page);

    await page.getByText('Find Student Housing', { exact: true }).click();
    await expect(taskDetail.govResourcesHeading).toBeVisible();

    const href = await taskDetail.govResourcesLink.getAttribute('href');
    const hostname = new URL(href).hostname;

    // Actual: href is "https://www.places4students.com/" — a third-party
    // student housing listings site, not a government resource.
    // See lib/tasks.js, task id "student_housing", `link` field.
    expect(hostname).toMatch(GOV_DOMAIN_PATTERN);
  });
});
