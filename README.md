# SettleIn — Test Automation

Playwright end-to-end test automation for [SettleIn](https://settle-in.vercel.app), a Next.js settlement checklist app for newcomers to Canada.

**This repo intentionally contains only the test automation code, not the application source.** Tests run directly against the live production deployment — no local setup of the app itself is needed.

## What's covered

29 test cases across every screen of the app: Welcome, User Type Selection, Onboarding, and the Dashboard (Checklist, Nearby, Learn tabs), plus header navigation and a full end-to-end journey. Built with the Page Object Model for maintainability — locators live in `tests/pages/`, test logic stays in the spec files.

Also includes a **documented, intentionally-failing regression test (BUG-001)**: the "Official Government Resources" link on Housing tasks actually points to a commercial real estate site, not a government domain. Rather than silently skip this, it's tracked as an expected failure in both suites so it shows up clearly in any test run.

## Documents

- `bug-reports/SettleIn-Test-Case-Document.docx` — the full test case matrix (all 29 cases: ID, steps, expected result, priority, status), organized page-by-page to match the spec files below
- `bug-reports/BUG-001-Housing-Link-Report.docx` — written bug report for BUG-001 (see Known Issues)

## Known Issues

**BUG-001 — "Official Government Resources" link is not a government URL for Housing tasks.**
The Housing and Student Housing tasks label their resource link "Official Government Resources," but it actually points to a commercial listings site (`rentals.ca` / `places4students.com`), not a `.gc.ca` / `ontario.ca` domain.

- `tests/known-issues.spec.js` (JavaScript)
- `python-tests/test_known_issues.py` (Python)
- `bug-reports/BUG-001-Housing-Link-Report.docx` — full written bug report (description, repro steps, current vs. expected behavior, screenshot, and build/system info)
