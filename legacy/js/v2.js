(function () {
  const toggle = document.querySelector('.v2-nav-toggle');
  const nav = document.querySelector('.v2-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.v2-nav-links a, .v2-nav-actions a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();

(function () {
  const nums = document.querySelectorAll('.v2-stat-number');
  if (!nums.length) return;

  nums.forEach(el => {
    const span = el.querySelector('span');
    const suffix = span ? span.outerHTML : '';
    const raw = (el.firstChild && el.firstChild.nodeValue || '').trim();
    const match = raw.match(/^(\D*)(\d+(?:\.\d+)?)/);
    if (!match) return;
    const prefix = match[1];
    const target = parseFloat(match[2]);
    el.dataset.prefix = prefix;
    el.dataset.target = String(target);
    el.dataset.suffix = suffix;
    el.textContent = prefix + '0';
    if (span) el.insertAdjacentHTML('beforeend', suffix);
  });

  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  const animate = el => {
    const target = parseFloat(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const val = Math.round(target * easeOutCubic(t));
      el.innerHTML = prefix + val + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animate(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  nums.forEach(el => io.observe(el));
})();
