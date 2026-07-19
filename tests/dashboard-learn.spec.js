const { test, expect } = require('@playwright/test');
const { onboardUser } = require('./helpers/onboard');
const { DashboardPage } = require('./pages/DashboardPage');
const { LearnContentPage } = require('./pages/LearnContentPage');

test.describe('Dashboard - Learn tab', () => {
  test.beforeEach(async ({ page }) => {
    await onboardUser(page);
    const dashboard = new DashboardPage(page);
    await dashboard.openLearnTab();
  });

  test('shows curated content and social links', async ({ page }) => {
    const learn = new LearnContentPage(page);

    await expect(learn.heading).toBeVisible();
    await expect(learn.videoCard('Welcome to Canada: First Week Survival Guide')).toBeVisible();
    await expect(learn.videoCard('How to Get Your SIN Number Online')).toBeVisible();

    await expect(learn.instagramLink).toHaveAttribute('href', 'https://instagram.com/settlein');
    await expect(learn.youtubeLink).toHaveAttribute('href', 'https://youtube.com/@settlein');
    await expect(learn.linkedinLink).toHaveAttribute('href', 'https://linkedin.com/company/settlein');
  });
});
