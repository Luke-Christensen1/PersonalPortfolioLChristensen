/**
 * Luke Christensen Portfolio — Interactive Interactions & Carousel
 * Exact Framer-style Motion & Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initProgressBars();
  initAboutCarousel();
  initNavScroll();
  initCounterAnimation();
  initParallaxTilt();
  initPageTransitions();
  initBorderGlow();
});

/**
 * Scroll Reveal Animations
 * Replicating Framer Motion appearance: translateY(16px) -> translateY(0)
 */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.framer-appear');
  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));
  } else {
    elements.forEach(el => el.classList.add('in-view'));
  }
}

/**
 * Animated Progress Bars (FamilySearch 21% -> 35%)
 */
function initProgressBars() {
  const progressFills = document.querySelectorAll('.progress-fill');
  if (!progressFills.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target.getAttribute('data-target');
          if (target) {
            entry.target.style.width = `${target}%`;
          }
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    progressFills.forEach(fill => observer.observe(fill));
  } else {
    progressFills.forEach(fill => {
      fill.style.width = `${fill.getAttribute('data-target')}%`;
    });
  }
}

/**
 * Interactive Carousel in Section 02 / A Little About Me (Screenshot 4)
 */
function initAboutCarousel() {
  const activeImg = document.getElementById('aboutActivePhoto');
  const prevBtn = document.getElementById('photoPrevBtn');
  const nextBtn = document.getElementById('photoNextBtn');
  const dots = document.querySelectorAll('#aboutMiniDots .card-mini-dot');
  const container = document.getElementById('aboutPhotoContainer');

  if (!activeImg || !prevBtn || !nextBtn) return;

  const photos = [
    { src: 'assets/framer/s5RyWX2objIjIKytZvBmXwbtIuY.jpg', alt: 'Luke Christensen wedding day' },
    { src: 'assets/framer/4aZ8oul49WObIeNxKiWrsqyZ1wo.jpg', alt: 'Mountains with family and friends' },
    { src: 'assets/framer/SRGAef9TFuSoURaD5jP2aCSnPy8.jpg', alt: 'BYU performance group on stage' },
    { src: 'assets/framer/iWIk6eLuaUV3TVGkhsGcqTB2s.jpg', alt: 'Dancing on stage' },
    { src: 'assets/framer/32zmRJGw6PEp5R63kMTKKsy4GtQ.jpg', alt: 'Young Ambassadors performance' },
    { src: 'assets/framer/TyPUGeKKkpiLIjVj1mDxd3RTqH0.jpeg', alt: 'Iguazu Falls boat trip' }
  ];

  // Preload photos for instant transitions
  photos.forEach(p => {
    const img = new Image();
    img.src = p.src;
  });

  let currentIndex = 2; // Default to BYU performance group as in Screenshot 4!

  const renderPhoto = (idx) => {
    if (idx < 0) idx = photos.length - 1;
    if (idx >= photos.length) idx = 0;
    currentIndex = idx;

    activeImg.style.opacity = '0.2';
    activeImg.style.transform = 'scale(0.98)';

    setTimeout(() => {
      activeImg.src = photos[currentIndex].src;
      activeImg.alt = photos[currentIndex].alt;
      activeImg.style.opacity = '1';
      activeImg.style.transform = 'scale(1)';
    }, 140);

    dots.forEach((d, i) => {
      if (i === currentIndex) {
        d.classList.add('active');
      } else {
        d.classList.remove('active');
      }
    });
  };

  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    renderPhoto(currentIndex - 1);
  });

  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    renderPhoto(currentIndex + 1);
  });

  dots.forEach(d => {
    d.addEventListener('click', () => {
      const idx = parseInt(d.getAttribute('data-idx') || '0', 10);
      renderPhoto(idx);
    });
  });

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  if (container) {
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    if (touchEndX < touchStartX - 40) {
      renderPhoto(currentIndex + 1);
    }
    if (touchEndX > touchStartX + 40) {
      renderPhoto(currentIndex - 1);
    }
  }
}

/**
 * Smooth Navigation & Active Link Highlighting
 */
function initNavScroll() {
  const nav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  const sections = document.querySelectorAll('section[id], footer[id]');

  // Dynamic shadow on scroll
  window.addEventListener('scroll', () => {
    if (nav) {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const offsetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - 70;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px'
    });

    sections.forEach(sec => observer.observe(sec));
  }
}

