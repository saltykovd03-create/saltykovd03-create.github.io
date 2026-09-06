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
    ['11:30', 'повторная проверка авансов после выдачи', 'ok'],
    ['14:10', 'счёт поставщика из чата: 7 позиций, в учёт', 'ok'],
    ['18:00', 'просрочки поставок: 2 партии, +9 дней', 'warn'],
    ['23:00', 'закрытие дня, отчёт руководителю', 'ok'],
  ];
  const logEl = document.getElementById('log');
  if (logEl) {
    LOG.forEach(([t, msg, cls]) => {
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
    cards.forEach((card, i) => {
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

  /* ---------- 6. Аккордеон кейсов ---------- */
  document.querySelectorAll('[data-acc]').forEach((root) => {
    const btns = root.querySelectorAll('.acc__btn');
    const setOpen = (btn, open) => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', String(open));
      if (!panel) return;
      if (reduce) { panel.hidden = !open; return; }
      if (open) {
        panel.hidden = false;
        const h = panel.scrollHeight;
        panel.style.height = '0px';
        requestAnimationFrame(() => {
          panel.style.transition = 'height .5s cubic-bezier(.16,1,.3,1)';
          panel.style.height = h + 'px';
          panel.addEventListener('transitionend', () => { panel.style.height = ''; panel.style.transition = ''; if (window.ScrollTrigger) ScrollTrigger.refresh(); }, { once: true });
        });
      } else {
        panel.style.height = panel.scrollHeight + 'px';
        requestAnimationFrame(() => {
          panel.style.transition = 'height .4s cubic-bezier(.16,1,.3,1)';
          panel.style.height = '0px';
          panel.addEventListener('transitionend', () => { panel.hidden = true; panel.style.height = ''; panel.style.transition = ''; if (window.ScrollTrigger) ScrollTrigger.refresh(); }, { once: true });
        });
      }
    };
    btns.forEach((btn) => btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btns.forEach((b) => { if (b !== btn && b.getAttribute('aria-expanded') === 'true') setOpen(b, false); });
      setOpen(btn, !isOpen);
    }));
  });

  /* ---------- 7. Вкладки уровней ---------- */
  document.querySelectorAll('[data-levels]').forEach((root) => {
    const tabs = root.querySelectorAll('[role="tab"]');
    const panels = root.querySelectorAll('[role="tabpanel"]');
    tabs.forEach((tab) => tab.addEventListener('click', () => {
      tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
      panels.forEach((p) => { p.hidden = p.id !== tab.getAttribute('aria-controls'); });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }));
  });

  /* ---------- 8. Якоря с отступом под шапку ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    });
  });
})();
