const { defineConfig, devices } = require('@playwright/test');

// This repo contains only the test automation for SettleIn, not the app
// source. Tests run against the live production deployment by default.
// Pass BASE_URL to point at a different environment, e.g. local dev:
//   BASE_URL=http://localhost:3000 npx playwright test
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'https://settle-in.vercel.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
  ],
});
