/**
 * EMMY Restaurant - Core Application JS
 * Handles: Navigation, Dark Mode, Custom Cursor, Scroll Effects,
 *          Page Loader, Toast Notifications, Counter Animation,
 *          Parallax, Intersection Observer, Typing Effect
 */

'use strict';

/* ============================================================
   MODULE: Page Loader
   ============================================================ */
const PageLoader = (() => {
  const loader = document.getElementById('page-loader');

  const hide = () => {
    // After loader bar animation completes
    setTimeout(() => {
      loader?.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1900);
  };

  const init = () => {
    document.body.style.overflow = 'hidden';
    window.addEventListener('load', hide);
    // Fallback if load event already fired
    if (document.readyState === 'complete') hide();
  };

  return { init };
})();

/* ============================================================
   MODULE: Custom Cursor
   ============================================================ */
const CustomCursor = (() => {
  let cursorEl, followerEl, cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;

  const move = (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    if (cursorEl) {
      cursorEl.style.left = cursorX + 'px';
      cursorEl.style.top  = cursorY + 'px';
    }
  };

  const lerp = (a, b, n) => (1 - n) * a + n * b;

  const animateFollower = () => {
    if (!followerEl) return;
    followerX = lerp(followerX, cursorX, 0.12);
    followerY = lerp(followerY, cursorY, 0.12);
    followerEl.style.left = followerX + 'px';
    followerEl.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  };

  const onHoverableEnter = () => {
    cursorEl?.style.setProperty('width', '20px');
    cursorEl?.style.setProperty('height', '20px');
    followerEl?.style.setProperty('width', '60px');
    followerEl?.style.setProperty('height', '60px');
    followerEl?.style.setProperty('opacity', '0.3');
  };

  const onHoverableLeave = () => {
    cursorEl?.style.setProperty('width', '12px');
    cursorEl?.style.setProperty('height', '12px');
    followerEl?.style.setProperty('width', '40px');
    followerEl?.style.setProperty('height', '40px');
    followerEl?.style.setProperty('opacity', '0.6');
  };

  const init = () => {
    // Skip on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    cursorEl    = document.getElementById('cursor');
    followerEl  = document.getElementById('cursor-follower');

    document.addEventListener('mousemove', move);
    animateFollower();

    // Enlarge on interactive elements
    const hoverables = document.querySelectorAll('a, button, [role="button"], .menu-card, .gallery-item');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', onHoverableEnter);
      el.addEventListener('mouseleave', onHoverableLeave);
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => { if (followerEl) followerEl.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { if (followerEl) followerEl.style.opacity = '0.6'; });
  };

  return { init };
})();

/* ============================================================
   MODULE: Navigation
   ============================================================ */
const Navigation = (() => {
  let navbar, hamburger, mobileMenu, menuOverlay;
  let isMenuOpen = false;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Update active nav link
    updateActiveLink();
  };

  const updateActiveLink = () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY  = window.scrollY + 120;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav-links a[href="#${id}"]`);

      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  };

  const toggleMobileMenu = () => {
    isMenuOpen = !isMenuOpen;
    hamburger?.classList.toggle('active', isMenuOpen);
    mobileMenu?.classList.toggle('open', isMenuOpen);
    menuOverlay?.classList.toggle('show', isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  };

  const closeMobileMenu = () => {
    isMenuOpen = false;
    hamburger?.classList.remove('active');
    mobileMenu?.classList.remove('open');
    menuOverlay?.classList.remove('show');
    document.body.style.overflow = '';
  };

  const init = () => {
    navbar      = document.getElementById('navbar');
    hamburger   = document.querySelector('.hamburger');
    mobileMenu  = document.getElementById('mobile-menu');
    menuOverlay = document.getElementById('menu-overlay');

    window.addEventListener('scroll', onScroll, { passive: true });
    hamburger?.addEventListener('click', toggleMobileMenu);
    menuOverlay?.addEventListener('click', closeMobileMenu);

    // Close menu on mobile link click
    mobileMenu?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    onScroll(); // Run on init
  };

  return { init };
})();

/* ============================================================
   MODULE: Scroll Progress Bar
   ============================================================ */
const ScrollProgress = (() => {
  const init = () => {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const docH    = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / docH) * 100;
      bar.style.width = Math.min(scrolled, 100) + '%';
    }, { passive: true });
  };

  return { init };
})();

/* ============================================================
   MODULE: Dark Mode Toggle
   ============================================================ */
const DarkMode = (() => {
  const STORAGE_KEY = 'emmy-theme';
  let btn, isLight = false;

  const setMode = (light) => {
    isLight = light;
    document.body.classList.toggle('light-mode', light);
    if (btn) {
      btn.innerHTML = light ? '🌙' : '☀️';
      btn.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
    }
    localStorage.setItem(STORAGE_KEY, light ? 'light' : 'dark');
  };

  const init = () => {
    btn = document.getElementById('dark-mode-toggle');
    const saved = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    setMode(saved ? saved === 'light' : !prefersDark);
    btn?.addEventListener('click', () => setMode(!isLight));
  };

  return { init };
})();

/* ============================================================
   MODULE: Back to Top Button
   ============================================================ */
const BackToTop = (() => {
  const init = () => {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  return { init };
})();

/* ============================================================
   MODULE: Intersection Observer (Scroll Animations)
   ============================================================ */
const ScrollAnimations = (() => {
  const init = () => {
    // AOS-like custom implementation
    const elements = document.querySelectorAll('[data-aos]');

    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-aos-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add('aos-animate');
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach(el => observer.observe(el));

    // Section enter animations
    const enterEls = document.querySelectorAll(
      '.section-enter-left, .section-enter-right, .section-enter-bottom, .section-enter-scale'
    );

    const enterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          enterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    enterEls.forEach(el => enterObserver.observe(el));
  };

  return { init };
})();

/* ============================================================
   MODULE: Counter Animation
   ============================================================ */
const CounterAnimation = (() => {
  const animateCounter = (el) => {
    const target  = parseFloat(el.getAttribute('data-target'));
    const suffix  = el.getAttribute('data-suffix') || '';
    const prefix  = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const step     = 16;
    const steps    = duration / step;
    const increment = target / steps;
    let current = 0;

    const isFloat = target % 1 !== 0;

    const update = () => {
      current += increment;
      if (current >= target) {
        el.textContent = prefix + (isFloat ? target.toFixed(1) : target) + suffix;
      } else {
        el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
        setTimeout(update, step);
      }
    };

    update();
  };

  const init = () => {
    const counters = document.querySelectorAll('[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  };

  return { init };
})();

/* ============================================================
   MODULE: Typing Effect (Hero)
   ============================================================ */
const TypingEffect = (() => {
  const texts = [
    'Taste Excellence at EMMY',
    'Craft. Passion. Perfection.',
    'Where Every Bite Tells a Story.'
  ];

  let index = 0, charIndex = 0, isDeleting = false;

  const type = (el) => {
    const current = texts[index];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === current.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      index = (index + 1) % texts.length;
      speed = 400;
    }

    setTimeout(() => type(el), speed);
  };

  const init = () => {
    const el = document.getElementById('hero-typing-text');
    if (!el) return;
    // Small delay before starting
    setTimeout(() => type(el), 1000);
  };

  return { init };
})();

/* ============================================================
   MODULE: Parallax (Hero)
   ============================================================ */
const Parallax = (() => {
  const init = () => {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.3}px)`;
    }, { passive: true });
  };

  return { init };
})();

