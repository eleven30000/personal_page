/* ===================================================
   CYBER-COSMIC INTERACTIVE SCRIPTS & ANIMATIONS
   =================================================== */

/* ===== SCROLL LINK (Smooth Anchor Scroll) ===== */
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
  const sectionIds = ['home', 'about', 'projects', 'contact'];
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const navLinks = document.querySelectorAll('.nav-links a[data-section]');
  const navHeight = document.getElementById('main-nav')?.offsetHeight || 68;

  function updateActive(activeId) {
    navLinks.forEach(a => {
      a.classList.toggle('active', a.dataset.section === activeId);
    });
  }

  function onScroll() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // Edge check: near bottom of page -> contact
    if (scrollY + windowHeight >= docHeight - 60) {
      updateActive('contact');
      return;
    }

    // Edge check: near top of page -> home
    if (scrollY < 120) {
      updateActive('home');
      return;
    }

    // Probe position: slightly below sticky nav
    const probeY = scrollY + navHeight + 80;
    let current = '';

    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (probeY >= top && probeY < top + height) {
        current = sec.id;
        break;
      }
    }

    // In-between section dividers fallback
    if (!current) {
      for (let i = sections.length - 1; i >= 0; i--) {
        if (probeY >= sections[i].offsetTop) {
          current = sections[i].id;
          break;
        }
      }
    }

    updateActive(current || 'home');
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
}

/* ===== NAV SCROLL SHADOW & BLUR ===== */
function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 20
      ? 'rgba(7, 10, 19, 0.94)'
      : 'rgba(7, 10, 19, 0.85)';
    nav.style.boxShadow = window.scrollY > 20
      ? '0 4px 20px rgba(0, 0, 0, 0.6)'
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

/* ===== STAT COUNTER ANIMATION (with Glow Pulse) ===== */
function initStatCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

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

  function triggerFinishPulse(el) {
    el.style.transition = 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), filter 0.22s ease';
    el.style.transform = 'scale(1.08)';
    el.style.filter = 'drop-shadow(0 0 16px var(--neon-cyan))';
    setTimeout(() => {
      el.style.transform = 'scale(1)';
      el.style.filter = '';
    }, 240);
  }

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
          triggerFinishPulse(el);
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
        triggerFinishPulse(el);
      }
    }
    requestAnimationFrame(updateNumber);
  }
}

/* ===== CANVAS STARFIELD BACKGROUND (with Mouse Parallax) ===== */
function initStarfield() {
  const canvas = document.getElementById('starfieldCanvas');
  if (!canvas) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Generate 80 stars with different depths
  const starCount = Math.min(90, Math.floor((width * height) / 12000));
  const stars = [];

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.4,
      baseAlpha: Math.random() * 0.7 + 0.25,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
      depth: Math.random() * 0.8 + 0.2, // for parallax
      color: Math.random() > 0.6 ? '#67e8f9' : (Math.random() > 0.4 ? '#c084fc' : '#ffffff')
    });
  }

  let mouseX = 0;
  let mouseY = 0;
  let offsetX = 0;
  let offsetY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX - width / 2) * 0.04;
    mouseY = (e.clientY - height / 2) * 0.04;
  }, { passive: true });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  let time = 0;
  function render() {
    time += 1;
    ctx.clearRect(0, 0, width, height);

    // Smooth lerp for parallax
    offsetX += (mouseX - offsetX) * 0.05;
    offsetY += (mouseY - offsetY) * 0.05;

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      const alpha = star.baseAlpha + Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.25;
      const curX = (star.x + offsetX * star.depth + width) % width;
      const curY = (star.y + offsetY * star.depth + height) % height;

      ctx.fillStyle = star.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
      ctx.beginPath();
      ctx.arc(curX, curY, star.size, 0, Math.PI * 2);
      ctx.fill();

      // Soft glow for larger stars
      if (star.size > 1.4) {
        ctx.globalAlpha = alpha * 0.35;
        ctx.beginPath();
        ctx.arc(curX, curY, star.size * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

/* ===== 3D CARD TILT INTERACTION (Scoped to About & Contact cards) ===== */
function init3DCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // Skip on mobile/touch
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tiltCards = document.querySelectorAll('#about .card, #contact .card, .skills-grid .card, .edu-float');
  tiltCards.forEach(card => {
    // Explicitly exclude any element inside #projects or .project-block
    if (card.closest('#projects') || card.closest('.project-block')) return;

    let bounds = null;

    card.addEventListener('mouseenter', () => {
      bounds = card.getBoundingClientRect();
      card.style.transition = 'transform 0.1s ease-out, box-shadow 0.25s ease';
    });

    card.addEventListener('mousemove', e => {
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const xPct = (mouseX / bounds.width - 0.5) * 2; // -1 to 1
      const yPct = (mouseY / bounds.height - 0.5) * 2; // -1 to 1

      const tiltX = -yPct * 6; // max ±6 deg
      const tiltY = xPct * 6;

      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      bounds = null;
    });
  });
}

/* ===== STARDUST CURSOR TRAIL & CLICK BURST ===== */
function initStardustCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // Desktop only
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'cursorCanvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  const particles = [];
  const colors = ['#c084fc', '#67e8f9', '#fbcfe8', '#fde047'];

  let lastX = null;
  let lastY = null;

  window.addEventListener('mousemove', e => {
    const x = e.clientX;
    const y = e.clientY;

    if (lastX !== null) {
      const dist = Math.hypot(x - lastX, y - lastY);
      // Spawn a star particle every ~8px movement
      if (dist > 8 && particles.length < 50) {
        particles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          size: Math.random() * 2.2 + 0.8,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 0.8,
          vy: Math.random() * 0.6 + 0.2,
          life: 1,
          decay: Math.random() * 0.035 + 0.02
        });
      }
    }
    lastX = x;
    lastY = y;
  }, { passive: true });

  // Click burst starburst
  window.addEventListener('click', e => {
    const x = e.clientX;
    const y = e.clientY;
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.2;
      const speed = Math.random() * 2.5 + 1.2;
      particles.push({
        x: x,
        y: y,
        size: Math.random() * 2.5 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: Math.random() * 0.03 + 0.025
      });
    }
  }, { passive: true });

  function renderCursor() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life * 0.75;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);
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
  initStarfield();
  init3DCardTilt();
  initStardustCursor();
  initModelSwitcher();
  initLightboxModal();
});
