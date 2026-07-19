const { test, expect } = require('@playwright/test');
const { WelcomePage } = require('./pages/WelcomePage');

test.describe('Welcome screen', () => {
  test('renders branding and call to action', async ({ page }) => {
    const welcome = new WelcomePage(page);
    await welcome.goto();

    await expect(welcome.heading).toBeVisible();
    await expect(welcome.subheading).toBeVisible();
    await expect(page.getByText('Students • Work Permits • PR • Citizens • Travelers')).toBeVisible();
    await expect(welcome.getStartedButton).toBeVisible();
  });

  test('navigates to user type selection on Get Started', async ({ page }) => {
    const welcome = new WelcomePage(page);
    await welcome.goto();
    await welcome.clickGetStarted();

    await expect(page.getByRole('heading', { name: 'Welcome to Ontario!' })).toBeVisible();
  });
});
