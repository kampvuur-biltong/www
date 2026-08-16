(() => {
  const root = document.documentElement;
  const headerHost = document.querySelector('[data-site-header]');
  const footerHost = document.querySelector('[data-site-footer]');

  const sun = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0-16h1v2h-1V2Zm0 18h1v2h-1v-2ZM2 11h2v1H2v-1Zm18 0h2v1h-2v-1ZM4.22 4.93l.7-.71 1.42 1.42-.71.7-1.41-1.41Zm13.44 13.44.71-.7 1.41 1.41-.7.71-1.42-1.42Zm1.42-14.15.7.71-1.41 1.41-.71-.7 1.42-1.42ZM5.63 17.66l.71.71-1.42 1.42-.7-.71 1.41-1.42Z"/></svg>';
  const moon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.2 15.3A8.4 8.4 0 0 1 8.7 3.8 8.4 8.4 0 1 0 20.2 15.3Z"/></svg>';
  const menuIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16"/></svg>';

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
    <div class="mobile-menu" id="mobile-menu" data-mobile-menu>
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

  const getPreferredTheme = () => {
    const saved = localStorage.getItem('kampvuur-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  const themeButton = document.querySelector('[data-theme-toggle]');
  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    themeButton.innerHTML = theme === 'dark' ? sun : moon;
    themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  };
  applyTheme(getPreferredTheme());
  themeButton.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('kampvuur-theme', theme);
    applyTheme(theme);
  });

  const header = document.querySelector('[data-header]');
  const setHeader = () => header.classList.toggle('is-scrolled', scrollY > 16);
  setHeader(); addEventListener('scroll', setHeader, { passive: true });

  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  const closeMenu = () => { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
  toggle.addEventListener('click', () => {
    const open = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
  addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

  document.querySelector('[data-year]').textContent = new Date().getFullYear();
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
  }, { threshold: .12 }) : null;
  document.querySelectorAll('.reveal').forEach(el => observer ? observer.observe(el) : el.classList.add('is-visible'));
})();
