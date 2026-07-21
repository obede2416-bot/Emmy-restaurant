/**
 * EMMY Restaurant - Gallery Module
 * Handles: Masonry grid, lightbox, image slider, lazy loading
 */

'use strict';

/* ============================================================
   GALLERY DATA
   ============================================================ */
const GALLERY_ITEMS = [
  {
    id: 'g1',
    src: 'assets/images/hero_restaurant.png',
    thumb: 'assets/images/hero_restaurant.png',
    alt: 'EMMY Dining Room — Elegant evening ambiance',
    category: 'interior',
    span: 'tall'
  },
  {
    id: 'g2',
    src: 'assets/images/menu_steak.png',
    thumb: 'assets/images/menu_steak.png',
    alt: 'Wagyu Tenderloin — Signature EMMY dish',
    category: 'food',
    span: ''
  },
  {
    id: 'g3',
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85',
    thumb: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    alt: 'Fine dining table setting',
    category: 'interior',
    span: ''
  },
  {
    id: 'g4',
    src: 'assets/images/menu_lobster.png',
    thumb: 'assets/images/menu_lobster.png',
    alt: 'Atlantic Lobster — Butter-poached perfection',
    category: 'food',
    span: 'wide'
  },
  {
    id: 'g5',
    src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&q=85',
    thumb: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
    alt: 'Chocolate lava cake dessert',
    category: 'desserts',
    span: ''
  },
  {
    id: 'g6',
    src: 'assets/images/chef_portrait.png',
    thumb: 'assets/images/chef_portrait.png',
    alt: 'Executive Chef at EMMY',
    category: 'chef',
    span: 'tall'
  },
  {
    id: 'g7',
    src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=85',
    thumb: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
    alt: 'Guests enjoying fine dining',
    category: 'customers',
    span: ''
  },
  {
    id: 'g8',
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85',
    thumb: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    alt: 'EMMY private dining room',
    category: 'interior',
    span: ''
  },
  {
    id: 'g9',
    src: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&q=85',
    thumb: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
    alt: 'Crème brûlée — Classic dessert',
    category: 'desserts',
    span: ''
  },
  {
    id: 'g10',
    src: 'assets/images/food_spread.png',
    thumb: 'assets/images/food_spread.png',
    alt: 'The EMMY tasting menu spread',
    category: 'food',
    span: 'wide'
  },
  {
    id: 'g11',
    src: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=900&q=85',
    thumb: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80',
    alt: 'EMMY signature cocktail',
    category: 'food',
    span: ''
  },
  {
    id: 'g12',
    src: 'assets/images/about_restaurant.png',
    thumb: 'assets/images/about_restaurant.png',
    alt: 'EMMY bar and lounge area',
    category: 'interior',
    span: ''
  }
];

/* ============================================================
   GALLERY MODULE
   ============================================================ */
const Gallery = (() => {
  let galleryGrid, lightbox, lightboxImg, currentIndex = 0;
  let visibleItems = [...GALLERY_ITEMS];

  /* ---- Build gallery HTML ---- */
  const buildItem = (item, idx) => `
    <div class="gallery-item ${item.span}" 
         data-index="${idx}" 
         data-category="${item.category}"
         role="button"
         tabindex="0"
         aria-label="Open ${item.alt}">
      <img data-src="${item.thumb}" 
           src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"
           alt="${item.alt}" 
           loading="lazy">
      <div class="gallery-overlay">
        <div class="zoom-icon" aria-hidden="true">🔍</div>
      </div>
    </div>
  `;

  const render = (items = GALLERY_ITEMS) => {
    if (!galleryGrid) return;
    visibleItems = items;
    galleryGrid.innerHTML = items.map((item, idx) => buildItem(item, idx)).join('');
    
    // Lazy load gallery images
    galleryGrid.querySelectorAll('img[data-src]').forEach(img => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '100px' });
      observer.observe(img);
    });

    // Attach click handlers
    galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => openLightbox(parseInt(item.dataset.index)));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(parseInt(item.dataset.index));
        }
      });
    });
  };

  /* ---- Lightbox ---- */
  const openLightbox = (index) => {
    currentIndex = index;
    const item = visibleItems[index];
    if (!item || !lightbox) return;

    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Preload adjacent images
    if (visibleItems[index - 1]) new Image().src = visibleItems[index - 1].src;
    if (visibleItems[index + 1]) new Image().src = visibleItems[index + 1].src;
  };

  const closeLightbox = () => {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
  };

  const navigate = (direction) => {
    currentIndex = (currentIndex + direction + visibleItems.length) % visibleItems.length;
    const item = visibleItems[currentIndex];
    if (!item || !lightboxImg) return;

    // Animate transition
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.9)';

    setTimeout(() => {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
      lightboxImg.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1)';
      lightboxImg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }, 200);
  };

  /* ---- Testimonials Carousel ---- */
  const TestimonialCarousel = (() => {
    let track, slides, dots, currentSlide = 0, autoplayTimer;

    const goTo = (index) => {
      if (!track || !slides.length) return;
      currentSlide = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;

      dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
    };

    const next = () => goTo(currentSlide + 1);
    const prev = () => goTo(currentSlide - 1);

    const startAutoplay = () => {
      stopAutoplay();
      autoplayTimer = setInterval(next, 5000);
    };

    const stopAutoplay = () => {
      if (autoplayTimer) clearInterval(autoplayTimer);
    };

    const init = () => {
      track = document.querySelector('.testimonial-track');
      slides = document.querySelectorAll('.testimonial-slide');
      dots   = document.querySelectorAll('.carousel-dot');

      if (!track || !slides.length) return;

      document.querySelector('.carousel-prev')?.addEventListener('click', () => { prev(); startAutoplay(); });
      document.querySelector('.carousel-next')?.addEventListener('click', () => { next(); startAutoplay(); });

      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { goTo(i); startAutoplay(); });
      });

      // Pause on hover
      track.parentElement?.addEventListener('mouseenter', stopAutoplay);
      track.parentElement?.addEventListener('mouseleave', startAutoplay);

      // Touch/swipe
      let startX = 0;
      track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
      track.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          diff > 0 ? next() : prev();
          startAutoplay();
        }
      });

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        const carousel = document.getElementById('testimonials');
        if (!carousel) return;
        const rect = carousel.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          if (e.key === 'ArrowRight') next();
          if (e.key === 'ArrowLeft')  prev();
        }
      });

      goTo(0);
      startAutoplay();
    };

    return { init };
  })();

  /* ---- Init ---- */
  const init = () => {
    galleryGrid = document.getElementById('gallery-grid');
    lightbox    = document.getElementById('lightbox');
    lightboxImg = lightbox?.querySelector('.lightbox-img');

    render();

    // Lightbox controls
    lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    lightbox?.querySelector('.lightbox-prev')?.addEventListener('click', () => navigate(-1));
    lightbox?.querySelector('.lightbox-next')?.addEventListener('click', () => navigate(1));

    // Close on backdrop click
    lightbox?.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
      if (!lightbox?.classList.contains('open')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowRight')  navigate(1);
      if (e.key === 'ArrowLeft')   navigate(-1);
    });

    // Init testimonials carousel
    TestimonialCarousel.init();
  };

  return { init, GALLERY_ITEMS };
})();

document.addEventListener('DOMContentLoaded', () => Gallery.init());

window.EmmyGallery = Gallery;