/**
 * 01. Animated Number Counter
 * Smoothly counts up metrics (e.g. ~30K, 21%, 35%, 160+, -60%) on scroll
 */
function initCounterAnimation() {
  const counterEls = document.querySelectorAll('[data-counter]');
  if (!counterEls.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const animateCounter = (el) => {
    const targetVal = parseFloat(el.getAttribute('data-counter'));
    if (isNaN(targetVal)) return;

    const prefix = el.getAttribute('data-counter-prefix') || '';
    const suffix = el.getAttribute('data-counter-suffix') || '';
    const duration = 1300; // ms
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Framer cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(targetVal * eased);

      el.textContent = `${prefix}${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${prefix}${targetVal}${suffix}`;
      }
    };

    requestAnimationFrame(update);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    counterEls.forEach(el => observer.observe(el));
  } else {
    counterEls.forEach(animateCounter);
  }
}

/**
 * 02. Subtle 3D Parallax Tilt
 * Subtle, hardware-accelerated 3D perspective tracking with smooth spring return
 */
function initParallaxTilt() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Pure 3D parallax perspective tilt without awkward vertical sliding
  const tiltCards = document.querySelectorAll(
    '.profile-contact-card, .case-card-visual, .more-card, .case-diagram-card'
  );
  if (!tiltCards.length) return;

  tiltCards.forEach(card => {
    let isHovering = false;
    let ticking = false;
    let targetX = 0;
    let targetY = 0;

    const maxTilt = 3.5; // Subtle 3.5 degrees for clean, elegant micro-tilt

    card.addEventListener('mouseenter', () => {
      isHovering = true;
      card.style.transition = 'transform 0.08s ease-out, box-shadow 0.25s ease';
      card.style.willChange = 'transform';
    });

    card.addEventListener('mousemove', (e) => {
      if (!isHovering) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPercent = (x / rect.width) * 2 - 1; // -1 to +1
      const yPercent = (y / rect.height) * 2 - 1; // -1 to +1

      targetX = -yPercent * maxTilt;
      targetY = xPercent * maxTilt;

      if (!ticking) {
        requestAnimationFrame(() => {
          if (isHovering) {
            // Pure 3D rotation following the mouse — zero awkward vertical sliding
            card.style.transform = `perspective(1000px) rotateX(${targetX.toFixed(2)}deg) rotateY(${targetY.toFixed(2)}deg)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      isHovering = false;
      card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      setTimeout(() => {
        if (!isHovering) {
          card.style.willChange = 'auto';
        }
      }, 500);
    });
  });
}

/**
 * 03. Page Route Transitions
 * Seamless cross-page fade without flashes, simulating a native SPA
 */
function initPageTransitions() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.body.classList.remove('page-fading-out');

  window.addEventListener('pageshow', () => {
    document.body.classList.remove('page-fading-out');
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    if (
      link.target === '_blank' ||
      link.hasAttribute('download') ||
      link.getAttribute('rel') === 'external'
    ) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;

    if (link.origin && link.origin !== window.location.origin) return;

    // Check if in-page anchor jump on same page
    try {
      const url = new URL(link.href, window.location.href);
      if (url.pathname === window.location.pathname && url.hash) {
        return;
      }
    } catch (err) {
      // fallback
    }

    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    document.body.classList.add('page-fading-out');

    setTimeout(() => {
      window.location.href = link.href;
    }, 180);
  });
}

/**
 * 04. Soft Border Glow
 * Edge-only ambient spotlight tracking cursor without background flood
 */
function initBorderGlow() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const glowElements = document.querySelectorAll(
    '.profile-contact-card, .case-card, .more-card, .about-photo-card, .case-diagram-card, .case-section-box, .timeline-item'
  );
  if (!glowElements.length) return;

  glowElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);

      const visual = el.querySelector('.case-card-visual');
      if (visual) {
        const vRect = visual.getBoundingClientRect();
        visual.style.setProperty('--mouse-x', `${e.clientX - vRect.left}px`);
        visual.style.setProperty('--mouse-y', `${e.clientY - vRect.top}px`);
      }
    }, { passive: true });
  });
}
