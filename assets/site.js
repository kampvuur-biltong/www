(() => {
  const root = document.documentElement;
  const headerHost = document.querySelector('[data-site-header]');
  const footerHost = document.querySelector('[data-site-footer]');
  if (!headerHost || !footerHost) return;

  const sun = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0-16h1v2h-1V2Zm0 18h1v2h-1v-2ZM2 11h2v1H2v-1Zm18 0h2v1h-2v-1ZM4.22 4.93l.7-.71 1.42 1.42-.71.7-1.41-1.41Zm13.44 13.44.71-.7 1.41 1.41-.7.71-1.42-1.42Zm1.42-14.15.7.71-1.41 1.41-.71-.7 1.42-1.42ZM5.63 17.66l.71.71-1.42 1.42-.7-.71 1.41-1.42Z"/></svg>';
  const moon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.2 15.3A8.4 8.4 0 0 1 8.7 3.8 8.4 8.4 0 1 0 20.2 15.3Z"/></svg>';
  const menuIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16"/></svg>';
  const whatsappIcon = '<svg class="whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>';

  headerHost.innerHTML = `
    <header class="site-header" data-header>
      <div class="container site-header__inner">
        <a class="brand" href="#home" aria-label="Kampvuur Biltong home">
          <img src="images/Untitled%20design.svg" width="52" height="52" alt="">
          <span class="brand__text"><strong>Kampvuur Biltong</strong><small>Meat · Deli · Hoedspruit</small></span>
        </a>
        <nav class="desktop-nav" aria-label="Primary navigation">
          <a href="#products">Products</a><a href="#story">Our story</a><a href="#visit">Visit us</a>
        </nav>
        <div class="header-actions">
          <button class="icon-button" type="button" data-theme-toggle aria-label="Switch colour theme"></button>
          <a class="button button--primary" href="https://wa.me/27726275503" rel="noopener">Order / enquire</a>
          <button class="icon-button mobile-menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">${menuIcon}</button>
        </div>
      </div>
    </header>
    <div class="mobile-menu" id="mobile-menu" data-mobile-menu aria-hidden="true">
      <nav aria-label="Mobile navigation"><a href="#products">Products</a><a href="#story">Our story</a><a href="#visit">Visit us</a></nav>
      <a class="button button--primary" href="https://wa.me/27726275503" rel="noopener">Order / enquire on WhatsApp</a>
    </div>`;

  footerHost.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <img src="images/Untitled%20design.svg" width="78" height="78" alt="">
            <div><h2>Kampvuur Biltong</h2><p>Meat, deli and proper South African flavour in Hoedspruit.</p></div>
          </div>
          <div class="footer-column"><h3>Explore</h3><nav><a href="#products">Products</a><a href="#story">Our story</a><a href="#visit">Visit & contact</a></nav></div>
          <div class="footer-column"><h3>Contact</h3><nav><a href="tel:+27726275503">+27 72 627 5503</a><a href="mailto:Kampvuurquality@gmail.com">Kampvuurquality@gmail.com</a><a href="https://wa.me/27726275503" rel="noopener">WhatsApp</a></nav></div>
        </div>
        <div class="footer-bottom"><span>© <span data-year></span> Kampvuur Meat & Deli. All rights reserved.</span><span>Hoedspruit · Limpopo · South Africa</span></div>
      </div>
    </footer>`;

  document.querySelectorAll('a[href^="https://wa.me/"]').forEach((link) => {
    if (!link.querySelector('.whatsapp-icon')) link.insertAdjacentHTML('afterbegin', whatsappIcon);
    link.classList.add('has-whatsapp-icon');
  });

  const storage = {
    get(key) { try { return window.localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { window.localStorage.setItem(key, value); } catch {} }
  };
  const getPreferredTheme = () => {
    const saved = storage.get('kampvuur-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  const themeButton = document.querySelector('[data-theme-toggle]');
  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    if (!themeButton) return;
    themeButton.innerHTML = theme === 'dark' ? sun : moon;
    themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  };
  applyTheme(getPreferredTheme());
  themeButton?.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    storage.set('kampvuur-theme', theme);
    applyTheme(theme);
  });

  const header = document.querySelector('[data-header]');
  const setHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 16);
  setHeader(); addEventListener('scroll', setHeader, { passive: true });

  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  const setMenuState = (open) => {
    if (!toggle || !menu) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
  };
  const openMenu = () => {
    setMenuState(true);
  };
  const closeMenu = (restoreFocus = false) => {
    setMenuState(false);
    if (restoreFocus) setTimeout(() => toggle?.focus({ preventScroll: true }), 0);
  };
  toggle?.addEventListener('click', () => menu?.classList.contains('is-open') ? closeMenu(false) : openMenu());
  menu?.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(false); });
  addEventListener('keydown', (event) => { if (event.key === 'Escape' && menu?.classList.contains('is-open')) closeMenu(true); });
  addEventListener('resize', () => { if (innerWidth > 980 && menu?.classList.contains('is-open')) closeMenu(false); }, { passive: true });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible'); observer.unobserve(entry.target);
    }), { threshold: .12, rootMargin: '0px 0px -4% 0px' });
    reveals.forEach((el) => observer.observe(el));
  } else reveals.forEach((el) => el.classList.add('is-visible'));
})();
