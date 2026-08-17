/**
 * Kampvuur Biltong
 * Global UI runtime
 *
 * Responsibilities:
 * - Browser/favicon branding
 * - Light/dark theme
 * - Sticky / scroll-aware header
 * - Active navigation scroll-spy
 * - Accessible mobile navigation drawer
 * - Hero background video
 * - Hero CTA enhancement
 * - Reduced-motion handling
 * - Scroll reveal effects
 * - Back-to-top control
 * - Footer year
 * - Placeholder-link protection
 * - WhatsApp callback form
 *
 * No external dependencies.
 */

(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;

  root.classList.add('js');

  const qs = (selector, context = doc) =>
    context.querySelector(selector);

  const qsa = (selector, context = doc) =>
    Array.from(context.querySelectorAll(selector));

  const reducedMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

  const desktopNavigation = window.matchMedia
    ? window.matchMedia('(min-width: 821px)')
    : null;

  const MASTER_ICON =
    'images/figma/1bdd38e5bc3a72b05d4523ff23ff56c8.png.png';

  const HERO_VIDEO =
    'images/Kampvuur%20Biltong.mp4';

  const HERO_POSTER =
    'assets/hero-campfire.webp';

  const PHONE_NUMBER =
    '27726275503';

  /* ============================================================
     Utilities
     ============================================================ */

  const safeStorage = {
    get(key) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },

    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // Storage may be blocked; UI remains functional.
      }
    }
  };

  const rafThrottle = (callback) => {
    let queued = false;

    return (...args) => {
      if (queued) return;

      queued = true;

      window.requestAnimationFrame(() => {
        callback(...args);
        queued = false;
      });
    };
  };

  const escapeHtml = (value) =>
    String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');

  /* ============================================================
     Browser / favicon branding
     ============================================================ */

  const initBrowserBranding = () => {
    const existingIcons = qsa(
      'link[rel="icon"], link[rel="shortcut icon"]'
    );

    if (existingIcons.length) {
      existingIcons.forEach((icon) => {
        icon.href = MASTER_ICON;
        icon.type = 'image/png';
      });
    } else {
      const icon = doc.createElement('link');

      icon.rel = 'icon';
      icon.type = 'image/png';
      icon.href = MASTER_ICON;

      doc.head.appendChild(icon);
    }

    let appleIcon = qs('link[rel="apple-touch-icon"]');

    if (!appleIcon) {
      appleIcon = doc.createElement('link');
      appleIcon.rel = 'apple-touch-icon';
      doc.head.appendChild(appleIcon);
    }

    appleIcon.href = MASTER_ICON;
  };

  /* ============================================================
     Theme
     ============================================================ */

  const initTheme = () => {
    const toggle = qs('[data-theme-toggle]');
    const themeMeta = qs('meta[name="theme-color"]');

    const saved = safeStorage.get('kampvuur-theme');

    const systemDark =
      window.matchMedia?.('(prefers-color-scheme: dark)')
        .matches ?? false;

    const initial =
      saved === 'dark' || saved === 'light'
        ? saved
        : systemDark
          ? 'dark'
          : 'light';

    const themeIcon = (theme) => {
      if (theme === 'dark') {
        return `
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m17.66 17.66 1.41 1.41"></path>
            <path d="M2 12h2"></path>
            <path d="M20 12h2"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
            <path d="m19.07 4.93-1.41 1.41"></path>
          </svg>
        `;
      }

      return `
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3
               7 7 0 0 0 21 12.79Z"
          ></path>
        </svg>
      `;
    };

    const applyTheme = (theme) => {
      root.dataset.theme = theme;

      if (themeMeta) {
        themeMeta.content =
          theme === 'dark'
            ? '#161311'
            : '#231f20';
      }

      if (toggle) {
        const next =
          theme === 'dark'
            ? 'light'
            : 'dark';

        toggle.setAttribute(
          'aria-label',
          `Switch to ${next} theme`
        );

        toggle.setAttribute(
          'title',
          `Switch to ${next} theme`
        );

        toggle.setAttribute(
          'aria-pressed',
          theme === 'dark'
            ? 'true'
            : 'false'
        );

        toggle.innerHTML = themeIcon(theme);
      }
    };

    applyTheme(initial);

    toggle?.addEventListener('click', () => {
      const next =
        root.dataset.theme === 'dark'
          ? 'light'
          : 'dark';

      applyTheme(next);
      safeStorage.set('kampvuur-theme', next);
    });
  };

  /* ============================================================
     Sticky / scroll-aware header
     ============================================================ */

  const initHeader = () => {
    const header = qs('.site-header');

    if (!header) return;

    let previousY = window.scrollY;
    let hidden = false;

    const update = () => {
      const currentY = Math.max(0, window.scrollY);

      header.classList.toggle(
        'is-scrolled',
        currentY > 32
      );

      const movingDown =
        currentY > previousY + 7;

      const movingUp =
        currentY < previousY - 7;

      const navigationOpen =
        body.classList.contains('nav-open');

      const keyboardInside =
        header.contains(doc.activeElement);

      if (
        movingDown &&
        currentY > 260 &&
        !navigationOpen &&
        !keyboardInside
      ) {
        hidden = true;
      }

      if (
        movingUp ||
        currentY < 120 ||
        navigationOpen ||
        keyboardInside
      ) {
        hidden = false;
      }

      header.classList.toggle(
        'is-hidden',
        hidden
      );

      previousY = currentY;
    };

    const throttled = rafThrottle(update);

    window.addEventListener(
      'scroll',
      throttled,
      { passive: true }
    );

    window.addEventListener(
      'resize',
      throttled,
      { passive: true }
    );

    update();
  };

  /* ============================================================
     Active navigation / scroll spy
     ============================================================ */

  const initScrollSpy = () => {
    const sectionIds = [
      'how-it-works',
      'about',
      'products',
      'faq'
    ];

    const sections = sectionIds
      .map((id) => doc.getElementById(id))
      .filter(Boolean);

    if (
      !sections.length ||
      !('IntersectionObserver' in window)
    ) {
      return;
    }

    let activeId = '';

    const setActive = (id) => {
      if (!id || activeId === id) return;

      activeId = id;

      qsa(
        '.site-header a[href^="#"], ' +
        '.mobile-nav-drawer a[href^="#"]'
      ).forEach((link) => {
        const isActive =
          link.getAttribute('href') === `#${id}`;

        link.classList.toggle(
          'is-active',
          isActive
        );

        if (isActive) {
          link.setAttribute(
            'aria-current',
            'location'
          );
        } else {
          link.removeAttribute(
            'aria-current'
          );
        }
      });
    };

    const observer =
      new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter(
              (entry) =>
                entry.isIntersecting
            )
            .sort(
              (a, b) =>
                b.intersectionRatio -
                a.intersectionRatio
            );

          if (visible[0]) {
            setActive(
              visible[0].target.id
            );
          }
        },
        {
          rootMargin:
            '-24% 0px -58% 0px',
          threshold: [
            0.05,
            0.15,
            0.3,
            0.5
          ]
        }
      );

    sections.forEach(
      (section) =>
        observer.observe(section)
    );
  };

  /* ============================================================
     Mobile navigation
     ============================================================ */

  const initMobileNavigation = () => {
    const header = qs('.site-header');
    const headerInner =
      qs('.header-inner', header);

    const primaryNav =
      qs(
        'nav[aria-label="Primary navigation"]',
        header
      );

    const themeToggle =
      qs('[data-theme-toggle]', header);

    if (
      !header ||
      !headerInner ||
      !primaryNav
    ) {
      return;
    }

    const menuButton =
      doc.createElement('button');

    menuButton.type = 'button';
    menuButton.className = 'menu-toggle';

    menuButton.setAttribute(
      'aria-expanded',
      'false'
    );

    menuButton.setAttribute(
      'aria-controls',
      'kampvuur-mobile-navigation'
    );

    menuButton.setAttribute(
      'aria-label',
      'Open navigation menu'
    );

    menuButton.innerHTML = `
      <span class="menu-toggle-lines" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </span>
    `;

    if (themeToggle) {
      headerInner.insertBefore(
        menuButton,
        themeToggle
      );
    } else {
      headerInner.appendChild(
        menuButton
      );
    }

    const backdrop =
      doc.createElement('button');

    backdrop.type = 'button';
    backdrop.className =
      'mobile-nav-backdrop';

    backdrop.setAttribute(
      'aria-label',
      'Close navigation menu'
    );

    backdrop.tabIndex = -1;

    const drawer =
      doc.createElement('aside');

    drawer.className =
      'mobile-nav-drawer';

    drawer.id =
      'kampvuur-mobile-navigation';

    drawer.setAttribute(
      'aria-label',
      'Mobile navigation'
    );

    drawer.setAttribute(
      'aria-hidden',
      'true'
    );

    const brandImage =
      qs('.brand img', header);

    const brandMarkup =
      brandImage
        ? `
          <a
            class="mobile-nav-brand"
            href="#top"
            aria-label="Kampvuur Biltong home"
          >
            <img
              src="${escapeHtml(
                brandImage.getAttribute('src') ||
                'assets/logo.png'
              )}"
              alt="Kampvuur Biltong"
            >
          </a>
        `
        : '';

    const navLinks =
      qsa('a', primaryNav)
        .map((link) => {
          const href =
            link.getAttribute('href') || '#';

          const label =
            link.textContent.trim();

          return `
            <a href="${escapeHtml(href)}">
              <span>${escapeHtml(label)}</span>
              <span
                class="mobile-nav-arrow"
                aria-hidden="true"
              >→</span>
            </a>
          `;
        })
        .join('');

    drawer.innerHTML = `
      <div class="mobile-nav-head">
        ${brandMarkup}

        <button
          class="mobile-nav-close"
          type="button"
          aria-label="Close navigation menu"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <nav aria-label="Mobile primary navigation">
        ${navLinks}
      </nav>

      <div class="mobile-nav-actions">
        <a
          class="mobile-nav-cta"
          href="#products"
        >
          Discover Our Biltong
          <span aria-hidden="true">→</span>
        </a>

        <a
          class="mobile-nav-contact"
          href="tel:+${PHONE_NUMBER}"
        >
          Call Kampvuur
        </a>
      </div>

      <p class="mobile-nav-tagline">
        The Taste of Tradition
      </p>
    `;

    body.appendChild(backdrop);
    body.appendChild(drawer);

    const closeButton =
      qs('.mobile-nav-close', drawer);

    let previousFocus = null;

    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    const getFocusable = () =>
      qsa(
        focusableSelector,
        drawer
      ).filter(
        (element) =>
          !element.hasAttribute(
            'disabled'
          )
      );

    const openMenu = () => {
      previousFocus =
        doc.activeElement;

      body.classList.add(
        'nav-open'
      );

      menuButton.classList.add(
        'is-active'
      );

      menuButton.setAttribute(
        'aria-expanded',
        'true'
      );

      menuButton.setAttribute(
        'aria-label',
        'Close navigation menu'
      );

      drawer.setAttribute(
        'aria-hidden',
        'false'
      );

      qs('main')?.setAttribute(
        'inert',
        ''
      );

      qs('.site-footer')?.setAttribute(
        'inert',
        ''
      );

      window.requestAnimationFrame(
        () => {
          closeButton?.focus();
        }
      );
    };

    const closeMenu = ({
      restoreFocus = true
    } = {}) => {
      body.classList.remove(
        'nav-open'
      );

      menuButton.classList.remove(
        'is-active'
      );

      menuButton.setAttribute(
        'aria-expanded',
        'false'
      );

      menuButton.setAttribute(
        'aria-label',
        'Open navigation menu'
      );

      drawer.setAttribute(
        'aria-hidden',
        'true'
      );

      qs('main')?.removeAttribute(
        'inert'
      );

      qs('.site-footer')
        ?.removeAttribute('inert');

      if (
        restoreFocus &&
        previousFocus instanceof
          HTMLElement
      ) {
        previousFocus.focus();
      }
    };

    menuButton.addEventListener(
      'click',
      () => {
        if (
          body.classList.contains(
            'nav-open'
          )
        ) {
          closeMenu();
        } else {
          openMenu();
        }
      }
    );

    closeButton?.addEventListener(
      'click',
      () => closeMenu()
    );

    backdrop.addEventListener(
      'click',
      () => closeMenu()
    );

    qsa('a', drawer).forEach(
      (link) => {
        link.addEventListener(
          'click',
          () =>
            closeMenu({
              restoreFocus: false
            })
        );
      }
    );

    doc.addEventListener(
      'keydown',
      (event) => {
        if (
          !body.classList.contains(
            'nav-open'
          )
        ) {
          return;
        }

        if (event.key === 'Escape') {
          event.preventDefault();
          closeMenu();
          return;
        }

        if (event.key !== 'Tab') {
          return;
        }

        const focusable =
          getFocusable();

        if (!focusable.length) {
          return;
        }

        const first =
          focusable[0];

        const last =
          focusable[
            focusable.length - 1
          ];

        if (
          event.shiftKey &&
          doc.activeElement === first
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          doc.activeElement === last
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    );

    desktopNavigation
      ?.addEventListener?.(
        'change',
        (event) => {
          if (event.matches) {
            closeMenu({
              restoreFocus: false
            });
          }
        }
      );
  };

  /* ============================================================
     Hero video
     ============================================================ */

  const initHeroVideo = () => {
    const hero =
      qs('.hero');

    const media =
      qs('.hero-media', hero);

    const poster =
      qs('img', media);

    if (
      !hero ||
      !media ||
      !poster
    ) {
      return;
    }

    poster.classList.add(
      'hero-poster'
    );

    poster.setAttribute(
      'loading',
      'eager'
    );

    poster.setAttribute(
      'fetchpriority',
      'high'
    );

    let video =
      qs(
        '[data-hero-video]',
        media
      );

    if (!video) {
      video =
        doc.createElement('video');

      video.className =
        'hero-video';

      video.dataset.heroVideo = '';

      video.autoplay = true;
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'metadata';

      video.setAttribute(
        'muted',
        ''
      );

      video.setAttribute(
        'autoplay',
        ''
      );

      video.setAttribute(
        'loop',
        ''
      );

      video.setAttribute(
        'playsinline',
        ''
      );

      video.setAttribute(
        'aria-hidden',
        'true'
      );

      video.setAttribute(
        'tabindex',
        '-1'
      );

      video.poster =
        poster.getAttribute('src') ||
        HERO_POSTER;

      const source =
        doc.createElement('source');

      source.src = HERO_VIDEO;
      source.type = 'video/mp4';

      video.appendChild(source);
      media.appendChild(video);
    }

    let heroVisible = true;

    const canPlay = () =>
      !reducedMotion?.matches &&
      heroVisible &&
      !doc.hidden;

    const playVideo = () => {
      if (!canPlay()) {
        video.pause();
        return;
      }

      const playback =
        video.play();

      playback?.catch?.(() => {
        /*
         * Browser autoplay restrictions may
         * reject playback. Poster remains.
         */
      });
    };

    const syncMotion = () => {
      if (
        reducedMotion?.matches
      ) {
        video.pause();

        media.classList.add(
          'is-motion-reduced'
        );
      } else {
        media.classList.remove(
          'is-motion-reduced'
        );

        playVideo();
      }
    };

    video.addEventListener(
      'loadeddata',
      () => {
        media.classList.add(
          'has-video'
        );
      },
      { once: true }
    );

    video.addEventListener(
      'canplay',
      () => {
        media.classList.add(
          'video-ready'
        );

        playVideo();
      }
    );

    video.addEventListener(
      'error',
      () => {
        media.classList.remove(
          'video-ready'
        );

        media.classList.add(
          'video-error'
        );
      }
    );

    if (
      'IntersectionObserver' in
      window
    ) {
      const observer =
        new IntersectionObserver(
          (entries) => {
            const entry =
              entries[0];

            if (!entry) return;

            heroVisible =
              entry.isIntersecting &&
              entry.intersectionRatio >
                0.04;

            if (heroVisible) {
              playVideo();
            } else {
              video.pause();
            }
          },
          {
            threshold: [
              0,
              0.04,
              0.15
            ]
          }
        );

      observer.observe(hero);
    }

    doc.addEventListener(
      'visibilitychange',
      () => {
        if (doc.hidden) {
          video.pause();
        } else {
          playVideo();
        }
      }
    );

    reducedMotion
      ?.addEventListener?.(
        'change',
        syncMotion
      );

    syncMotion();
  };

  /* ============================================================
     Hero CTA
     ============================================================ */

  const initHeroCTA = () => {
    const cta =
      qs('.hero .btn-dark');

    if (!cta) return;

    cta.classList.add(
      'hero-cta'
    );

    if (
      !qs('.btn-arrow', cta)
    ) {
      const arrow =
        doc.createElement('span');

      arrow.className =
        'btn-arrow';

      arrow.setAttribute(
        'aria-hidden',
        'true'
      );

      arrow.textContent = '→';

      cta.appendChild(arrow);
    }
  };

  /* ============================================================
     Scroll reveal
     ============================================================ */

  const initRevealAnimations = () => {
    const selectors = [
      '.buyers .copy-block',
      '.buyers .portrait',
      '.step-grid article',
      '.products .kicker',
      '.products h2',
      '.product-grid article',
      '.about .copy-block',
      '.about .portrait',
      '.callback-card',
      '.callback-photo',
      '.gift-title',
      '.gift h2',
      '.gift img',
      '.faq-intro',
      '.faq-list article'
    ];

    const elements =
      selectors.flatMap(
        (selector) => qsa(selector)
      );

    const unique = [
      ...new Set(elements)
    ];

    if (!unique.length) return;

    unique.forEach(
      (element, index) => {
        element.classList.add(
          'reveal'
        );

        element.style.setProperty(
          '--reveal-delay',
          `${
            (index % 6) * 45
          }ms`
        );
      }
    );

    if (
      reducedMotion?.matches ||
      !(
        'IntersectionObserver' in
        window
      )
    ) {
      unique.forEach(
        (element) =>
          element.classList.add(
            'is-visible'
          )
      );

      return;
    }

    const observer =
      new IntersectionObserver(
        (entries, instance) => {
          entries.forEach(
            (entry) => {
              if (
                entry.isIntersecting
              ) {
                entry.target.classList.add(
                  'is-visible'
                );

                instance.unobserve(
                  entry.target
                );
              }
            }
          );
        },
        {
          rootMargin:
            '0px 0px -8% 0px',
          threshold: 0.08
        }
      );

    unique.forEach(
      (element) =>
        observer.observe(element)
    );

    reducedMotion
      ?.addEventListener?.(
        'change',
        (event) => {
          if (event.matches) {
            unique.forEach(
              (element) =>
                element.classList.add(
                  'is-visible'
                )
            );
          }
        }
      );
  };

  /* ============================================================
     Back to top
     ============================================================ */

  const initBackToTop = () => {
    const button =
      doc.createElement('button');

    button.type = 'button';
    button.className =
      'back-to-top';

    button.setAttribute(
      'aria-label',
      'Back to top'
    );

    button.setAttribute(
      'title',
      'Back to top'
    );

    button.innerHTML = `
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path d="m18 15-6-6-6 6"></path>
      </svg>
    `;

    body.appendChild(button);

    const update =
      rafThrottle(() => {
        button.classList.toggle(
          'is-visible',
          window.scrollY > 650
        );
      });

    window.addEventListener(
      'scroll',
      update,
      { passive: true }
    );

    button.addEventListener(
      'click',
      () => {
        window.scrollTo({
          top: 0,
          behavior:
            reducedMotion?.matches
              ? 'auto'
              : 'smooth'
        });
      }
    );

    update();
  };

  /* ============================================================
     Footer
     ============================================================ */

  const initFooter = () => {
    const footer =
      qs('.site-footer');

    if (!footer) return;

    const copyright =
      qs('.footer-inner > p', footer);

    if (copyright) {
      const year =
        new Date().getFullYear();

      copyright.innerHTML =
        copyright.innerHTML.replace(
          /Copyright © \d{4}/i,
          `Copyright © ${year}`
        );
    }

    const logo =
      qs('.footer-inner > img', footer);

    if (
      logo &&
      !qs(
        '.footer-tagline',
        footer
      )
    ) {
      const tagline =
        doc.createElement('span');

      tagline.className =
        'footer-tagline';

      tagline.textContent =
        'The Taste of Tradition';

      logo.insertAdjacentElement(
        'afterend',
        tagline
      );
    }
  };

  /* ============================================================
     Placeholder / external link hardening
     ============================================================ */

  const initLinks = () => {
    qsa(
      'a[target="_blank"]'
    ).forEach((link) => {
      const current =
        link.getAttribute('rel') || '';

      const tokens =
        new Set(
          current
            .split(/\s+/)
            .filter(Boolean)
        );

      tokens.add('noopener');
      tokens.add('noreferrer');

      link.setAttribute(
        'rel',
        [...tokens].join(' ')
      );
    });

    qsa(
      '.social-row a[href="#"]'
    ).forEach((link) => {
      link.classList.add(
        'is-placeholder'
      );

      link.setAttribute(
        'aria-disabled',
        'true'
      );

      link.addEventListener(
        'click',
        (event) =>
          event.preventDefault()
      );
    });

    const handle =
      qs('.social-row span');

    if (
      handle &&
      /reallygreatsite/i.test(
        handle.textContent
      )
    ) {
      handle.textContent =
        'Kampvuur Biltong';
    }
  };

  /* ============================================================
     Callback / WhatsApp
     ============================================================ */

  const initCallbackForm = () => {
    const form =
      qs('#callback-form');

    if (!form) return;

    let status =
      qs('.form-status', form);

    if (!status) {
      status =
        doc.createElement('p');

      status.className =
        'form-status';

      status.setAttribute(
        'role',
        'status'
      );

      status.setAttribute(
        'aria-live',
        'polite'
      );

      form.appendChild(status);
    }

    form.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        const data =
          new FormData(form);

        const name =
          String(
            data.get('name') || ''
          ).trim();

        const email =
          String(
            data.get('email') || ''
          ).trim();

        const phone =
          String(
            data.get('phone') || ''
          ).trim();

        const message = [
          'Hi Kampvuur Biltong, please call me back.',
          '',
          `Name: ${name}`,
          `Email: ${email}`,
          `Contact number: ${phone}`
        ].join('\n');

        const url =
          `https://wa.me/${PHONE_NUMBER}` +
          `?text=${
            encodeURIComponent(message)
          }`;

        status.textContent =
          'Opening WhatsApp…';

        const opened =
          window.open(
            url,
            '_blank',
            'noopener,noreferrer'
          );

        if (!opened) {
          status.textContent =
            'WhatsApp was blocked by the browser. Please allow pop-ups and try again.';
        } else {
          status.textContent =
            'WhatsApp opened with your callback request.';
        }
      }
    );
  };

  /* ============================================================
     Init
     ============================================================ */

  const init = () => {
    initBrowserBranding();
    initTheme();
    initHeader();
    initMobileNavigation();
    initScrollSpy();

    initHeroVideo();
    initHeroCTA();

    initRevealAnimations();
    initBackToTop();

    initFooter();
    initLinks();
    initCallbackForm();
  };

  if (
    doc.readyState === 'loading'
  ) {
    doc.addEventListener(
      'DOMContentLoaded',
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
