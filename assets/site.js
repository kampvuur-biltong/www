/**
 * Kampvuur Biltong
 * Global UI Runtime
 *
 * Version: 2026.08.18
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
 * - Footer year/tagline
 * - External/placeholder link hardening
 * - WhatsApp callback form
 *
 * No external dependencies.
 */

(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;

  root.classList.add('js');

  /* ============================================================
     Configuration
     ============================================================ */

  const CONFIG = Object.freeze({
    icons: {
      favicon48:
        'assets/icons/favicon-48x48.png',

      apple180:
        'assets/icons/apple-touch-icon%20180%C3%97180.png',

      pwa192:
        'assets/icons/favicon-192x192.png',

      pwa512:
        'assets/icons/favicon-512x512.png'
    },

    manifest:
      'site.webmanifest',

    heroVideo:
      'images/Kampvuur%20Biltong.mp4',

    heroPoster:
      'assets/hero-campfire.webp',

    phone:
      '27726275503',

    theme: {
      light:
        '#231f20',

      dark:
        '#161311'
    },

    mobileNavigation:
      '(min-width: 821px)',

    reducedMotion:
      '(prefers-reduced-motion: reduce)',

    systemDark:
      '(prefers-color-scheme: dark)'
  });

  const reducedMotion =
    window.matchMedia
      ? window.matchMedia(
          CONFIG.reducedMotion
        )
      : null;

  const desktopNavigation =
    window.matchMedia
      ? window.matchMedia(
          CONFIG.mobileNavigation
        )
      : null;

  const systemDark =
    window.matchMedia
      ? window.matchMedia(
          CONFIG.systemDark
        )
      : null;


  /* ============================================================
     DOM utilities
     ============================================================ */

  const qs = (
    selector,
    context = doc
  ) =>
    context?.querySelector?.(
      selector
    ) ?? null;


  const qsa = (
    selector,
    context = doc
  ) =>
    context?.querySelectorAll
      ? Array.from(
          context.querySelectorAll(
            selector
          )
        )
      : [];


  const escapeHtml = (
    value
  ) => {
    const lookup = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };

    return String(value).replace(
      /[&<>"']/g,
      (character) =>
        lookup[character]
    );
  };


  const safeStorage = {
    get(key) {
      try {
        return window.localStorage
          .getItem(key);
      } catch {
        return null;
      }
    },

    set(key, value) {
      try {
        window.localStorage
          .setItem(key, value);
      } catch {
        /*
         * Storage may be disabled,
         * blocked or unavailable.
         * UI functionality should continue.
         */
      }
    },

    remove(key) {
      try {
        window.localStorage
          .removeItem(key);
      } catch {
        // Ignore unavailable storage.
      }
    }
  };


  const rafThrottle = (
    callback
  ) => {
    let queued = false;

    return (...args) => {
      if (queued) return;

      queued = true;

      const schedule =
        window.requestAnimationFrame ||
        ((fn) =>
          window.setTimeout(
            fn,
            16
          ));

      schedule(() => {
        try {
          callback(...args);
        } finally {
          queued = false;
        }
      });
    };
  };


  /**
   * MediaQueryList.addEventListener() is preferred,
   * but older Safari versions used addListener().
   */
  const addMediaListener = (
    mediaQuery,
    handler
  ) => {
    if (!mediaQuery) {
      return () => {};
    }

    if (
      typeof mediaQuery
        .addEventListener ===
      'function'
    ) {
      mediaQuery.addEventListener(
        'change',
        handler
      );

      return () =>
        mediaQuery.removeEventListener(
          'change',
          handler
        );
    }

    if (
      typeof mediaQuery
        .addListener ===
      'function'
    ) {
      mediaQuery.addListener(
        handler
      );

      return () =>
        mediaQuery.removeListener?.(
          handler
        );
    }

    return () => {};
  };


  const setInert = (
    element,
    inert
  ) => {
    if (!element) return;

    try {
      element.inert =
        Boolean(inert);
    } catch {
      // Continue using the attribute.
    }

    if (inert) {
      element.setAttribute(
        'inert',
        ''
      );
    } else {
      element.removeAttribute(
        'inert'
      );
    }
  };


  /* ============================================================
     Browser / favicon / PWA branding
     ============================================================ */

  const initBrowserBranding =
    () => {
      /*
       * IMPORTANT:
       *
       * We no longer replace every icon with the
       * original Figma/master image.
       *
       * The browser should receive appropriately
       * sized assets.
       */

      let favicon48 =
        qs(
          'link[rel="icon"][sizes="48x48"]'
        );

      /*
       * Reuse the old generic favicon declaration
       * if index.html still contains one.
       */
      if (!favicon48) {
        favicon48 =
          qs(
            'link[rel="icon"]:not([sizes])'
          );
      }

      if (!favicon48) {
        favicon48 =
          doc.createElement(
            'link'
          );

        doc.head.appendChild(
          favicon48
        );
      }

      favicon48.setAttribute(
        'rel',
        'icon'
      );

      favicon48.setAttribute(
        'type',
        'image/png'
      );

      favicon48.setAttribute(
        'sizes',
        '48x48'
      );

      favicon48.setAttribute(
        'href',
        CONFIG.icons.favicon48
      );


      /*
       * 192px icon.
       * Useful for Android/browser/PWA contexts.
       */
      let icon192 =
        qs(
          'link[rel="icon"][sizes="192x192"]'
        );

      if (!icon192) {
        icon192 =
          doc.createElement(
            'link'
          );

        icon192.rel =
          'icon';

        doc.head.appendChild(
          icon192
        );
      }

      icon192.setAttribute(
        'type',
        'image/png'
      );

      icon192.setAttribute(
        'sizes',
        '192x192'
      );

      icon192.setAttribute(
        'href',
        CONFIG.icons.pwa192
      );


      /*
       * Apple touch icon.
       */
      let appleIcon =
        qs(
          'link[rel="apple-touch-icon"][sizes="180x180"]'
        ) ||
        qs(
          'link[rel="apple-touch-icon"]'
        );

      if (!appleIcon) {
        appleIcon =
          doc.createElement(
            'link'
          );

        appleIcon.rel =
          'apple-touch-icon';

        doc.head.appendChild(
          appleIcon
        );
      }

      appleIcon.setAttribute(
        'sizes',
        '180x180'
      );

      appleIcon.setAttribute(
        'href',
        CONFIG.icons.apple180
      );


      /*
       * Ensure manifest declaration exists.
       */
      let manifest =
        qs(
          'link[rel="manifest"]'
        );

      if (!manifest) {
        manifest =
          doc.createElement(
            'link'
          );

        manifest.rel =
          'manifest';

        doc.head.appendChild(
          manifest
        );
      }

      manifest.setAttribute(
        'href',
        CONFIG.manifest
      );


      /*
       * Remove stale unsized favicon links
       * that still point at the original
       * rectangular master/logo image.
       *
       * Do not remove intentional custom icons.
       */
      qsa(
        'link[rel="icon"]:not([sizes])'
      ).forEach((icon) => {
        if (
          icon === favicon48
        ) {
          return;
        }

        const href =
          icon.getAttribute(
            'href'
          ) || '';

        if (
          href.includes(
            '1bdd38e5bc3a72b05d4523ff23ff56c8'
          ) ||
          href.includes(
            'assets/logo.png'
          )
        ) {
          icon.remove();
        }
      });
    };


  /* ============================================================
     Theme
     ============================================================ */

  const initTheme = () => {
    const toggle =
      qs(
        '[data-theme-toggle]'
      );

    let themeMeta =
      qs(
        'meta[name="theme-color"]'
      );

    if (!themeMeta) {
      themeMeta =
        doc.createElement(
          'meta'
        );

      themeMeta.name =
        'theme-color';

      doc.head.appendChild(
        themeMeta
      );
    }


    const getPreferredTheme =
      () => {
        const saved =
          safeStorage.get(
            'kampvuur-theme'
          );

        if (
          saved === 'dark' ||
          saved === 'light'
        ) {
          return saved;
        }

        return systemDark
          ?.matches
          ? 'dark'
          : 'light';
      };


    const themeIcon = (
      theme
    ) => {
      /*
       * Icon represents the action:
       * dark current theme -> show sun
       * light current theme -> show moon
       */

      if (theme === 'dark') {
        return `
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <circle
              cx="12"
              cy="12"
              r="4"
            ></circle>

            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>

            <path
              d="m4.93 4.93 1.41 1.41"
            ></path>

            <path
              d="m17.66 17.66 1.41 1.41"
            ></path>

            <path d="M2 12h2"></path>
            <path d="M20 12h2"></path>

            <path
              d="m6.34 17.66-1.41 1.41"
            ></path>

            <path
              d="m19.07 4.93-1.41 1.41"
            ></path>
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
            d="
              M21 12.79
              A9 9 0 1 1 11.21 3
              7 7 0 0 0 21 12.79Z
            "
          ></path>
        </svg>
      `;
    };


    const applyTheme = (
      theme,
      {
        persist = false
      } = {}
    ) => {
      const normalized =
        theme === 'dark'
          ? 'dark'
          : 'light';

      root.dataset.theme =
        normalized;

      themeMeta.content =
        normalized === 'dark'
          ? CONFIG.theme.dark
          : CONFIG.theme.light;


      if (toggle) {
        const next =
          normalized === 'dark'
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
          normalized === 'dark'
            ? 'true'
            : 'false'
        );

        toggle.innerHTML =
          themeIcon(
            normalized
          );
      }


      if (persist) {
        safeStorage.set(
          'kampvuur-theme',
          normalized
        );
      }


      try {
        window.dispatchEvent(
          new CustomEvent(
            'kampvuur:themechange',
            {
              detail: {
                theme:
                  normalized
              }
            }
          )
        );
      } catch {
        // CustomEvent unavailable is non-fatal.
      }
    };


    applyTheme(
      getPreferredTheme()
    );


    toggle?.addEventListener(
      'click',
      () => {
        const next =
          root.dataset.theme ===
          'dark'
            ? 'light'
            : 'dark';

        applyTheme(
          next,
          {
            persist: true
          }
        );
      }
    );


    /*
     * Follow OS theme changes only when
     * the user has not explicitly chosen
     * a stored preference.
     */
    addMediaListener(
      systemDark,
      (event) => {
        const saved =
          safeStorage.get(
            'kampvuur-theme'
          );

        if (
          saved === 'dark' ||
          saved === 'light'
        ) {
          return;
        }

        applyTheme(
          event.matches
            ? 'dark'
            : 'light'
        );
      }
    );
  };


  /* ============================================================
     Sticky / adaptive header
     ============================================================ */

  const initHeader = () => {
    const header =
      qs('.site-header');

    const body =
      doc.body;

    if (
      !header ||
      !body
    ) {
      return;
    }

    let previousY =
      Math.max(
        0,
        window.scrollY || 0
      );

    let hidden = false;


    const update = () => {
      const currentY =
        Math.max(
          0,
          window.scrollY || 0
        );

      header.classList.toggle(
        'is-scrolled',
        currentY > 32
      );


      const movingDown =
        currentY >
        previousY + 7;

      const movingUp =
        currentY <
        previousY - 7;

      const navigationOpen =
        body.classList.contains(
          'nav-open'
        );

      const keyboardInside =
        header.contains(
          doc.activeElement
        );


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

      previousY =
        currentY;
    };


    const throttled =
      rafThrottle(update);


    window.addEventListener(
      'scroll',
      throttled,
      {
        passive: true
      }
    );


    window.addEventListener(
      'resize',
      throttled,
      {
        passive: true
      }
    );


    header.addEventListener(
      'focusin',
      update
    );


    update();
  };


  /* ============================================================
     Active navigation / scroll spy
     ============================================================ */

  const initScrollSpy =
    () => {
      const navigationLinks =
        qsa(
          '.site-header nav[aria-label="Primary navigation"] a[href^="#"]'
        );


      const sectionIds =
        navigationLinks
          .map((link) =>
            (
              link.getAttribute(
                'href'
              ) || ''
            ).replace(
              /^#/,
              ''
            )
          )
          .filter(
            (id) =>
              id &&
              id !== 'top' &&
              doc.getElementById(
                id
              )
          );


      const sections =
        [
          ...new Set(
            sectionIds
          )
        ]
          .map((id) =>
            doc.getElementById(
              id
            )
          )
          .filter(Boolean);


      if (
        !sections.length ||
        !(
          'IntersectionObserver' in
          window
        )
      ) {
        return;
      }


      const ratios =
        new Map(
          sections.map(
            (section) => [
              section.id,
              0
            ]
          )
        );

      let activeId = '';


      const setActive = (
        id
      ) => {
        if (
          !id ||
          activeId === id
        ) {
          return;
        }

        activeId = id;


        qsa(
          '.site-header a[href^="#"], ' +
          '.mobile-nav-drawer a[href^="#"]'
        ).forEach(
          (link) => {
            const isActive =
              link.getAttribute(
                'href'
              ) ===
              `#${id}`;

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
          }
        );
      };


      const observer =
        new IntersectionObserver(
          (entries) => {
            entries.forEach(
              (entry) => {
                ratios.set(
                  entry.target.id,
                  entry.isIntersecting
                    ? entry
                        .intersectionRatio
                    : 0
                );
              }
            );


            const mostVisible =
              [...ratios.entries()]
                .filter(
                  ([, ratio]) =>
                    ratio > 0
                )
                .sort(
                  (a, b) =>
                    b[1] - a[1]
                )[0];


            if (mostVisible) {
              setActive(
                mostVisible[0]
              );
            }
          },
          {
            rootMargin:
              '-20% 0px -58% 0px',

            threshold: [
              0.01,
              0.08,
              0.15,
              0.3,
              0.5,
              0.75
            ]
          }
        );


      sections.forEach(
        (section) =>
          observer.observe(
            section
          )
      );
    };


  /* ============================================================
     Mobile navigation
     ============================================================ */

  const initMobileNavigation =
    () => {
      const body =
        doc.body;

      const header =
        qs(
          '.site-header'
        );

      const headerInner =
        qs(
          '.header-inner',
          header
        );

      const primaryNav =
        qs(
          'nav[aria-label="Primary navigation"]',
          header
        );

      const themeToggle =
        qs(
          '[data-theme-toggle]',
          header
        );


      if (
        !body ||
        !header ||
        !headerInner ||
        !primaryNav
      ) {
        return;
      }


      /*
       * Prevent duplicate UI if the script
       * is accidentally evaluated twice.
       */
      if (
        qs(
          '#kampvuur-mobile-navigation'
        ) ||
        qs(
          '.menu-toggle'
        )
      ) {
        return;
      }


      const menuButton =
        doc.createElement(
          'button'
        );

      menuButton.type =
        'button';

      menuButton.className =
        'menu-toggle';

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
        <span
          class="menu-toggle-lines"
          aria-hidden="true"
        >
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
        doc.createElement(
          'button'
        );

      backdrop.type =
        'button';

      backdrop.className =
        'mobile-nav-backdrop';

      backdrop.setAttribute(
        'aria-label',
        'Close navigation menu'
      );

      backdrop.tabIndex =
        -1;


      const drawer =
        doc.createElement(
          'aside'
        );

      drawer.className =
        'mobile-nav-drawer';

      drawer.id =
        'kampvuur-mobile-navigation';

      drawer.setAttribute(
        'role',
        'dialog'
      );

      drawer.setAttribute(
        'aria-modal',
        'true'
      );

      drawer.setAttribute(
        'aria-label',
        'Kampvuur navigation'
      );

      drawer.setAttribute(
        'aria-hidden',
        'true'
      );


      const brandImage =
        qs(
          '.brand img',
          header
        );


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
                  brandImage.getAttribute(
                    'src'
                  ) ||
                  'assets/logo.png'
                )}"
                alt="Kampvuur Biltong"
                decoding="async"
              >
            </a>
          `
          : '';


      const navLinks =
        qsa(
          'a',
          primaryNav
        )
          .map(
            (link) => {
              const href =
                link.getAttribute(
                  'href'
                ) || '#';

              const label =
                link.textContent
                  .trim();

              return `
                <a
                  href="${escapeHtml(
                    href
                  )}"
                >
                  <span>
                    ${escapeHtml(
                      label
                    )}
                  </span>

                  <span
                    class="mobile-nav-arrow"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </a>
              `;
            }
          )
          .join('');


      drawer.innerHTML = `
        <div class="mobile-nav-head">

          ${brandMarkup}

          <button
            class="mobile-nav-close"
            type="button"
            aria-label="Close navigation menu"
          >
            <span aria-hidden="true">
              ×
            </span>
          </button>

        </div>

        <nav
          aria-label="Mobile primary navigation"
        >
          ${navLinks}
        </nav>

        <div class="mobile-nav-actions">

          <a
            class="mobile-nav-cta"
            href="#products"
          >
            <span>
              Discover Our Biltong
            </span>

            <span aria-hidden="true">
              →
            </span>
          </a>

          <a
            class="mobile-nav-contact"
            href="tel:+${CONFIG.phone}"
          >
            Call Kampvuur
          </a>

        </div>

        <p class="mobile-nav-tagline">
          The Taste of Tradition
        </p>
      `;


      body.appendChild(
        backdrop
      );

      body.appendChild(
        drawer
      );


      const closeButton =
        qs(
          '.mobile-nav-close',
          drawer
        );


      const focusableSelector =
        [
          'a[href]',
          'button:not([disabled])',
          'input:not([disabled])',
          'select:not([disabled])',
          'textarea:not([disabled])',
          '[tabindex]:not([tabindex="-1"])'
        ].join(',');


      const getFocusable =
        () =>
          qsa(
            focusableSelector,
            drawer
          ).filter(
            (element) =>
              element
                .getClientRects()
                .length > 0 &&
              !element.hasAttribute(
                'disabled'
              )
          );


      const main =
        qs('main');

      const footer =
        qs(
          '.site-footer'
        );


      const inertStates = [
        main,
        footer
      ]
        .filter(Boolean)
        .map(
          (element) => ({
            element,
            wasInert:
              element.hasAttribute(
                'inert'
              )
          })
        );


      let previousFocus =
        null;

      let previousBodyPadding =
        '';


      const lockPageScroll =
        () => {
          previousBodyPadding =
            body.style
              .paddingRight;

          const scrollbarWidth =
            Math.max(
              0,
              window.innerWidth -
              root.clientWidth
            );

          if (
            scrollbarWidth > 0
          ) {
            const currentPadding =
              Number.parseFloat(
                window
                  .getComputedStyle(
                    body
                  )
                  .paddingRight
              ) || 0;

            body.style.paddingRight =
              `${
                currentPadding +
                scrollbarWidth
              }px`;
          }

          body.classList.add(
            'nav-open'
          );
        };


      const unlockPageScroll =
        () => {
          body.classList.remove(
            'nav-open'
          );

          body.style.paddingRight =
            previousBodyPadding;
        };


      const setBackgroundInert =
        (inert) => {
          inertStates.forEach(
            ({
              element,
              wasInert
            }) => {
              if (inert) {
                setInert(
                  element,
                  true
                );
              } else if (
                !wasInert
              ) {
                setInert(
                  element,
                  false
                );
              }
            }
          );
        };


      const openMenu = () => {
        if (
          body.classList.contains(
            'nav-open'
          )
        ) {
          return;
        }

        previousFocus =
          doc.activeElement;


        lockPageScroll();

        setBackgroundInert(
          true
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


        window.requestAnimationFrame(
          () => {
            closeButton?.focus();
          }
        );
      };


      const closeMenu = ({
        restoreFocus = true
      } = {}) => {
        if (
          !body.classList.contains(
            'nav-open'
          )
        ) {
          return;
        }


        unlockPageScroll();

        setBackgroundInert(
          false
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


        if (
          restoreFocus &&
          previousFocus instanceof
            HTMLElement
        ) {
          window
            .requestAnimationFrame(
              () =>
                previousFocus
                  ?.focus?.()
            );
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


      closeButton
        ?.addEventListener(
          'click',
          () =>
            closeMenu()
        );


      backdrop.addEventListener(
        'click',
        () =>
          closeMenu()
      );


      qsa(
        'a',
        drawer
      ).forEach(
        (link) => {
          link.addEventListener(
            'click',
            () => {
              closeMenu({
                restoreFocus:
                  false
              });
            }
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


          if (
            event.key ===
            'Escape'
          ) {
            event.preventDefault();

            closeMenu();

            return;
          }


          if (
            event.key !==
            'Tab'
          ) {
            return;
          }


          const focusable =
            getFocusable();


          if (
            !focusable.length
          ) {
            event.preventDefault();

            closeButton?.focus();

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
            doc.activeElement ===
              first
          ) {
            event.preventDefault();

            last.focus();
          } else if (
            !event.shiftKey &&
            doc.activeElement ===
              last
          ) {
            event.preventDefault();

            first.focus();
          }
        }
      );


      addMediaListener(
        desktopNavigation,
        (event) => {
          if (event.matches) {
            closeMenu({
              restoreFocus:
                false
            });
          }
        }
      );


      window.addEventListener(
        'pagehide',
        () => {
          if (
            body.classList.contains(
              'nav-open'
            )
          ) {
            closeMenu({
              restoreFocus:
                false
            });
          }
        }
      );
    };


  /* ============================================================
     Hero video
     ============================================================ */

  const initHeroVideo =
    () => {
      const hero =
        qs('.hero');

      const media =
        qs(
          '.hero-media',
          hero
        );

      const poster =
        qs(
          '.hero-poster, img',
          media
        );


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
          doc.createElement(
            'video'
          );

        video.className =
          'hero-video';

        video.dataset
          .heroVideo = '';

        media.appendChild(
          video
        );
      }


      /*
       * Enforce all required background-video
       * properties even if the video was already
       * authored into index.html.
       */

      video.autoplay =
        true;

      video.muted =
        true;

      video.defaultMuted =
        true;

      video.loop =
        true;

      video.playsInline =
        true;

      video.preload =
        'metadata';

      video.poster =
        poster.getAttribute(
          'src'
        ) ||
        CONFIG.heroPoster;


      video.setAttribute(
        'autoplay',
        ''
      );

      video.setAttribute(
        'muted',
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
        'preload',
        'metadata'
      );

      video.setAttribute(
        'aria-hidden',
        'true'
      );

      video.setAttribute(
        'tabindex',
        '-1'
      );


      let source =
        qs(
          'source[type="video/mp4"]',
          video
        );


      if (!source) {
        source =
          doc.createElement(
            'source'
          );

        source.type =
          'video/mp4';

        video.appendChild(
          source
        );
      }


      if (
        !source.getAttribute(
          'src'
        )
      ) {
        source.src =
          CONFIG.heroVideo;
      }


      let heroVisible =
        true;


      const canPlay = () =>
        !reducedMotion
          ?.matches &&
        heroVisible &&
        !doc.hidden;


      const showPoster = () => {
        media.classList.remove(
          'video-ready'
        );
      };


      const showVideo = () => {
        if (
          reducedMotion
            ?.matches
        ) {
          return;
        }

        media.classList.add(
          'has-video',
          'video-ready'
        );
      };


      const playVideo = () => {
        if (!canPlay()) {
          video.pause();

          return;
        }


        /*
         * Ensure property remains muted before
         * every autoplay attempt.
         */
        video.muted =
          true;


        try {
          const playback =
            video.play();

          playback?.catch?.(
            () => {
              /*
               * Autoplay was rejected.
               * Keep the poster visible instead
               * of presenting a broken hero.
               */
              showPoster();
            }
          );
        } catch {
          showPoster();
        }
      };


      const syncMotion =
        () => {
          if (
            reducedMotion
              ?.matches
          ) {
            video.pause();

            media.classList.add(
              'is-motion-reduced'
            );

            showPoster();

            return;
          }


          media.classList.remove(
            'is-motion-reduced'
          );

          playVideo();
        };


      /*
       * Only fade out the poster once
       * playback genuinely starts.
       */
      video.addEventListener(
        'playing',
        showVideo
      );


      video.addEventListener(
        'loadeddata',
        () => {
          media.classList.add(
            'has-video'
          );
        }
      );


      video.addEventListener(
        'error',
        () => {
          video.pause();

          media.classList.remove(
            'has-video',
            'video-ready'
          );

          media.classList.add(
            'video-error'
          );
        }
      );


      source.addEventListener(
        'error',
        () => {
          media.classList.remove(
            'has-video',
            'video-ready'
          );

          media.classList.add(
            'video-error'
          );
        }
      );


      /*
       * If playback had already started before
       * listeners were attached, synchronize
       * the CSS state immediately.
       */
      if (
        !video.paused &&
        video.readyState >= 2
      ) {
        showVideo();
      }


      if (
        'IntersectionObserver' in
        window
      ) {
        const observer =
          new IntersectionObserver(
            (entries) => {
              const entry =
                entries[0];

              if (!entry) {
                return;
              }


              heroVisible =
                entry
                  .isIntersecting &&
                entry
                  .intersectionRatio >
                  0.04;


              if (
                heroVisible
              ) {
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


        observer.observe(
          hero
        );
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


      window.addEventListener(
        'pagehide',
        () => {
          video.pause();
        }
      );


      addMediaListener(
        reducedMotion,
        syncMotion
      );


      syncMotion();
    };


  /* ============================================================
     Hero CTA
     ============================================================ */

  const initHeroCTA =
    () => {
      const cta =
        qs(
          '.hero .btn-dark'
        );

      if (!cta) {
        return;
      }


      cta.classList.add(
        'hero-cta'
      );


      if (
        !qs(
          '.btn-arrow',
          cta
        )
      ) {
        const arrow =
          doc.createElement(
            'span'
          );

        arrow.className =
          'btn-arrow';

        arrow.setAttribute(
          'aria-hidden',
          'true'
        );

        arrow.textContent =
          '→';

        cta.appendChild(
          arrow
        );
      }
    };


  /* ============================================================
     Scroll reveal
     ============================================================ */

  const initRevealAnimations =
    () => {
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
          (selector) =>
            qsa(selector)
        );


      const unique =
        [
          ...new Set(
            elements
          )
        ];


      if (!unique.length) {
        return;
      }


      unique.forEach(
        (
          element,
          index
        ) => {
          element.classList.add(
            'reveal'
          );

          element.style
            .setProperty(
              '--reveal-delay',
              `${
                (
                  index %
                  6
                ) * 45
              }ms`
            );
        }
      );


      const revealAll =
        () => {
          unique.forEach(
            (element) =>
              element.classList.add(
                'is-visible'
              )
          );
        };


      if (
        reducedMotion
          ?.matches ||
        !(
          'IntersectionObserver' in
          window
        )
      ) {
        revealAll();

        return;
      }


      const observer =
        new IntersectionObserver(
          (
            entries,
            instance
          ) => {
            entries.forEach(
              (entry) => {
                if (
                  !entry
                    .isIntersecting
                ) {
                  return;
                }

                entry.target
                  .classList.add(
                    'is-visible'
                  );

                instance.unobserve(
                  entry.target
                );
              }
            );
          },
          {
            rootMargin:
              '0px 0px -8% 0px',

            threshold:
              0.08
          }
        );


      unique.forEach(
        (element) =>
          observer.observe(
            element
          )
      );


      addMediaListener(
        reducedMotion,
        (event) => {
          if (
            event.matches
          ) {
            revealAll();

            observer.disconnect();
          }
        }
      );
    };


  /* ============================================================
     Back to top
     ============================================================ */

  const initBackToTop =
    () => {
      const body =
        doc.body;

      if (!body) {
        return;
      }


      let button =
        qs(
          '.back-to-top'
        );


      if (!button) {
        button =
          doc.createElement(
            'button'
          );

        button.type =
          'button';

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
            <path
              d="m18 15-6-6-6 6"
            ></path>
          </svg>
        `;

        body.appendChild(
          button
        );
      }


      const update =
        rafThrottle(
          () => {
            button.classList.toggle(
              'is-visible',
              (
                window.scrollY ||
                0
              ) > 650
            );
          }
        );


      window.addEventListener(
        'scroll',
        update,
        {
          passive: true
        }
      );


      button.addEventListener(
        'click',
        () => {
          window.scrollTo({
            top: 0,

            behavior:
              reducedMotion
                ?.matches
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

  const initFooter =
    () => {
      const footer =
        qs(
          '.site-footer'
        );

      if (!footer) {
        return;
      }


      const year =
        String(
          new Date()
            .getFullYear()
        );


      /*
       * Preferred modern structure.
       */
      qsa(
        '[data-current-year]',
        footer
      ).forEach(
        (element) => {
          element.textContent =
            year;
        }
      );


      /*
       * Backwards compatibility with the
       * current footer HTML.
       */
      const copyright =
        qs(
          '.footer-inner > p',
          footer
        ) ||
        qs(
          '.footer-bottom p',
          footer
        );


      if (copyright) {
        copyright.innerHTML =
          copyright.innerHTML
            .replace(
              /(Copyright\s*)?©\s*\d{4}/i,
              (match) =>
                match.replace(
                  /\d{4}/,
                  year
                )
            );
      }


      /*
       * Current footer compatibility.
       *
       * If the richer footer HTML already
       * contains its own tagline, nothing
       * is inserted.
       */
      const logo =
        qs(
          '.footer-inner > img',
          footer
        );


      if (
        logo &&
        !qs(
          '.footer-tagline',
          footer
        )
      ) {
        const tagline =
          doc.createElement(
            'span'
          );

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
     Link hardening
     ============================================================ */

  const initLinks =
    () => {
      /*
       * Secure all links that intentionally
       * open in another browsing context.
       */
      qsa(
        'a[target="_blank"]'
      ).forEach(
        (link) => {
          const existing =
            (
              link.getAttribute(
                'rel'
              ) || ''
            )
              .split(/\s+/)
              .filter(Boolean);


          const tokens =
            new Set(
              existing
            );


          tokens.add(
            'noopener'
          );

          tokens.add(
            'noreferrer'
          );


          link.setAttribute(
            'rel',
            [
              ...tokens
            ].join(' ')
          );
        }
      );


      /*
       * Legacy placeholder social links
       * should never navigate the page to "#".
       */
      qsa(
        '.social-row a[href="#"]'
      ).forEach(
        (link) => {
          link.classList.add(
            'is-placeholder'
          );

          link.setAttribute(
            'aria-disabled',
            'true'
          );

          link.setAttribute(
            'tabindex',
            '-1'
          );

          link.addEventListener(
            'click',
            (event) => {
              event.preventDefault();
            }
          );
        }
      );


      /*
       * Remove legacy Canva/demo handle if
       * it still exists anywhere in the hero.
       */
      const socialHandle =
        qs(
          '.social-row span'
        );


      if (
        socialHandle &&
        /reallygreatsite/i.test(
          socialHandle.textContent ||
          ''
        )
      ) {
        socialHandle.textContent =
          'Kampvuur Biltong';
      }
    };


  /* ============================================================
     Callback / WhatsApp
     ============================================================ */

  const initCallbackForm =
    () => {
      const form =
        qs(
          '#callback-form'
        );


      if (!form) {
        return;
      }


      /*
       * Avoid duplicate listeners.
       */
      if (
        form.dataset
          .kampvuurReady ===
        'true'
      ) {
        return;
      }


      form.dataset
        .kampvuurReady =
        'true';


      let status =
        qs(
          '.form-status',
          form
        );


      if (!status) {
        status =
          doc.createElement(
            'p'
          );

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

        status.setAttribute(
          'aria-atomic',
          'true'
        );

        form.appendChild(
          status
        );
      }


      form.addEventListener(
        'submit',
        (event) => {
          event.preventDefault();


          if (
            !form.checkValidity()
          ) {
            form.reportValidity();

            qs(
              ':invalid',
              form
            )?.focus?.();

            status.textContent =
              'Please complete the required fields.';

            return;
          }


          const data =
            new FormData(
              form
            );


          const name =
            String(
              data.get(
                'name'
              ) || ''
            ).trim();


          const email =
            String(
              data.get(
                'email'
              ) || ''
            ).trim();


          const phone =
            String(
              data.get(
                'phone'
              ) || ''
            ).trim();


          const message = [
            'Hi Kampvuur Biltong, please call me back.',
            '',
            `Name: ${name}`,
            `Email: ${email}`,
            `Contact number: ${phone}`
          ].join('\n');


          const url =
            `https://wa.me/${
              CONFIG.phone
            }?text=${
              encodeURIComponent(
                message
              )
            }`;


          status.textContent =
            'Opening WhatsApp…';


          /*
           * noopener may intentionally cause
           * window.open() to return null in some
           * browsers even when the tab opens.
           *
           * Therefore null is NOT automatically
           * treated as a failed popup.
           */
          let opened =
            null;


          try {
            opened =
              window.open(
                url,
                '_blank',
                'noopener,noreferrer'
              );
          } catch {
            opened =
              null;
          }


          if (opened) {
            try {
              opened.opener =
                null;
            } catch {
              // noopener is already enforced.
            }
          }


          status.textContent =
            'Your WhatsApp callback request has been prepared.';


          /*
           * Preserve URL for automated UI tests
           * and debugging without exposing
           * private form values elsewhere.
           */
          form.dataset
            .lastSubmission =
            'whatsapp';
        }
      );
    };


  /* ============================================================
     Initialization
     ============================================================ */

  const init = () => {
    /*
     * Global guard against duplicate script
     * execution.
     */
    if (
      window
        .__kampvuurUIInitialized
    ) {
      return;
    }


    window
      .__kampvuurUIInitialized =
      true;


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
    doc.readyState ===
    'loading'
  ) {
    doc.addEventListener(
      'DOMContentLoaded',
      init,
      {
        once: true
      }
    );
  } else {
    init();
  }
})();
