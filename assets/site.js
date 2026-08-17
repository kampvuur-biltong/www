(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const saved = (() => { try { return localStorage.getItem('kampvuur-theme'); } catch { return null; } })();
  const initial = saved === 'dark' || saved === 'light'
    ? saved
    : (matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const apply = (theme) => {
    root.dataset.theme = theme;
    toggle?.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  };
  apply(initial);
  toggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem('kampvuur-theme', next); } catch {}
  });

  const form = document.querySelector('#callback-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const message = [
      'Hi Kampvuur Biltong, please call me back.',
      `Name: ${name}`,
      `Email: ${email}`,
      `Contact number: ${phone}`
    ].join('\n');
    const url = `https://wa.me/27726275503?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();