/* ============================================================
   MAIN JAVASCRIPT
   Luxurious Assets Consulting LLC
   ============================================================ */

(function () {
  'use strict';

  // ── Footer Year ──────────────────────────────────────────
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Navigation Scroll ────────────────────────────────────
  const header = document.getElementById('site-header');
  if (header) {
    const THRESHOLD = 80;
    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > THRESHOLD);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Nav Hamburger ─────────────────────────────────────────
  const hamburger = document.getElementById('nav-hamburger');
  const drawer    = document.getElementById('nav-drawer');

  if (hamburger && drawer) {
    function openDrawer() {
      drawer.classList.add('open');
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
      drawer.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
      drawer.classList.contains('open') ? closeDrawer() : openDrawer();
    });

    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
        hamburger.focus();
      }
    });
  }

  // ── Active Nav Link ───────────────────────────────────────
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link, .nav-drawer-link').forEach(function (link) {
    if (link.getAttribute('href') === path) link.classList.add('active');
  });

  // ── Scroll Reveal ─────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show all immediately
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // ── Watch Card → Overlay ──────────────────────────────────
  // Cards trigger the detail overlay (Phase 7D)
  document.querySelectorAll('.watch-card').forEach(function (card) {
    function openOverlay() {
      const brand  = card.dataset.brand  || '';
      const model  = card.dataset.model  || '';
      const ref    = card.dataset.ref    || '';
      const status = card.dataset.status || 'available';
      const id     = card.dataset.id     || '';
      WatchOverlay.open({ brand, model, ref, status, id, card });
    }

    card.addEventListener('click', openOverlay);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openOverlay();
      }
    });
  });

  // ── Watch Detail Overlay (Phase 7D) ──────────────────────
  const WatchOverlay = (function () {
    let overlay, panel, lastCard;

    function build() {
      if (document.getElementById('watch-overlay')) return;

      overlay = document.createElement('div');
      overlay.id = 'watch-overlay';
      overlay.className = 'watch-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Timepiece details');

      overlay.innerHTML = `
        <div class="watch-overlay-panel" id="watch-overlay-panel">

          <button class="watch-overlay-close" id="watch-overlay-close"
                  aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="M2 2l16 16M18 2L2 18" stroke="currentColor"
                    stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>

          <div class="watch-overlay-body">

            <!-- Left: Gallery -->
            <div class="overlay-gallery">
              <div class="overlay-primary-image-wrap">
                <button class="overlay-arrow overlay-arrow--prev" aria-label="Previous image">
                  <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                    <path d="M9 1L1 9l8 8" stroke="currentColor" stroke-width="1.5"
                          stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <img class="overlay-primary-image" id="overlay-primary-img"
                     src="" alt="Timepiece" loading="lazy">
                <button class="overlay-arrow overlay-arrow--next" aria-label="Next image">
                  <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                    <path d="M1 1l8 8-8 8" stroke="currentColor" stroke-width="1.5"
                          stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <div class="overlay-lightbox-hint" aria-hidden="true">
                  Click to enlarge
                </div>
              </div>
              <div class="overlay-thumbnails" id="overlay-thumbnails"></div>
            </div>

            <!-- Right: Details -->
            <div class="overlay-details">
              <div class="overlay-status" id="overlay-status"></div>
              <h2 class="overlay-heading" id="overlay-heading"></h2>
              <div class="overlay-ref" id="overlay-ref"></div>
              <div class="overlay-price">Price Upon Inquiry</div>

              <div class="overlay-specs" id="overlay-specs"></div>

              <div class="overlay-description" id="overlay-description"></div>

              <div class="overlay-cta-block">
                <a href="#" class="btn btn--primary overlay-cta-btn" id="overlay-cta-btn">
                  Inquire About This Timepiece
                </a>
                <p class="overlay-cta-note">
                  All inquiries are reviewed directly and handled with discretion.
                </p>
              </div>
            </div>

          </div>
        </div>

        <!-- Lightbox -->
        <div class="overlay-lightbox" id="overlay-lightbox" role="dialog"
             aria-modal="true" aria-label="Enlarged image" style="display:none;">
          <button class="lightbox-close" id="lightbox-close" aria-label="Close lightbox">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 2l16 16M18 2L2 18" stroke="currentColor"
                    stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="overlay-arrow lightbox-arrow lightbox-arrow--prev"
                  aria-label="Previous image">
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M9 1L1 9l8 8" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <img class="lightbox-image" id="lightbox-image" src="" alt="Timepiece">
          <button class="overlay-arrow lightbox-arrow lightbox-arrow--next"
                  aria-label="Next image">
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M1 1l8 8-8 8" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      `;

      document.body.appendChild(overlay);

      // Close handlers
      document.getElementById('watch-overlay-close').addEventListener('click', close);
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close();
      });

      // Lightbox
      document.getElementById('overlay-primary-img').addEventListener('click', openLightbox);
      document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
      document.getElementById('overlay-lightbox').addEventListener('click', function (e) {
        if (e.target === this) closeLightbox();
      });

      document.addEventListener('keydown', function (e) {
        if (!overlay || !overlay.classList.contains('open')) return;
        if (e.key === 'Escape') {
          if (document.getElementById('overlay-lightbox').style.display !== 'none') {
            closeLightbox();
          } else {
            close();
          }
        }
        if (e.key === 'ArrowLeft')  navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
      });
    }

    let images = [], currentIndex = 0;

    function navigate(dir) {
      if (!images.length) return;
      currentIndex = (currentIndex + dir + images.length) % images.length;
      updateImage();
    }

    function updateImage() {
      const img = images[currentIndex];
      document.getElementById('overlay-primary-img').src = img;
      document.getElementById('lightbox-image').src = img;
      document.querySelectorAll('.overlay-thumb').forEach(function (t, i) {
        t.classList.toggle('active', i === currentIndex);
      });
    }

    function openLightbox() {
      const lb = document.getElementById('overlay-lightbox');
      lb.style.display = 'flex';
      document.getElementById('lightbox-image').src = images[currentIndex];
    }

    function closeLightbox() {
      document.getElementById('overlay-lightbox').style.display = 'none';
    }

    function open(data) {
      build();
      lastCard = data.card;
      images = data.images || [
        data.imageUrl ||
        'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1200&q=80'
      ];
      currentIndex = 0;

      // Status
      const statusEl = document.getElementById('overlay-status');
      const statusMap = {
        available:  { label: 'Available',   cls: 'status-badge--available'  },
        reserved:   { label: 'Reserved',    cls: 'status-badge--reserved'   },
        'on-request': { label: 'On Request', cls: 'status-badge--on-request' }
      };
      const s = statusMap[data.status] || statusMap['available'];
      statusEl.innerHTML = `<span class="status-badge ${s.cls}">${s.label}</span>`;

      // Heading
      document.getElementById('overlay-heading').textContent =
        (data.brand || '') + ' ' + (data.model || '');

      // Ref
      document.getElementById('overlay-ref').textContent =
        data.ref ? 'Ref. ' + data.ref : '';

      // Specs
      const specsEl = document.getElementById('overlay-specs');
      const specs = [];
      if (data.condition)    specs.push(['Condition',    data.condition]);
      if (data.boxPapers)    specs.push(['Box & Papers', data.boxPapers]);
      if (data.year)         specs.push(['Year',         data.year]);
      if (data.caseSize)     specs.push(['Case Size',    data.caseSize]);
      if (data.movement)     specs.push(['Movement',     data.movement]);
      if (data.dial)         specs.push(['Dial',         data.dial]);
      if (data.bracelet)     specs.push(['Bracelet / Strap', data.bracelet]);

      specsEl.innerHTML = specs.map(function (row) {
        return `<div class="overlay-spec-row">
          <span class="overlay-spec-label">${row[0]}</span>
          <span class="overlay-spec-value">${row[1]}</span>
        </div>`;
      }).join('');

      // Description
      const descEl = document.getElementById('overlay-description');
      descEl.textContent = data.description || '';
      descEl.style.display = data.description ? 'block' : 'none';

      // CTA
      const ctaBtn = document.getElementById('overlay-cta-btn');
      if (data.status === 'reserved') {
        ctaBtn.textContent = 'Inquire About Similar Watches';
        const url = new URL('/watch-sourcing', window.location.origin);
        url.searchParams.set('brand', data.brand || '');
        url.searchParams.set('inquiry_type', 'source');
        ctaBtn.href = url.toString();
      } else {
        ctaBtn.textContent = 'Inquire About This Timepiece';
        const url = new URL('/watch-sourcing', window.location.origin);
        url.searchParams.set('inquiry_type', 'source');
        url.searchParams.set('brand', data.brand || '');
        url.searchParams.set('model', data.model || '');
        url.searchParams.set('ref',   data.ref   || '');
        if (data.id) url.searchParams.set('listing_id', data.id);
        ctaBtn.href = url.toString();
      }

      // Gallery thumbnails
      const thumbsEl = document.getElementById('overlay-thumbnails');
      thumbsEl.innerHTML = images.map(function (src, i) {
        return `<button class="overlay-thumb${i === 0 ? ' active' : ''}"
                        aria-label="View image ${i + 1}">
          <img src="${src}" alt="" loading="lazy">
        </button>`;
      }).join('');

      thumbsEl.querySelectorAll('.overlay-thumb').forEach(function (btn, i) {
        btn.addEventListener('click', function () {
          currentIndex = i;
          updateImage();
        });
      });

      updateImage();

      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      document.getElementById('watch-overlay-close').focus();
    }

    function close() {
      overlay.classList.remove('open');
      closeLightbox();
      document.body.style.overflow = '';
      if (lastCard) lastCard.focus();
    }

    return { open: open, close: close };
  })();

  // ── Expose WatchOverlay globally for CMS integration ──────
  window.WatchOverlay = WatchOverlay;

})();