/* ============================================================
   MODULE: Toast Notifications
   ============================================================ */
const Toast = (() => {
  const container = document.getElementById('toast-container');

  const icons = {
    success: '✅',
    error:   '❌',
    info:    'ℹ️',
    warning: '⚠️'
  };

  /**
   * Show a toast notification
   * @param {string} title
   * @param {string} message
   * @param {'success'|'error'|'info'|'warning'} type
   * @param {number} duration  ms
   */
  const show = (title, message = '', type = 'info', duration = 4000) => {
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${icons[type]}</span>
      <div class="toast-content">
        <p class="toast-title">${title}</p>
        ${message ? `<p class="toast-msg">${message}</p>` : ''}
      </div>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });

    // Remove after duration
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 500);
    }, duration);
  };

  return { show };
})();

/* ============================================================
   MODULE: Countdown Timer (Offers)
   ============================================================ */
const CountdownTimer = (() => {
  /**
   * @param {Element} container  - element with .countdown-unit children
   * @param {Date}    endDate
   */
  const start = (container, endDate) => {
    const units = container.querySelectorAll('.countdown-unit');
    if (!units.length) return;

    const [daysEl, hoursEl, minsEl, secsEl] = [
      container.querySelector('.cd-days'),
      container.querySelector('.cd-hours'),
      container.querySelector('.cd-mins'),
      container.querySelector('.cd-secs')
    ];

    const pad = n => String(n).padStart(2, '0');

    const tick = () => {
      const now  = new Date();
      const diff = Math.max(0, endDate - now);

      const days  = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins  = Math.floor((diff % 3600000) / 60000);
      const secs  = Math.floor((diff % 60000) / 1000);

      if (daysEl)  daysEl.textContent  = pad(days);
      if (hoursEl) hoursEl.textContent = pad(hours);
      if (minsEl)  minsEl.textContent  = pad(mins);
      if (secsEl)  secsEl.textContent  = pad(secs);
    };

    tick();
    return setInterval(tick, 1000);
  };

  const init = () => {
    const countdowns = document.querySelectorAll('[data-countdown]');
    countdowns.forEach(el => {
      const endDate = new Date(el.getAttribute('data-countdown'));
      if (!isNaN(endDate)) start(el, endDate);
    });
  };

  return { init, start };
})();

