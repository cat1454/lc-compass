"""Browser smoke checks for the design explorer, not the resident application."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parent
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 1000})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto((root / "explorer.html").as_uri())
    page.wait_for_selector("#caseId:text('LC-00001')")
    assert page.locator("#action").inner_text() == "PREPARE"
    page.select_option("#stress", "3")
    assert page.locator("#action").inner_text() == "REVIEW_SOURCE"
    page.select_option("#stress", "8")
    assert page.locator("#action").inner_text() == "PREPARE"
    page.select_option("#stress", "9")
    assert page.locator("#action").inner_text() == "URGENT_HELP"
    for number, action, kind in [(1001, "OFFICIAL_REDIRECT", "OUT_OF_SCOPE"),
                                  (7071, "PREPARE", "PLACE"),
                                  (8071, "PREPARE", "DISCOVER")]:
        page.fill("#number", str(number))
        page.click("#go")
        assert page.locator("#action").inner_text() == action
        assert page.locator("#type").inner_text() == kind
    page.fill("#number", "10000")
    page.click("#go")
    assert page.locator("#caseId").inner_text() == "LC-10000"
    page.click("#next")
    assert page.locator("#caseId").inner_text() == "LC-00001"
    assert page.locator("#intent option").count() == 100
    assert page.locator("#profile option").count() == 10
    assert page.locator("#stress option").count() == 10
    page.screenshot(path=str(root / "explorer_desktop.png"), full_page=True)
    page.set_viewport_size({"width": 390, "height": 844})
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
    page.screenshot(path=str(root / "explorer_mobile.png"), full_page=True)
    assert not errors, errors
    browser.close()
    result = {"status": "passed", "console_page_errors": errors,
              "tested": ["initial case", "stale source", "AI outage", "urgent", "unsupported goal",
                         "public place without proxy consent", "public discovery without proxy consent",
                         "case 10000 and wrap", "selector cardinality", "mobile overflow"],
              "limit": "Design explorer only; no live civic services, source verification, or LLM tested."}
    (root / "explorer_check.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps(result, indent=2))
