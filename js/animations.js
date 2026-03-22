/**
 * Animations Module — Looks Salon
 * Handles: scroll-reveal, stat counters, scroll progress bar,
 *          staggered tile entrances, active nav highlighting.
 */

export function initAnimations() {
  initScrollProgress();
  initScrollReveal();
  initStatCounters();
  initStaggeredTiles();
  initActiveNavLinks();
  initAmbientOrbs();
}

/* ─── 1. SCROLL PROGRESS BAR ─── */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ─── 2. SCROLL-REVEAL ─── */
function initScrollReveal() {
  // Add data-reveal attributes to key elements
  const revealMap = [
    // Stats section
    { sel: '.stat',                   anim: 'fade-up',    delay: 0.1 },
/*
    // Services section
    { sel: '.svc-header-wrap .ey',    anim: 'fade-up',    delay: 0   },
    { sel: '.svc-big-title',          anim: 'fade-up',    delay: 0.1 },

    // Gallery section
    { sel: '.gal-hd .ey',             anim: 'fade-up',    delay: 0   },
    { sel: '.gal-hd .st',             anim: 'fade-up',    delay: 0.1 },
    { sel: '.gal-photo-card',         anim: 'fade-up',    delay: 0.05, noStagger: true },
    { sel: '.gal-cta',                anim: 'fade-up',    delay: 0.2 },

    // Testimonials section
    { sel: '.test-head .st',          anim: 'fade-up',    delay: 0.1 },
    { sel: '.test-card',              anim: 'fade-up',    delay: 0.1,  noStagger: true },

    // Footer
    { sel: '.f-col-inner',            anim: 'fade-up',    delay: 0   },*/
    ];

    revealMap.forEach(({ sel, anim, delay, noStagger }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('sr-hidden');
      el.dataset.srAnim = anim;
      // Stagger only if requested (default to stagger)
      const finalDelay = noStagger ? delay : (delay + i * 0.08);
      el.style.setProperty('--sr-delay', finalDelay + 's');
    });
    });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('sr-visible');
        el.classList.remove('sr-hidden');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.sr-hidden').forEach(el => observer.observe(el));
}

/* ─── 3. STAT COUNTERS ─── */
function initStatCounters() {
  const stats = document.querySelectorAll('.stat-n');
  if (!stats.length) return;

  const parseTarget = (text) => {
    // Strips non-numeric characters and returns { value, suffix }
    const suffix = text.replace(/[\d.]/g, '').trim(); // e.g. "K+", "%", "+"
    const value = parseFloat(text.replace(/[^\d.]/g, ''));
    return { value, suffix };
  };

  const animateCounter = (el, target, suffix, duration = 1800) => {
    const start = performance.now();
    const isDecimal = !Number.isInteger(target);

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;

      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const original = el.textContent.trim();
        const { value, suffix } = parseTarget(original);
        animateCounter(el, value, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
}

/* ─── 4. STAGGERED SERVICE TILES ─── *//*
function initStaggeredTiles() {
  const tiles = document.querySelectorAll('.svc-tile');
  if (!tiles.length) return;

  tiles.forEach((tile, i) => {
    tile.classList.add('sr-hidden');
    tile.dataset.srAnim = 'fade-up';
    tile.style.setProperty('--sr-delay', (i * 0.08) + 's');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('sr-visible');
        entry.target.classList.remove('sr-hidden');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  tiles.forEach(tile => observer.observe(tile));
}
*/
/* ─── 5. ACTIVE NAV LINK HIGHLIGHTING ─── */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id], .hero[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('nav-active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('nav-active');
          }
        });
      }
    });
  }, { threshold: 0.25 });

  sections.forEach(sec => observer.observe(sec));
}

/* ─── 6. FLOATING AMBIENT ORBS IN HERO ─── */
function initAmbientOrbs() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const orbData = [
    { size: 320, x: 75, y: 20, color: 'rgba(42,191,206,0.07)',  duration: 14 },
    { size: 240, x: 85, y: 65, color: 'rgba(139,95,191,0.09)', duration: 18 },
    { size: 180, x: 60, y: 80, color: 'rgba(232,67,122,0.06)', duration: 12 },
  ];

  orbData.forEach((orb, i) => {
    const el = document.createElement('div');
    el.className = 'hero-orb';
    el.style.cssText = `
      position: absolute;
      width: ${orb.size}px;
      height: ${orb.size}px;
      border-radius: 50%;
      background: radial-gradient(ellipse, ${orb.color}, transparent 70%);
      left: ${orb.x}%;
      top: ${orb.y}%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 3;
      animation: orbFloat${i} ${orb.duration}s ease-in-out infinite;
      animation-delay: ${i * -4}s;
    `;
    hero.appendChild(el);
  });

  // Inject keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes orbFloat0 {
      0%, 100% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.15) translateY(-20px); }
    }
    @keyframes orbFloat1 {
      0%, 100% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(0.88) translateY(18px); }
    }
    @keyframes orbFloat2 {
      0%, 100% { transform: translate(-50%, -50%) scale(1); }
      33% { transform: translate(-50%, -50%) scale(1.1) translateX(14px); }
      66% { transform: translate(-50%, -50%) scale(0.92) translateX(-10px); }
    }
  `;
  document.head.appendChild(style);
}
