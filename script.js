/* ===============================================================
   FINNITUS | SITE OFICIAL — CONFIGURAÇÕES
   Preencha os valores quando a equipe definir os links oficiais.
   Você NÃO precisa alterar o HTML para publicar esses links.
   =============================================================== */
const FINNITUS = {
  playStoreUrl: '',      // Ex.: 'https://play.google.com/store/apps/details?id=...'
  videoUrl: '',          // Ex.: 'assets/video-finnitus.mp4' ou link do YouTube
  contactEmail: '',      // E-mail oficial para receber mensagens (formulário abre aplicativo de e-mail)
  instagramUrl: '',      // Ex.: 'https://www.instagram.com/SEUPERFIL/'
  instagramLabel: '',    // Ex.: '@finnitus'
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Barra de progresso e cabeçalho com efeito ao rolar.
const progress = $('.scroll-progress');
const header = $('.site-header');
let scrollPending = false;
function syncScroll() {
  const doc = document.documentElement;
  const max = Math.max(1, doc.scrollHeight - innerHeight);
  progress.style.width = `${Math.min(100, (scrollY / max) * 100)}%`;
  header.classList.toggle('scrolled', scrollY > 24);
  scrollPending = false;
}
window.addEventListener('scroll', () => {
  if (!scrollPending) { scrollPending = true; requestAnimationFrame(syncScroll); }
}, { passive: true });
syncScroll();

// Entradas de seção (IntersectionObserver), com respeito a acessibilidade.
if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); obs.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -45px 0px', threshold: 0.09 });
  $$('[data-reveal]').forEach((el) => revealObserver.observe(el));
} else {
  $$('[data-reveal]').forEach((el) => el.classList.add('revealed'));
}

// Menu responsivo e fechamento automático ao clicar nos links.
const toggle = $('.menu-toggle');
const mobileNav = $('#mobile-nav');
function closeMobile() {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menu');
  toggle.innerHTML = '<svg class="i"><use href="#icon-menu"/></svg>';
  mobileNav.hidden = true;
}
function openMobile() {
  toggle.setAttribute('aria-expanded', 'true');
  toggle.setAttribute('aria-label', 'Fechar menu');
  toggle.innerHTML = '<svg class="i"><use href="#icon-close"/></svg>';
  mobileNav.hidden = false;
}
toggle.addEventListener('click', () => {
  toggle.getAttribute('aria-expanded') === 'true' ? closeMobile() : openMobile();
});
$$('a', mobileNav).forEach((link) => link.addEventListener('click', closeMobile));
window.addEventListener('resize', () => { if (innerWidth > 970) closeMobile(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMobile(); });

// Destacar a seção atual no menu desktop.
const observedSections = $$('main section[id]');
if ('IntersectionObserver' in window) {
  const activeObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio);
    if (!visible.length) return;
    const id = visible[0].target.id;
    $$('.desktop-nav a').forEach((a) => a.classList.toggle('is-current', a.hash === `#${id}`));
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  observedSections.forEach(s => activeObserver.observe(s));
}

