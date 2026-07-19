"""
Known, unfixed defects - tracked deliberately as expected-failure tests.

This is a Python/pytest-playwright version of the same bug demonstrated in
the JavaScript suite at ../tests/known-issues.spec.js (BUG-001).

These are NOT flaky or broken tests to "fix". Each one encodes the *correct*
expected behavior and is marked @pytest.mark.xfail(strict=True) so pytest
reports it as an expected failure (linked to the bug report) rather than a
red herring. If the underlying bug is ever fixed in the app, this test will
start unexpectedly passing (an "XPASS"), which itself flags that this file
needs updating.

Runs against the live production deployment (https://settle-in.vercel.app)
by default - see pytest.ini. Pass --base-url to point elsewhere.

Prerequisites:
    1. In this folder, install deps:   pip install -r requirements.txt
                                        playwright install chromium
    2. Run the test:                   pytest -v
"""
import re
import pytest
from urllib.parse import urlparse

# Domains that are legitimate Canadian/Ontario government sources.
GOV_DOMAIN_PATTERN = re.compile(r"(^|\.)(canada\.ca|gc\.ca|ontario\.ca)$")


def onboard_user(page, user_type, city, family_status, arrival_date):
    """Drives Welcome -> UserType -> Onboarding to land on the Dashboard."""
    page.goto("/")
    page.get_by_role("button", name="Get Started").click()

    user_type_labels = {
        "student": "International Student",
        "work": "Work Permit Holder",
        "pr": "Permanent Resident",
        "citizen": "New Citizen",
        "traveler": "Visitor/Traveler",
    }
    page.get_by_role("button", name=user_type_labels[user_type]).click()

    page.get_by_placeholder("e.g., Toronto, Ottawa, Waterloo").fill(city)
    page.locator("select").select_option(family_status)
    page.locator('input[type="date"]').fill(arrival_date)
    page.get_by_role("button", name="Create My Checklist").click()


@pytest.mark.xfail(
    strict=True,
    reason="BUG-001: 'Official Government Resources' link for Housing tasks "
           "points to a commercial real-estate site (rentals.ca), not a "
           "government domain. See lib/tasks.js, task id 'housing'.",
)
def test_find_housing_link_should_be_a_government_domain(page):
    onboard_user(page, user_type="pr", city="Toronto", family_status="solo", arrival_date="2026-09-01")

    page.get_by_text("Find Housing", exact=True).click()
    expect_heading = page.get_by_role("heading", name="Official Government Resources")
    expect_heading.wait_for(state="visible")

    link = page.get_by_role("link", name="Official Application Portal")
    href = link.get_attribute("href")
    hostname = urlparse(href).hostname

    # Actual: hostname is "www.rentals.ca" - a commercial real estate
    # listings/affiliate site, not a .gc.ca or ontario.ca government page.
    assert GOV_DOMAIN_PATTERN.search(hostname), (
        f"Expected a government domain (canada.ca / gc.ca / ontario.ca), "
        f"but got: {hostname}"
    )


@pytest.mark.xfail(
    strict=True,
    reason="BUG-001: 'Official Government Resources' link for Student Housing "
           "points to places4students.com, not a government domain. "
           "See lib/tasks.js, task id 'student_housing'.",
)
def test_find_student_housing_link_should_be_a_government_domain(page):
    onboard_user(page, user_type="student", city="Waterloo", family_status="solo", arrival_date="2026-09-01")

    page.get_by_text("Find Student Housing", exact=True).click()
    expect_heading = page.get_by_role("heading", name="Official Government Resources")
    expect_heading.wait_for(state="visible")

    link = page.get_by_role("link", name="Official Application Portal")
    href = link.get_attribute("href")
    hostname = urlparse(href).hostname

    # Actual: hostname is "www.places4students.com" - a third-party student
    # housing listings site, not a government resource.
    assert GOV_DOMAIN_PATTERN.search(hostname), (
        f"Expected a government domain (canada.ca / gc.ca / ontario.ca), "
        f"but got: {hostname}"
    )
