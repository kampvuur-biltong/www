from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:4173/"
VIEWPORTS = [
    (1440, 900),
    (1024, 768),
    (768, 1024),
    (390, 844),
    (320, 568),
]

NAV_LINKS = [
    "#how-it-works",
    "#about",
    "#products",
    "#faq",
]

with sync_playwright() as p:
    browser = p.chromium.launch()

    for width, height in VIEWPORTS:
        page = browser.new_page(
            viewport={"width": width, "height": height}
        )

        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))

        page.goto(URL, wait_until="networkidle")

        # No horizontal overflow at supported breakpoints.
        assert not page.evaluate(
            "document.documentElement.scrollWidth > "
            "document.documentElement.clientWidth"
        ), f"horizontal overflow at {width}x{height}"

        # Correct semantic primary heading.
        assert page.locator("h1").count() == 1
        assert page.locator("h1").inner_text() == "Kampvuur Biltong"

        # Critical/LCP asset must be optimized and high priority.
        hero = page.locator(".hero-media img")
        assert hero.count() == 1
        assert hero.get_attribute("src").endswith(
            "assets/hero-campfire.webp"
        )
        assert hero.get_attribute("fetchpriority") == "high"
        assert hero.get_attribute("loading") == "eager"

        # Primary Figma navigation destinations must exist.
        for href in NAV_LINKS:
            assert page.locator(f'a[href="{href}"]').count() >= 1
            assert page.locator(href).count() == 1

        # Theme derivative remains functional.
        before = page.get_attribute("html", "data-theme")
        page.locator("[data-theme-toggle]").click()
        after = page.get_attribute("html", "data-theme")
        assert after != before

        # Callback form must generate the correct WhatsApp request
        # without actually navigating to an external site in CI.
        page.evaluate("""
            window.__kampvuurOpened = null;
            window.open = (url) => {
                window.__kampvuurOpened = url;
                return null;
            };
        """)

        page.locator('input[name="name"]').fill("CI Test")
        page.locator('input[name="email"]').fill("ci@example.com")
        page.locator('input[name="phone"]').fill("+27820000000")
        page.locator('#callback-form button[type="submit"]').click()

        opened = page.evaluate("window.__kampvuurOpened")

        assert opened is not None
        assert opened.startswith(
            "https://wa.me/27726275503?text="
        )
        assert "CI%20Test" in opened

        # Most offscreen imagery should be lazy.
        assert page.locator('img[loading="lazy"]').count() >= 8

        assert not errors, errors

        page.close()

    # Exact Figma motion must respect reduced-motion accessibility.
    reduced = browser.new_page(
        viewport={"width": 390, "height": 844},
        reduced_motion="reduce",
    )

    reduced.goto(URL, wait_until="networkidle")

    animation_name = reduced.locator(
        ".hero-media img"
    ).evaluate(
        "el => getComputedStyle(el).animationName"
    )

    assert animation_name == "none"

    reduced.close()
    browser.close()

print("Figma responsive/UI test: PASS")