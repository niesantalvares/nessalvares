(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const saved = localStorage.getItem('ness-theme');
  if (saved === 'light') root.dataset.theme = 'light';
  const update = () => {
    const light = root.dataset.theme === 'light';
    toggle.setAttribute('aria-pressed', String(light));
    toggle.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
  };
  if (toggle) {
    update();
    toggle.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('ness-theme', root.dataset.theme);
      update();
    });
  }
})();
