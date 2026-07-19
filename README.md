# SettleIn — Test Automation

Playwright end-to-end test automation for [SettleIn](https://settle-in.vercel.app), a Next.js settlement checklist app for newcomers to Canada.

**This repo intentionally contains only the test automation code, not the application source.** Tests run directly against the live production deployment — no local setup of the app itself is needed.

## What's covered

29 test cases across every screen of the app: Welcome, User Type Selection, Onboarding, and the Dashboard (Checklist, Nearby, Learn tabs), plus header navigation and a full end-to-end journey. Built with the Page Object Model for maintainability — locators live in `tests/pages/`, test logic stays in the spec files.

Also includes a **documented, intentionally-failing regression test (BUG-001)**: the "Official Government Resources" link on Housing tasks actually points to a commercial real estate site, not a government domain. Rather than silently skip this, it's tracked as an expected failure in both suites so it shows up clearly in any test run.

## JavaScript (primary suite)

```bash
npm install
npx playwright install chromium

npm run test:e2e          # runs against https://settle-in.vercel.app by default
npm run test:e2e:ui       # interactive UI mode
npm run test:e2e:report   # view the last HTML report

BASE_URL=http://localhost:3000 npm run test:e2e   # point at a local instance instead
```

```
tests/
  pages/            Page objects - one per screen (WelcomePage, DashboardPage, ...)
  helpers/          Shared flows (onboard.js drives Welcome -> Dashboard)
  *.spec.js         One spec file per screen/feature
  known-issues.spec.js   BUG-001 regression test
```

## Python (small, focused suite)

A couple of tests in a second language/framework (`pytest-playwright`), covering the same BUG-001 regression.

```bash
cd python-tests
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python -m playwright install chromium

pytest -v   # runs against https://settle-in.vercel.app by default (see pytest.ini)
```

## Known Issues

**BUG-001 — "Official Government Resources" link is not a government URL for Housing tasks.**
The Housing and Student Housing tasks label their resource link "Official Government Resources," but it actually points to a commercial listings site (`rentals.ca` / `places4students.com`), not a `.gc.ca` / `ontario.ca` domain.

- `tests/known-issues.spec.js` (JavaScript)
- `python-tests/test_known_issues.py` (Python)
