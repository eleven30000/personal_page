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
      ? 'rgba(10,14,26,0.98)'
      : 'rgba(10,14,26,0.85)';
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

/* ===== SCROLL REVEAL ===== */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initScrollSpy();
  initNavScroll();
  initMobileNav();
  initReveal();
});

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

document.addEventListener('DOMContentLoaded', initModelSwitcher);

/* ===== ARCHITECTURE LIGHTBOX MODAL ===== */
function initArchModal() {
  const triggers = document.querySelectorAll('.open-arch-trigger');
  const modal = document.getElementById('archModal');
  const closeBtn = document.getElementById('closeArchModal');
  if (!modal || triggers.length === 0) return;

  function open() {
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

  triggers.forEach(trig => {
    trig.addEventListener('click', open);
    trig.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
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

document.addEventListener('DOMContentLoaded', initArchModal);
