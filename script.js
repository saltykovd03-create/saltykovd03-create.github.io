/* Сайт-визитка. Ванильный JS + GSAP ScrollTrigger (стопка карточек, шапка). */
(function () {
  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  html.classList.add('js');
  if (reduce) html.classList.add('reduce');

  /* ---------- 1. Лог агентов в hero: строки появляются по одной ---------- */
  const LOG = [
    ['07:00', 'собрал остатки по 6 счетам и кассе', ''],
    ['07:02', 'наложил вчерашние движения на баланс', ''],
    ['07:05', 'авансы клиентов: 41 сделка, сходится', 'ok'],
    ['08:30', 'разнёс выписку банка: 63 операции по статьям', ''],
    ['08:31', '2 списания без статьи, отправил на разбор', 'warn'],
    ['09:00', 'контроль сделок: 118 активных, 3 спорных', 'warn'],
    ['09:01', 'сводка ушла в чат отдела продаж', 'ok'],
    ['10:15', 'квалификатор: 9 диалогов, 2 горячих переданы', 'ok'],
    ['11:30', 'повторная проверка авансов после выдачи', 'ok'],
    ['12:00', 'договор в сделке 2141: правок нет, сходится с шаблоном', 'ok'],
    ['14:10', 'счёт поставщика из чата: 7 позиций, в учёт', 'ok'],
    ['18:00', 'просрочки поставок: 2 партии, +9 дней', 'warn'],
    ['23:00', 'закрытие дня, отчёт руководителю', 'ok'],
  ];
  const logEl = document.getElementById('log');
  if (logEl) {
    const LOGV = window.innerWidth < 640 ? LOG.slice(0, 7) : LOG;
    LOGV.forEach(([t, msg, cls]) => {
      const li = document.createElement('li');
      li.innerHTML = '<time>' + t + '</time><span class="' + cls + '">' + msg + '</span>';
      logEl.appendChild(li);
    });
    const items = Array.from(logEl.children);
    let i = 0;
    const tick = () => {
      if (i >= items.length) {
        setTimeout(() => { items.forEach((el) => el.classList.remove('is-on')); i = 0; setTimeout(tick, 600); }, 5000);
        return;
      }
      items[i].classList.add('is-on'); i += 1;
      setTimeout(tick, reduce ? 0 : 520 + Math.random() * 380);
    };
    if (reduce) items.forEach((el) => el.classList.add('is-on')); else setTimeout(tick, 700);
  }

  /* ---------- 1.1. На телефоне окно агентов сразу под заголовком ---------- */
  (function () {
    const log = document.querySelector('.hero__side .log');
    const h1 = document.querySelector('.hero__h1');
    const side = document.querySelector('.hero__side');
    if (!log || !h1 || !side) return;
    const place = () => {
      if (window.innerWidth < 960) { if (log.parentElement !== h1.parentElement) h1.insertAdjacentElement('afterend', log); }
      else if (log.parentElement !== side) side.appendChild(log);
    };
    place(); window.addEventListener('resize', place);
  })();

  /* ---------- 1.2. Десктоп: низ окна агентов вровень с последней строкой текста ---------- */
  (function () {
    const text = document.querySelector('.hero__text');
    const side = document.querySelector('.hero__side');
    if (!text || !side) return;
    const fit = () => {
      const log = side.querySelector('.log');
      if (!log) return;
      if (window.innerWidth < 961) { log.style.height = ''; return; }
      log.style.height = '';
      const last = text.lastElementChild || text;
      const h = Math.round(last.getBoundingClientRect().bottom - log.getBoundingClientRect().top);
      if (h > 200) log.style.height = h + 'px';
    };
    fit();
    window.addEventListener('resize', fit);
    window.addEventListener('load', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    setTimeout(fit, 400); setTimeout(fit, 1200);
  })();

  /* ---------- 2. Появление строк hero ---------- */
  const heroLines = document.querySelectorAll('[data-hero-line]');
  heroLines.forEach((el, n) => setTimeout(() => el.classList.add('is-in'), reduce ? 0 : 120 + n * 90));

  /* ---------- 3. Reveal по скроллу ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const delay = parseFloat(el.dataset.delay || '0') * 1000;
      setTimeout(() => el.classList.add('is-in'), reduce ? 0 : delay);
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

  /* ---------- 4. Шапка и sticky CTA после первого экрана ---------- */
  const header = document.querySelector('.header');
  const sticky = document.querySelector('.sticky-cta');
  const contact = document.getElementById('contact');
  const onScroll = () => {
    const hero = document.querySelector('.hero');
    const past = window.scrollY > ((hero ? hero.offsetHeight : window.innerHeight) - 90);
    header && header.classList.toggle('is-scrolled', past);
    if (sticky) {
      const nearContact = contact && contact.getBoundingClientRect().top < window.innerHeight * 0.8;
      sticky.classList.toggle('is-on', past && !nearContact);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 5. Стопка карточек: предыдущая сжимается и уходит в вуаль ---------- */
  const cards = Array.from(document.querySelectorAll('[data-stack-card]'));
  const headerOffset = () => (window.innerWidth >= 1024 ? 84 : 72);
  const layoutStack = () => {
    const vh = window.innerHeight;
    if (window.innerWidth >= 961) { cards.forEach((card) => { card.style.top = ''; card.style.transformOrigin = ''; }); if (window.ScrollTrigger) ScrollTrigger.refresh(); return; }
    cards.forEach((card) => {
      const top = Math.min(headerOffset(), vh - card.offsetHeight - 12);
      card.style.top = top + 'px';
      card.style.transformOrigin = top < headerOffset() ? '50% 100%' : '50% 0%';
    });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  };
  layoutStack();
  window.addEventListener('resize', layoutStack);
  window.addEventListener('load', layoutStack);

  if (window.gsap && window.ScrollTrigger && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.innerWidth < 961) cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      const veil = card.querySelector('[data-stack-veil]');
      const st = { trigger: cards[i + 1], start: 'top bottom', end: 'top top', scrub: true };
      gsap.to(card, { scale: 0.955, ease: 'none', scrollTrigger: st });
      if (veil) gsap.to(veil, { opacity: 0.55, ease: 'none', scrollTrigger: Object.assign({}, st) });
    });
    if (getComputedStyle(document.querySelector('.hero')).position === 'sticky') {
      gsap.to('.hero__grid', { yPercent: -10, opacity: 0.3, ease: 'none',
        scrollTrigger: { trigger: '.sheet', start: 'top bottom', end: 'top top', scrub: true } });
    }
  }

  /* ---------- 7.5. Окно контактов: любая кнопка связи ---------- */
  (function () {
    const modal = document.getElementById('cmodal');
    if (!modal) return;
    const tg = document.getElementById('cmodal-tg');
    const note = document.getElementById('cmodal-note');
    let lastFocus = null;
    const open = (href) => {
      if (tg) tg.href = href || 'https://t.me/shabb1on';
      note.textContent = '';
      lastFocus = document.activeElement;
      modal.hidden = false; document.body.style.overflow = 'hidden';
      const first = modal.querySelector('.cmodal__item'); if (first) first.focus();
    };
    const close = () => { modal.hidden = true; document.body.style.overflow = ''; if (lastFocus && lastFocus.focus) lastFocus.focus(); };
    document.querySelectorAll('a[href^="https://t.me/"]').forEach((a) => {
      if (a.closest('.cmodal')) return;
      a.addEventListener('click', (e) => { e.preventDefault(); open(a.getAttribute('href')); });
    });
    modal.querySelectorAll('[data-cmodal-close]').forEach((el) => el.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });
    const copyBtn = modal.querySelector('[data-copy]');
    if (copyBtn) copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const num = copyBtn.dataset.copy;
      const done = () => { note.textContent = 'Номер скопирован. Откройте MAX и найдите меня по номеру.'; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(num).then(done, done);
      else { const t = document.createElement('textarea'); t.value = num; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (err) {} t.remove(); done(); }
    });
  })();

  /* ---------- 8. Якоря с отступом под шапку ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = id === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    });
  });
})();
