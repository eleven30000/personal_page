/* ===== SCROLL LINK (anchor) ===== */
document.querySelectorAll('a.scroll-link, .project-tabs a').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    const offset = document.getElementById('main-nav')?.offsetHeight || 68;
    const top = target.getBoundingClientRect().top + window.scrollY - offset - 12;
    window.scrollTo({ top, behavior: 'smooth' });
    // close mobile menu
    document.getElementById('nav-links')?.classList.remove('open');
    document.getElementById('nav-toggle')?.classList.remove('open');
  });
});

/* ===== SCROLLSPY — highlight active nav section ===== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], article[id]');
  const navLinks = document.querySelectorAll('.nav-links a[data-section]');
  const offset = 90;

  function onScroll() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - offset) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.dataset.section === current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ===== NAV SCROLL SHADOW ===== */
function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 20
      ? 'rgba(255,255,255,0.95)'
      : 'rgba(255,255,255,0.85)';
    nav.style.boxShadow = window.scrollY > 20
      ? '0 2px 12px rgba(15,23,42,0.06)'
      : 'none';
  }, { passive: true });
}

/* ===== MOBILE NAV TOGGLE ===== */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      toggle.classList.remove('open');
    }
  });
}

/* ===== SCROLL PROGRESS BAR ===== */
function initScrollProgress() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  let bar = nav.querySelector('.scroll-progress-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'scroll-progress-bar';
    nav.appendChild(bar);
  }

  let ticking = false;
  function updateProgress() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    bar.style.width = Math.min(100, Math.max(0, progress)) + '%';
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();
}

/* ===== SCROLL REVEAL ===== */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ===== STAT COUNTER ANIMATION ===== */
function initStatCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  // Respect user reduced-motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStat(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  statNumbers.forEach(el => observer.observe(el));

  function animateStat(el) {
    const rawText = el.textContent.trim();

    // Fraction format e.g. "9/9"
    const fractionMatch = rawText.match(/^(\d+)\/(\d+)$/);
    if (fractionMatch) {
      const targetNum = parseInt(fractionMatch[1], 10);
      const totalNum = fractionMatch[2];
      const duration = 1200;
      const startTime = performance.now();

      function updateFraction(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
        const current = Math.round(targetNum * ease);
        el.textContent = `${current}/${totalNum}`;
        if (progress < 1) {
          requestAnimationFrame(updateFraction);
        } else {
          el.textContent = rawText;
        }
      }
      requestAnimationFrame(updateFraction);
      return;
    }

    // Number format with possible prefix and suffix e.g. "+6pp", "47.4%", "1575.89", "6min", "24%"
    const numMatch = rawText.match(/^([^\d.]*)(\d+(?:\.\d+)?)([^\d.]*)$/);
    if (!numMatch) return;

    const prefix = numMatch[1];
    const targetVal = parseFloat(numMatch[2]);
    const suffix = numMatch[3];
    const decimals = numMatch[2].includes('.') ? numMatch[2].split('.')[1].length : 0;

    const duration = 1200;
    const startTime = performance.now();

    function updateNumber(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      const current = (targetVal * ease).toFixed(decimals);
      el.textContent = `${prefix}${current}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        el.textContent = rawText;
      }
    }
    requestAnimationFrame(updateNumber);
  }
}

/* ===== MODEL OUTPUT SWITCHER — Tab Interaction ===== */
function initModelSwitcher() {
  const switcher = document.getElementById('modelSwitcher');
  if (!switcher) return;

  switcher.querySelectorAll('.sw-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;

      // update tab active state
      switcher.querySelectorAll('.sw-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // show/hide panels
      switcher.querySelectorAll('.sw-panel').forEach(panel => {
        if (panel.id === targetId) {
          panel.hidden = false;
        } else {
          panel.hidden = true;
        }
      });
    });
  });
}

/* ===== LIGHTBOX MODAL (Expand image & Click blank to restore) ===== */
function initLightboxModal() {
  const modal = document.getElementById('archModal');
  const closeBtn = document.getElementById('closeArchModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  if (!modal) return;

  function open(src, caption) {
    if (lightboxImg && src) {
      lightboxImg.src = src;
    }
    if (lightboxCaption && caption) {
      lightboxCaption.textContent = caption;
    }
    modal.style.display = 'flex';
    void modal.offsetWidth; // force reflow for smooth CSS transition
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!modal.classList.contains('active')) {
        modal.style.display = 'none';
      }
    }, 250);
  }

  // Support all triggers: .open-lightbox-trigger, .open-arch-trigger, or any element with data-full
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.open-lightbox-trigger, .open-arch-trigger');
    if (trigger) {
      e.preventDefault();
      const fullSrc = trigger.dataset.full || trigger.querySelector('img')?.src || trigger.getAttribute('src');
      const caption = trigger.dataset.caption || trigger.querySelector('img')?.alt || trigger.getAttribute('alt') || '';
      open(fullSrc, caption);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const activeEl = document.activeElement;
      if (activeEl && activeEl.matches('.open-lightbox-trigger, .open-arch-trigger')) {
        e.preventDefault();
        const fullSrc = activeEl.dataset.full || activeEl.querySelector('img')?.src || activeEl.getAttribute('src');
        const caption = activeEl.dataset.caption || activeEl.querySelector('img')?.alt || activeEl.getAttribute('alt') || '';
        open(fullSrc, caption);
      }
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', close);

  // Click on blank space (anywhere except the image itself) restores/closes
  modal.addEventListener('click', (e) => {
    if (!e.target.closest('.lightbox-img')) {
      close();
    }
  });

  // ESC key restores/closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      close();
    }
  });
}

/* ===== UNIFIED DOM READY INITIALIZATION ===== */
document.addEventListener('DOMContentLoaded', () => {
  initScrollSpy();
  initNavScroll();
  initMobileNav();
  initScrollProgress();
  initReveal();
  initStatCounter();
  initModelSwitcher();
  initLightboxModal();
});
