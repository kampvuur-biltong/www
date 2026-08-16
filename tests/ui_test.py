from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:4173/"
VIEWPORTS = [(1440, 900), (768, 1024), (390, 844), (320, 568)]

with sync_playwright() as p:
    browser = p.chromium.launch()
    for width, height in VIEWPORTS:
        page = browser.new_page(viewport={"width": width, "height": height})
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(URL, wait_until="networkidle")
        assert not page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth"), f"horizontal overflow at {width}px"
        assert page.locator("h1").count() == 1
        assert page.locator('a[href^="https://wa.me/"]').count() == page.locator('a[href^="https://wa.me/"] .whatsapp-icon').count()
        before = page.get_attribute("html", "data-theme")
        page.locator("[data-theme-toggle]").click()
        assert page.get_attribute("html", "data-theme") != before
        page.evaluate("window.scrollTo(0, 600)")
        page.wait_for_timeout(100)
        assert page.locator("[data-header]").evaluate("el => el.classList.contains('is-scrolled')")
        if width <= 980:
            toggle = page.locator("[data-menu-toggle]")
            toggle.click()
            page.wait_for_timeout(100)
            assert toggle.get_attribute("aria-expanded") == "true"
            assert page.locator("[data-mobile-menu]").get_attribute("aria-hidden") == "false"
            assert page.evaluate("document.activeElement === document.querySelector('[data-menu-toggle]')")
            page.keyboard.press("Escape")
            page.wait_for_timeout(100)
            assert toggle.get_attribute("aria-expanded") == "false"
            assert page.evaluate("document.activeElement === document.querySelector('[data-menu-toggle]')")
        assert not errors, errors
        page.close()
    reduced = browser.new_page(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
    reduced.goto(URL, wait_until="networkidle")
    assert reduced.locator(".reveal").first.evaluate("el => getComputedStyle(el).transform") == "none"
    browser.close()
print("UI interaction/responsive test: PASS")
