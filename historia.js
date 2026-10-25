/* Finnitus • página Nossa História. Sem bibliotecas externas. */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const header = $('.site-header');
  const progress = $('.scroll-progress');
  const menuToggle = $('.menu-toggle');
  const mobileNav = $('#mobile-nav');
  const year = $('#current-year');
  if (year) year.textContent = new Date().getFullYear();

  let pendingScroll = false;
  function onScroll() {
    if (pendingScroll) return;
    pendingScroll = true;
    requestAnimationFrame(() => {
      const full = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      if (progress) progress.style.width = `${Math.min(100,scrollY / full * 100)}%`;
      header?.classList.toggle('scrolled', scrollY > 24);
      pendingScroll = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const menuIcon = (open) => `<svg class="i"><use href="#icon-${open ? 'close' : 'menu'}"/></svg>`;
  function closeMenu() {
    if (!menuToggle || !mobileNav) return;
    menuToggle.setAttribute('aria-expanded','false');
    menuToggle.setAttribute('aria-label','Abrir menu');
    menuToggle.innerHTML = menuIcon(false);
    mobileNav.hidden = true;
  }
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded',String(open));
    menuToggle.setAttribute('aria-label',open ? 'Fechar menu' : 'Abrir menu');
    menuToggle.innerHTML = menuIcon(open);
    mobileNav.hidden = !open;
  });
  $$('#mobile-nav a').forEach(a => a.addEventListener('click',closeMenu));
  window.addEventListener('resize',() => { if (innerWidth > 970) closeMenu(); });

  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    },{ rootMargin: '0px 0px -30px 0px', threshold: .06 });
    $$('[data-reveal]').forEach(el => observer.observe(el));
  } else $$('[data-reveal]').forEach(el => el.classList.add('revealed'));

  // Galeria: as cinco imagens originais aparecem também no rodapé.
  const gallery = $$('[data-lightbox-img]');
  const lightbox = $('#story-lightbox');
  const lightboxImg = $('#story-lightbox-image');
  const lightboxCaption = $('#story-lightbox-caption');
  const lightboxCount = $('#story-lightbox-count');
  const closeButton = $('[data-lightbox-close]');
  let activeIndex = 0;
  let opener = null;

  function showImage(index) {
    if (!gallery.length || !lightboxImg) return;
    activeIndex = (index + gallery.length) % gallery.length;
    const source = gallery[activeIndex];
    const img = $('img',source);
    lightboxImg.src = source.dataset.lightboxImg;
    lightboxImg.alt = img?.alt || 'Registro do processo criativo do Finnitus';
    lightboxCaption.textContent = source.dataset.lightboxCaption || '';
    lightboxCount.textContent = `${activeIndex + 1} / ${gallery.length}`;
  }
  function openImage(index, eventSource) {
    if (!lightbox || typeof lightbox.showModal !== 'function') return;
    opener = eventSource;
    showImage(index);
    if (!lightbox.open) lightbox.showModal();
    closeButton?.focus();
  }
  gallery.forEach((item,index) => item.addEventListener('click',() => openImage(index,item)));
  $$('[data-lightbox-target]').forEach(button => button.addEventListener('click',() => {
    const index = Number(button.dataset.lightboxTarget);
    if (Number.isInteger(index) && index >= 0 && index < gallery.length) openImage(index,button);
  }));
  $('[data-lightbox-prev]')?.addEventListener('click',() => showImage(activeIndex - 1));
  $('[data-lightbox-next]')?.addEventListener('click',() => showImage(activeIndex + 1));
  closeButton?.addEventListener('click',() => lightbox?.close());
  lightbox?.addEventListener('click',event => { if (event.target === lightbox) lightbox.close(); });
  lightbox?.addEventListener('close', () => { if (opener?.isConnected) opener.focus(); });
  document.addEventListener('keydown',event => {
    if (event.key === 'Escape') closeMenu();
    if (!lightbox?.open) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); showImage(activeIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); showImage(activeIndex - 1); }
  });
})();
