(() => {
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];
  const body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;

  /* ---- fit the 1440px desktop design to laptop/tablet widths ---- */
  const fit = () => {
    const w = innerWidth;
    body.style.zoom = (w >= 900 && w < 1440) ? (w / 1440).toFixed(4) : '';
  };
  fit();
  addEventListener('resize', fit);

  /* ---- intro: split SADAF into letters ---- */
  const name = $('.intro .name');
  if (name) {
    name.innerHTML = [...name.textContent.trim()].map((c, i) =>
      `<span class="ch" style="transition-delay:${(0.1 + i * 0.09).toFixed(2)}s">${c}</span>`).join('');
  }
  requestAnimationFrame(() => setTimeout(() => body.classList.add('loaded'), 80));

  /* ---- reveal on scroll ---- */
  const revealSel = '.kick,.h3,.fcard,.wc,.inc>.glass,.tl2,.qf,.about2,.pr2>*,.faq .q,.pbar,.ptitle,.ct,.acc';
  $$(revealSel).forEach(el => {
    if (el.closest('.intro') || el.style.transform) return;
    el.classList.add('rv');
    const sib = [...el.parentElement.children].filter(c => c.matches(revealSel));
    const i = sib.indexOf(el);
    if (i > 0) el.style.transitionDelay = Math.min(i * 0.08, 0.5) + 's';
  });
  $$('.fcard,.wc').forEach(el => el.classList.add('rs'));

  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    io.unobserve(e.target);
    onIn(e.target);
  }), { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  $$('.rv,.heroP,.steps,.gcard,.stats').forEach(el => io.observe(el));

  /* ---- things that start when they appear ---- */
  function onIn(el) {
    if (el.classList.contains('heroP')) typeIt();
    if (el.classList.contains('gcard')) countUp($('.gnum b'), 1000, v => '₹' + v.toLocaleString('en-IN'));
    if (el.classList.contains('stats')) {
      $$('b', el).forEach(b => { if (b.textContent.trim() === '2') countUp(b, 2, v => v); });
    }
  }
  function countUp(el, to, fmt) {
    if (!el || reduce) return;
    const t0 = performance.now(), d = 1600;
    const step = now => {
      const p = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(to * e));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function typeIt() {
    const el = $('#typed');
    if (!el || reduce) return;
    const word = el.textContent;
    el.textContent = '';
    let i = 0;
    const t = () => {
      el.textContent = word.slice(0, ++i);
      if (i < word.length) setTimeout(t, 85);
    };
    setTimeout(t, 700);
  }

  /* ---- side menu: highlight current section ---- */
  const links = $$('nav.rail a[data-sec]');
  const alias = { hero: 'top', formats: 'work', about: 'services', faq: 'pricing' };
  const secIO = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const id = alias[e.target.id] || e.target.id;
    links.forEach(a => a.classList.toggle('on', a.dataset.sec === id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => secIO.observe(s));

  /* ---- service cards & FAQ accordions ---- */
  const onKey = fn => e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
  };
  $$('.acc .ac').forEach(card => {
    const toggle = () => {
      const was = card.classList.contains('open');
      $$('.acc .ac').forEach(c => { c.classList.remove('open'); const p = $('.pl', c); if (p) p.textContent = '+'; });
      if (!was) { card.classList.add('open'); const p = $('.pl', card); if (p) p.textContent = '×'; }
    };
    card.addEventListener('click', e => { if (!e.target.closest('a')) toggle(); });
    card.addEventListener('keydown', onKey(toggle));
  });
  $$('.faq .q').forEach(q => {
    const t = () => q.classList.toggle('open');
    q.addEventListener('click', t);
    q.addEventListener('keydown', onKey(t));
  });

  /* ---- videos: hover preview; click plays right there with sound ---- */
  const players = $$('.vbtn');
  const load = v => { if (!v.getAttribute('src')) v.src = v.dataset.src; };
  const stopLive = box => {
    const v = $('video', box);
    box.classList.remove('live', 'playing');
    v.controls = false; v.muted = true; v.loop = true;
    v.pause();
  };
  players.forEach(box => {
    const v = $('video', box);
    if (finePointer) {
      box.addEventListener('mouseenter', () => {
        if (box.classList.contains('live')) return;
        load(v); v.muted = true;
        v.play().then(() => box.classList.add('playing')).catch(() => {});
      });
      box.addEventListener('mouseleave', () => {
        if (box.classList.contains('live')) return;
        v.pause(); box.classList.remove('playing');
      });
    }
    const goLive = () => {
      if (box.classList.contains('live')) return;
      players.forEach(b => {
        if (b === box) return;
        if (b.classList.contains('live')) stopLive(b);
        else { $('video', b).pause(); b.classList.remove('playing'); }
      });
      load(v);
      box.classList.add('live', 'playing');
      v.loop = false; v.muted = false; v.controls = true;
      v.currentTime = 0;
      v.play().catch(() => {});
    };
    box.addEventListener('click', goLive);
    box.addEventListener('keydown', onKey(goLive));
    v.addEventListener('ended', () => stopLive(box));
  });
  // pause a video when it scrolls out of view
  const vIO = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) { const v = $('video', e.target); if (!v.paused) v.pause(); }
  }), { threshold: 0.2 });
  players.forEach(p => vIO.observe(p));

  /* ---- gentle mouse parallax ---- */
  if (finePointer && !reduce) {
    const girl = $('.intro .girl img');
    const deco = $$('.proc .dc');
    let mx = 0, my = 0, raf = 0;
    addEventListener('mousemove', e => {
      mx = e.clientX / innerWidth - 0.5;
      my = e.clientY / innerHeight - 0.5;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (girl && body.classList.contains('loaded')) girl.style.translate = `${mx * 18}px ${my * 12}px`;
        deco.forEach((d, i) => { d.style.translate = `${mx * (10 + (i % 4) * 6)}px ${my * (8 + (i % 3) * 6)}px`; });
      });
    });
  }
})();