// Modal acessível para conteúdos ainda não publicados.
const dialog = $('#status-dialog');
const dialogTitle = $('#dialog-title');
const dialogText = $('#dialog-text');
function showDialog(title, message) {
  dialogTitle.textContent = title;
  dialogText.textContent = message;
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else window.alert(`${title}\n\n${message}`);
}
$$('[data-dialog-close]').forEach(el => el.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', (ev) => { if (ev.target === dialog) dialog.close(); });

// Download: só direciona à Play Store quando há link oficial válido.
$$('[data-download]').forEach((button) => button.addEventListener('click', () => {
  if (FINNITUS.playStoreUrl && /^https:\/\//i.test(FINNITUS.playStoreUrl)) {
    window.open(FINNITUS.playStoreUrl, '_blank', 'noopener,noreferrer');
  } else {
    showDialog('O Finnitus está chegando.', 'O aplicativo ainda não tem um link público de download. Assim que a equipe publicar na Google Play, esse botão será ativado.');
  }
}));

// Video: arquivos MP4 locais/remotos OU links oficiais do YouTube.
const videoButton = $('[data-video-open]');
videoButton.addEventListener('click', () => {
  const url = FINNITUS.videoUrl.trim();
  if (!url) {
    showDialog('Nosso vídeo está em preparação.', 'O vídeo oficial de apresentação será inserido nesta seção assim que a equipe finalizar a edição.');
    return;
  }
  const stage = $('.video-stage');
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  const frame = document.createElement(youtubeMatch ? 'iframe' : 'video');
  if (youtubeMatch) {
    frame.src = `https://www.youtube-nocookie.com/embed/${youtubeMatch[1]}?autoplay=1`;
    frame.title = 'Vídeo oficial de apresentação do Finnitus';
    frame.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    frame.setAttribute('allowfullscreen', '');
  } else {
    frame.src = url;
    frame.controls = true;
    frame.autoplay = true;
    frame.playsInline = true;
  }
  frame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;background:#08050e;z-index:9;';
  stage.appendChild(frame);
  videoButton.disabled = true;
  videoButton.style.display = 'none';
});

// Dados de contato: inserir após criação dos canais oficiais.
if (FINNITUS.playStoreUrl && /^https:\/\//i.test(FINNITUS.playStoreUrl)) {
  $('[data-download]').childNodes[0].textContent = 'Baixar na Google Play ';
}
if (FINNITUS.videoUrl) {
  $('.video-bar > span:last-child').textContent = 'VÍDEO OFICIAL • ASSISTA AGORA';
}
const emailNode = $('#contact-email-display');
const instaNode = $('#contact-instagram-display');
const contactEmail = FINNITUS.contactEmail.trim();
if (contactEmail) {
  $('.form-note').textContent = 'O formulário abre o seu aplicativo de e-mail. Confira a mensagem e confirme o envio por lá; nada é armazenado neste site.';
  const a = document.createElement('a');
  a.href = `mailto:${contactEmail}`;
  a.textContent = contactEmail;
  emailNode.replaceWith(a);
}
if (FINNITUS.instagramUrl && /^https:\/\//i.test(FINNITUS.instagramUrl)) {
  const a = document.createElement('a');
  a.href = FINNITUS.instagramUrl;
  a.textContent = FINNITUS.instagramLabel || 'Abrir Instagram';
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  instaNode.replaceWith(a);
}

const form = $('#contact-form');
const formFeedback = $('#form-feedback');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = $('#contact-name').value.trim();
  const sender = $('#contact-reply').value.trim();
  const message = $('#contact-message').value.trim();
  if (!name || !sender || !message) return;
  if (!contactEmail) {
    formFeedback.textContent = 'Canal de envio ainda não configurado. A equipe adicionará o e-mail oficial antes de publicar.';
    showDialog('Contato em preparação.', 'O formulário já está pronto, mas ainda falta cadastrar o endereço oficial da equipe. Nenhuma mensagem foi enviada ou armazenada.');
    return;
  }
  const subject = encodeURIComponent('Contato pelo site Finnitus');
  const body = encodeURIComponent(`Nome: ${name}\nE-mail: ${sender}\n\nMensagem:\n${message}`);
  const mailto = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  formFeedback.textContent = 'Abrindo seu aplicativo de e-mail. Confira a mensagem e confirme o envio por lá.';
  window.location.href = mailto;
});

$('#current-year').textContent = String(new Date().getFullYear());


/* ===============================================================
   Scrollview de teste do aplicativo
   =============================================================== */
const demoCards = $$('[data-demo-open]');
const demoSlides = $$('[data-demo-slide]');
const demoScroller = $('#app-demo-scroller');
const demoTitle = $('#demo-title');
const demoDescription = $('#demo-description');
const demoData = [
  { title: 'Gestão financeira', description: 'Organize receitas, despesas e categorias em uma visualização simples.' },
  { title: 'Dashboard', description: 'Acompanhe saldos, indicadores e evolução do seu planejamento.' },
  { title: 'Calendário inteligente', description: 'Visualize datas importantes, compromissos e movimentações do mês.' },
  { title: 'Metas financeiras', description: 'Defina objetivos e acompanhe o progresso dos seus aportes.' },
  { title: 'Plano B', description: 'Reorganize o planejamento quando um imprevisto aparecer.' },
];
let activeDemoIndex = 0;
function updateDemoHeader(index) {
  if (!demoTitle || !demoDescription) return;
  demoTitle.textContent = demoData[index].title;
  demoDescription.textContent = demoData[index].description;
}
function setActiveDemo(index, options = {}) {
  if (!demoSlides.length || !demoCards.length) return;
  activeDemoIndex = (index + demoSlides.length) % demoSlides.length;
  demoSlides.forEach((slide, i) => slide.classList.toggle('is-active', i === activeDemoIndex));
  demoCards.forEach((card, i) => card.classList.toggle('is-selected', i === activeDemoIndex));
  updateDemoHeader(activeDemoIndex);
  if (options.scrollSlide !== false) {
    demoSlides[activeDemoIndex].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', inline: 'start', block: 'nearest' });
  }
  if (options.scrollSection) {
    $('#teste-app')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }
}
if (demoCards.length && demoSlides.length && demoScroller) {
  demoCards.forEach((card, index) => {
    const open = () => setActiveDemo(index, { scrollSection: true, scrollSlide: true });
    card.addEventListener('click', open);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });
  $$('[data-demo-nav]').forEach((button) => {
    button.addEventListener('click', () => {
      setActiveDemo(activeDemoIndex + (button.dataset.demoNav === 'next' ? 1 : -1), { scrollSlide: true });
    });
  });
  if ('IntersectionObserver' in window) {
    const slideObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (!visible.length) return;
      const index = Number(visible[0].target.dataset.demoSlide || 0);
      setActiveDemo(index, { scrollSlide: false });
    }, { root: demoScroller, threshold: 0.6 });
    demoSlides.forEach((slide) => slideObserver.observe(slide));
  }
  setActiveDemo(0, { scrollSlide: false });
}
