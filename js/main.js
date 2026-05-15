/* ============================================================
   DRA. MARISA SANCHEZ - Main JS
   ============================================================ */

history.scrollRestoration = 'manual';

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);

  /* --- Header scroll behavior --- */
  const header = document.querySelector('.header');
  const scrollTopBtn = document.querySelector('.scroll-top');
  const onScroll = () => {
    if (window.scrollY > 60) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
    scrollTopBtn?.classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Mobile menu --- */
  const hamburger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMobile?.classList.toggle('open');
    document.body.style.overflow = navMobile?.classList.contains('open') ? 'hidden' : '';
  });
  document.querySelectorAll('.nav-mobile__link, .nav-mobile__cta').forEach(el => {
    el.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      navMobile?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* --- Active nav link --- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* --- Intersection Observer fade-in --- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  /* --- Scroll to top button --- */
  scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* --- Lightbox --- */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox__img');
    const lightboxClose = lightbox.querySelector('.lightbox__close');
    const lightboxPrev = lightbox.querySelector('.lightbox__prev');
    const lightboxNext = lightbox.querySelector('.lightbox__next');
    let currentIdx = 0;
    let gallery = [];

    const openLightbox = (imgs, idx) => {
      gallery = imgs;
      currentIdx = idx;
      lightboxImg.src = gallery[currentIdx];
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };
    const showPrev = () => { currentIdx = (currentIdx - 1 + gallery.length) % gallery.length; lightboxImg.src = gallery[currentIdx]; };
    const showNext = () => { currentIdx = (currentIdx + 1) % gallery.length; lightboxImg.src = gallery[currentIdx]; };

    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxPrev?.addEventListener('click', showPrev);
    lightboxNext?.addEventListener('click', showNext);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });

    document.querySelectorAll('[data-lightbox]').forEach((img, _, arr) => {
      const group = img.dataset.lightbox;
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        const groupImgs = [...document.querySelectorAll(`[data-lightbox="${group}"]`)].map(i => i.src);
        const idx = [...document.querySelectorAll(`[data-lightbox="${group}"]`)].indexOf(img);
        openLightbox(groupImgs, idx);
      });
    });
  }

  /* --- Contact form --- */
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled = true;
    await new Promise(r => setTimeout(r, 1200));
    btn.textContent = 'Mensaje enviado';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      form.reset();
    }, 3000);
  });

  /* --- Casos filter --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const casoItems = document.querySelectorAll('.casos-masonry__item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      casoItems.forEach(item => {
        if (cat === 'all' || item.dataset.category === cat) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* --- Cookie notice --- */
  const cookieConsentKey = 'draMarisaCookieConsent';
  const hasCookieChoice = localStorage.getItem(cookieConsentKey);

  if (!hasCookieChoice) {
    const cookieBanner = document.createElement('div');
    cookieBanner.className = 'cookie-banner';
    cookieBanner.setAttribute('role', 'dialog');
    cookieBanner.setAttribute('aria-live', 'polite');
    cookieBanner.setAttribute('aria-label', 'Aviso de cookies');
    cookieBanner.innerHTML = `
      <div class="cookie-banner__content">
        <p class="cookie-banner__title">Aviso de cookies</p>
        <p class="cookie-banner__text">Utilizamos cookies técnicas necesarias para que la web funcione correctamente. Si en el futuro incorporamos cookies no técnicas, solicitaremos tu consentimiento.</p>
        <a class="cookie-banner__link" href="cookies.html">Ver política de cookies</a>
      </div>
      <div class="cookie-banner__actions">
        <button type="button" class="cookie-banner__btn cookie-banner__btn--ghost" data-cookie-choice="rejected">Rechazar</button>
        <button type="button" class="cookie-banner__btn cookie-banner__btn--primary" data-cookie-choice="accepted">Aceptar</button>
      </div>
    `;
    document.body.appendChild(cookieBanner);

    requestAnimationFrame(() => cookieBanner.classList.add('is-visible'));

    cookieBanner.querySelectorAll('[data-cookie-choice]').forEach(button => {
      button.addEventListener('click', () => {
        localStorage.setItem(cookieConsentKey, button.dataset.cookieChoice);
        cookieBanner.classList.remove('is-visible');
        cookieBanner.addEventListener('transitionend', () => cookieBanner.remove(), { once: true });
      });
    });
  }

});