/* ============================================================
   MODULE: Ripple Effect
   ============================================================ */
const RippleEffect = (() => {
  const addRipple = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${x}px; top: ${y}px;
    `;

    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  };

  const init = () => {
    document.querySelectorAll('.btn, .add-to-cart-btn, .filter-btn').forEach(btn => {
      btn.classList.add('ripple-container');
      btn.addEventListener('click', addRipple);
    });
  };

  return { init };
})();

/* ============================================================
   MODULE: Lazy Loading Images
   ============================================================ */
const LazyLoader = (() => {
  const init = () => {
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading supported
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.loading = 'lazy';
      });
    } else {
      // Intersection Observer fallback
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      }, { rootMargin: '200px' });

      document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
    }
  };

  return { init };
})();

/* ============================================================
   MODULE: Newsletter
   ============================================================ */
const Newsletter = (() => {
  const init = () => {
    const form    = document.getElementById('newsletter-form');
    const success = document.querySelector('.newsletter-success');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput?.value.trim();

      if (!email || !isValidEmail(email)) {
        Toast.show('Invalid Email', 'Please enter a valid email address.', 'error');
        return;
      }

      // Simulate API call (Firebase / EmailJS ready)
      // await NewsletterAPI.subscribe(email);
      const subscribers = JSON.parse(localStorage.getItem('emmy-newsletter') || '[]');
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('emmy-newsletter', JSON.stringify(subscribers));
      }

      if (success) success.style.display = 'block';
      form.reset();
      Toast.show('Subscribed! 🎉', 'You\'ve joined the EMMY family.', 'success');

      setTimeout(() => { if (success) success.style.display = 'none'; }, 5000);
    });
  };

  return { init };
})();

/* ============================================================
   HELPERS
   ============================================================ */
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone  = (phone) => /^[\d\s+\-()]{7,15}$/.test(phone);

/* ============================================================
   APP INITIALIZATION
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  PageLoader.init();
  CustomCursor.init();
  Navigation.init();
  ScrollProgress.init();
  DarkMode.init();
  BackToTop.init();
  ScrollAnimations.init();
  CounterAnimation.init();
  TypingEffect.init();
  Parallax.init();
  RippleEffect.init();
  LazyLoader.init();
  Newsletter.init();
  CountdownTimer.init();
});

// Export for cross-module use
window.EmmyApp = { Toast, isValidEmail, isValidPhone };
