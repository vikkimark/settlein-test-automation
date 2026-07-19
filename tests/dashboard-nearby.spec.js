const { test, expect } = require('@playwright/test');
const { onboardUser } = require('./helpers/onboard');
const { DashboardPage } = require('./pages/DashboardPage');
const { NearbyPlacesPage } = require('./pages/NearbyPlacesPage');

test.describe('Dashboard - Nearby tab', () => {
  test('prompts to enable location before showing categories are searchable', async ({ page }) => {
    await onboardUser(page);
    const dashboard = new DashboardPage(page);
    await dashboard.openNearbyTab();

    const nearby = new NearbyPlacesPage(page);
    await expect(nearby.heading).toBeVisible();
    await expect(nearby.enableLocationButton).toBeVisible();
    await expect(nearby.categoryButton('Grocery')).toBeDisabled();
  });

  test.describe('with location permission granted', () => {
    test.use({
      permissions: ['geolocation'],
      geolocation: { latitude: 43.6532, longitude: -79.3832 },
    });

    test('enabling location surfaces the confirmation banner and unlocks categories', async ({ page }) => {
      await onboardUser(page);
      const dashboard = new DashboardPage(page);
      await dashboard.openNearbyTab();

      const nearby = new NearbyPlacesPage(page);
      await nearby.enableLocation();

      await expect(nearby.locationEnabledBanner).toBeVisible();
      await expect(nearby.categoryButton('Grocery')).toBeEnabled();
    });

    test('searching a category renders results from the places API', async ({ page }) => {
      await page.route('**/api/places**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            results: [
              { name: 'Test Grocery Co', vicinity: '123 Queen St, Toronto', rating: 4.5 },
            ],
          }),
        });
      });

      await onboardUser(page);
      const dashboard = new DashboardPage(page);
      await dashboard.openNearbyTab();

      const nearby = new NearbyPlacesPage(page);
      await nearby.enableLocation();
      await expect(nearby.locationEnabledBanner).toBeVisible();

      await nearby.searchCategory('Grocery');

      await expect(page.getByText('Test Grocery Co')).toBeVisible();
      await expect(page.getByText('123 Queen St, Toronto')).toBeVisible();
      await expect(page.getByText('⭐ 4.5 / 5')).toBeVisible();
    });

    test('alerts when the places API call fails', async ({ page }) => {
      await page.route('**/api/places**', (route) => route.abort());

      await onboardUser(page);
      const dashboard = new DashboardPage(page);
      await dashboard.openNearbyTab();

      const nearby = new NearbyPlacesPage(page);
      await nearby.enableLocation();
      await expect(nearby.locationEnabledBanner).toBeVisible();

      let dialogMessage = '';
      page.once('dialog', async (dialog) => {
        dialogMessage = dialog.message();
        await dialog.accept();
      });

      await nearby.searchCategory('Grocery');

      await expect.poll(() => dialogMessage).toContain('Error loading places');
    });
  });
});
