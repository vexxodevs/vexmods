// =========================================================
// VexxosMods — Site Scripts
// Vanilla JS, no dependencies, no build step.
// Made by Jimmy & John Co
// =========================================================

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let isHalloween = document.documentElement.classList.contains('halloween');
let isXmas = document.documentElement.classList.contains('xmas');

document.addEventListener('DOMContentLoaded', async () => {
  await loadSiteData(); // mods, theme and settings from site-data.json (edited in admin.html)
  buildDecor();
  initStars();
  initAnnouncement();
  initNav();
  initReveal();
  initSpotlight();
  initCounters();
  initDownloads();
  initActiveLink();
  initFaq();
  initToTop();
  initMobileBar();
  initEasterEgg();
  initScrollProgress();
  initDecorOffset();
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

/* ---------- Small helpers ---------- */
function store(key, value) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch (e) { return null; }
}

let toastTimer;
function showToast(title, sub) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-sub').textContent = sub || '';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ---------- Starfield + shooting stars (embers in October) ---------- */
function initStars() {
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const starRGB = isHalloween ? '255,205,160' : isXmas ? '226,240,255' : '232,224,255';
  const trailRGB = isHalloween ? '255,150,70' : isXmas ? '255,236,190' : '236,220,255';
  let w, h, stars = [], shooters = [], flakes = [];

  function resize() {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(170, Math.floor((w * h) / 9000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.3 + 0.3,
      a: Math.random() * 0.55 + 0.2,
      s: Math.random() * 0.002 + 0.0006,
      p: Math.random() * Math.PI * 2,
      vy: Math.random() * 0.06 + 0.01
    }));

    // December: snow drifting down over the stars.
    if (isXmas) {
      const snowCount = Math.min(260, Math.floor((w * h) / 6200));
      flakes = Array.from({ length: snowCount }, () => makeFlake(Math.random() * h));
    } else {
      flakes = [];
    }
  }

  function makeFlake(y) {
    const depth = Math.random();                 // 0 = far away, 1 = close
    return {
      x: Math.random() * w,
      y: y == null ? -8 : y,
      r: 0.9 + depth * 2.9,
      a: 0.35 + depth * 0.6,
      vy: 0.3 + depth * 1.15,
      sway: 0.25 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.015
    };
  }

  function drawSnow(t) {
    for (const f of flakes) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${f.a})`;
      ctx.arc(f.x + Math.sin(t * 0.0012 * f.sway + f.phase) * 14, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
      if (reduceMotion) continue;
      f.y += f.vy;
      f.x += f.spin * f.r;
      if (f.y - f.r > h) Object.assign(f, makeFlake(null));
      if (f.x < -20) f.x = w + 20;
      if (f.x > w + 20) f.x = -20;
    }
  }

  function spawn() {
    const ang = (Math.PI / 180) * (28 + Math.random() * 22);
    const sp = 10 + Math.random() * 6;
    shooters.push({ x: Math.random() * w * 0.7, y: Math.random() * h * 0.35, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 0, max: 50 + Math.random() * 20 });
  }

  function frame(t) {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const a = reduceMotion ? s.a : s.a + Math.sin(t * s.s + s.p) * 0.22;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${starRGB},${Math.max(0, a)})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (!reduceMotion) { s.y -= s.vy; if (s.y < -2) { s.y = h + 2; s.x = Math.random() * w; } }
    }
    if (flakes.length) drawSnow(t);
    if (reduceMotion) return;

    if (Math.random() < 0.005 && shooters.length < 2) spawn();
    shooters = shooters.filter(s => s.life < s.max);
    for (const s of shooters) {
      const p = s.life / s.max;
      const f = p < 0.15 ? p / 0.15 : 1 - (p - 0.15) / 0.85;
      const tx = s.x - s.vx * 9, ty = s.y - s.vy * 9;
      const g = ctx.createLinearGradient(tx, ty, s.x, s.y);
      g.addColorStop(0, `rgba(${trailRGB},0)`);
      g.addColorStop(1, `rgba(${trailRGB},${f * 0.95})`);
      ctx.beginPath(); ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
      ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y); ctx.stroke();
      s.x += s.vx; s.y += s.vy; s.life++;
    }
    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(frame);
}

/* ---------- Announcement bar (dismiss is remembered per announcement) ---------- */
function initAnnouncement() {
  const bar = document.getElementById('announce');
  const btn = document.getElementById('announce-close');
  if (!bar || !btn) return;
  const key = 'vx_announce_' + (bar.dataset.id || 'default');
  if (store(key) === 'closed') { bar.remove(); return; }
  btn.addEventListener('click', () => {
    bar.classList.add('hidden');
    store(key, 'closed');
    setTimeout(() => bar.remove(), 500);
  });
}

/* ---------- Navbar: scroll state + mobile menu ---------- */
function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (!nav) return;

  const onScroll = () => nav.classList.toggle('scrolled', nav.getBoundingClientRect().top <= 0 && window.scrollY > 16);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!toggle || !links) return;
  const close = () => { toggle.setAttribute('aria-expanded', 'false'); links.classList.remove('open'); };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    links.classList.toggle('open', !open);
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('click', e => { if (!nav.contains(e.target)) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in-view'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => io.observe(el));
}

/* ---------- Cursor spotlight on cards ---------- */
function initSpotlight() {
  if (reduceMotion || window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

/* ---------- Count-up for stat numbers ---------- */
function initCounters() {
  const nums = document.querySelectorAll('.stat-num[data-count]');
  if (!nums.length || reduceMotion || !('IntersectionObserver' in window)) return;

  const run = el => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const start = performance.now(), dur = 1200;
    const tick = now => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
  }, { threshold: 0.6 });
  nums.forEach(el => io.observe(el));
}

/* ---------- Download buttons: ripple + toast ---------- */
// The links point at .jar files in the site's own downloads/ folder, so the browser saves
// the file and the visitor stays on this page. This only adds visual feedback —
// it never blocks or changes the link itself.
function initDownloads() {
  document.querySelectorAll('a.dl').forEach(btn => {
    btn.addEventListener('click', e => {
      if (!reduceMotion) {
        const r = btn.getBoundingClientRect();
        const size = Math.max(r.width, r.height);
        const rip = document.createElement('span');
        rip.className = 'ripple';
        rip.style.width = rip.style.height = `${size}px`;
        rip.style.left = `${(e.clientX || r.left + r.width / 2) - r.left - size / 2}px`;
        rip.style.top = `${(e.clientY || r.top + r.height / 2) - r.top - size / 2}px`;
        btn.appendChild(rip);
        setTimeout(() => rip.remove(), 700);
      }

      const label = btn.querySelector('span');
      if (label && !btn.classList.contains('done')) {
        btn.classList.add('done');
        label.textContent = 'Downloading…';
        setTimeout(() => { btn.classList.remove('done'); label.textContent = 'Download'; }, 2600);
      }

      showToast('Download started', `${btn.dataset.mod || 'Your mod'} · 1.21.11`);
    });
  });
}

/* ---------- Highlight the nav link for the section in view ---------- */
function initActiveLink() {
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  if (!links.length || !('IntersectionObserver' in window)) return;
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        links.forEach(a => a.classList.remove('active'));
        const a = map.get(en.target.id);
        if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

/* ---------- FAQ: only one answer open at a time ---------- */
function initFaq() {
  const items = document.querySelectorAll('.qa');
  items.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) items.forEach(o => { if (o !== d) o.open = false; });
  }));
}

/* ---------- Back-to-top button with scroll-progress ring ---------- */
function initToTop() {
  const btn = document.getElementById('totop');
  const bar = document.getElementById('totop-bar');
  if (!btn) return;
  const LEN = 132; // circumference of r=21
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    if (bar) bar.style.strokeDashoffset = String(LEN * (1 - p));
    btn.classList.toggle('show', window.scrollY > 600);
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
}

/* ---------- Mobile sticky "Get mods" bar ---------- */
// Shows after the hero, hides while the downloads section (or footer) is on screen.
function initMobileBar() {
  const bar = document.getElementById('mbar');
  const downloads = document.getElementById('downloads');
  const footer = document.querySelector('.footer');
  if (!bar || !downloads || !('IntersectionObserver' in window)) return;
  const visible = new Set();
  const update = () => {
    const show = window.scrollY > 500 && visible.size === 0;
    bar.classList.toggle('show', show);
    document.body.classList.toggle('mbar-on', show && window.innerWidth <= 760);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => en.isIntersecting ? visible.add(en.target) : visible.delete(en.target));
    update();
  });
  io.observe(downloads);
  if (footer) io.observe(footer);
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/* ---------- Easter egg: click the "V" logo 5 times quickly ---------- */
/* ---------- Seasonal decoration ----------
   Built here rather than written into index.html, so a stale stylesheet can
   never leave a pile of unstyled graphics on the page. */
function buildDecor() {
  document.querySelectorAll('.season-decor').forEach(el => el.remove());
  if (isHalloween) buildSpiders();
  if (isXmas) buildXmas();
}

function el(tag, cls, html) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html != null) node.innerHTML = html;
  return node;
}

function buildSpiders() {
  const wrap = el('div', 'season-decor spiders');
  wrap.setAttribute('aria-hidden', 'true');
  for (let i = 1; i <= 5; i++) wrap.appendChild(el('span', `spider sp${i}`, '<svg><use href="#i-spider"/></svg>'));
  document.body.appendChild(wrap);
}

function buildXmas() {
  const decor = el('div', 'season-decor xmas-decor');
  decor.setAttribute('aria-hidden', 'true');
  const lights = el('div', 'lights');
  for (let i = 0; i < 18; i++) lights.appendChild(document.createElement('span'));
  decor.appendChild(lights);
  for (let i = 1; i <= 3; i++) decor.appendChild(el('span', `bauble bb${i}`, '<svg><use href="#i-bauble"/></svg>'));
  document.body.appendChild(decor);

  // A snowy pine wood along the bottom of the window.
  const forest = el('div', 'season-decor xmas-forest', `
    <svg class="trees-far" viewBox="0 0 1440 200" preserveAspectRatio="xMidYMax slice">
      ${pines(1440, 11, 126, 0.46)}
    </svg>
    <svg class="trees-near" viewBox="0 0 1440 200" preserveAspectRatio="xMidYMax slice">
      ${pines(1440, 8, 176, 0.88, 84)}
    </svg>
    <svg class="drift" viewBox="0 0 1440 90" preserveAspectRatio="none">
      <path d="M0 40c130-22 230 12 350 10s200-28 320-24 210 32 330 27 280-32 440-14v51H0Z" fill="#f2f8ff"/>
      <path d="M0 58c140-16 240 8 370 6s210-20 330-16 220 24 340 20 240-20 400-10v32H0Z" fill="#ffffff"/>
    </svg>`);
  forest.setAttribute('aria-hidden', 'true');
  document.body.appendChild(forest);
}

/* A row of snow-covered pines: three stacked triangles each. */
function pines(width, count, height, opacity, offset = 0) {
  const step = width / count;
  const base = 200;
  let d = '';
  for (let i = 0; i <= count; i++) {
    const x = offset + i * step + ((i * 53) % 41) - 20;
    const h = height * (0.72 + ((i * 29) % 28) / 100);
    const w = h * 0.52;
    // bottom, middle and top tier
    d += `M${x - w * 0.50} ${base}L${x} ${base - h * 0.46}L${x + w * 0.50} ${base}Z`;
    d += `M${x - w * 0.40} ${base - h * 0.30}L${x} ${base - h * 0.76}L${x + w * 0.40} ${base - h * 0.30}Z`;
    d += `M${x - w * 0.27} ${base - h * 0.60}L${x} ${base - h}L${x + w * 0.27} ${base - h * 0.60}Z`;
  }
  return `<path d="${d}" fill="#ffffff" fill-opacity="${opacity}"/>`;
}

/* ---------- Hang the Christmas lights below the announcement bar ---------- */
function initDecorOffset() {
  const decor = document.querySelector('.xmas-decor');
  if (!decor) return;
  const place = () => {
    const bar = document.getElementById('announce');
    const h = bar && !bar.classList.contains('hidden') ? bar.getBoundingClientRect().height : 0;
    document.documentElement.style.setProperty('--decor-top', `${Math.round(h)}px`);
  };
  place();
  window.addEventListener('resize', place);
  // the bar can be dismissed, and then the lights should move up
  const bar = document.getElementById('announce');
  if (bar) new MutationObserver(place).observe(bar, { attributes: true, attributeFilter: ['class'] });
  setTimeout(place, 600);
}

/* ---------- Thin progress bar showing how far down the page you are ---------- */
function initScrollProgress() {
  const bar = document.querySelector('#scroll-progress span');
  if (!bar) return;
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function initEasterEgg() {
  const mark = document.querySelector('#brand .brand-mark');
  if (!mark) return;
  let clicks = 0, timer;
  mark.addEventListener('click', () => {
    clicks++;
    mark.classList.remove('wiggle'); void mark.offsetWidth; mark.classList.add('wiggle');
    clearTimeout(timer);
    timer = setTimeout(() => { clicks = 0; }, 1500);
    if (clicks < 5) return;
    clicks = 0;
    burst(mark);
    showToast(isHalloween ? 'Boo! You found the secret'
      : isXmas ? 'Merry Christmas! You found the secret'
      : 'You found the secret', 'Made by Jimmy & John Co');
  });

  function burst(el) {
    if (reduceMotion) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const count = isHalloween ? 14 : isXmas ? 30 : 26;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'egg' + (isHalloween ? ' egg-spider' : isXmas ? ' egg-snow' : '');
      if (isHalloween) p.innerHTML = '<svg viewBox="0 0 32 32"><use href="#i-spider"/></svg>';
      const ang = Math.random() * Math.PI * 2;
      const dist = 140 + Math.random() * 260;
      p.style.left = `${cx - 8}px`;
      p.style.top = `${cy - 8}px`;
      p.style.setProperty('--dx', `${Math.cos(ang) * dist}px`);
      p.style.setProperty('--dy', `${Math.sin(ang) * dist + 120}px`);
      p.style.setProperty('--rot', `${(Math.random() - 0.5) * 540}deg`);
      p.style.animationDelay = `${Math.random() * 0.12}s`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1600);
    }
  }
}

/* =========================================================
   Site data — everything below renders the page from
   site-data.json, which the admin panel (admin.html) edits.
   If the file can't be loaded, the built-in HTML stays as-is.
   ========================================================= */

const ICONS = ['spawner', 'meteor', 'glazed', 'rig', 'tpa', 'sword', 'pickaxe', 'eye', 'star', 'box', 'bolt', 'shield', 'map'];
const FEATURE_ICONS = ['i-radar', 'i-bell', 'i-key', 'i-check'];
const NUMBER_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function safeUrl(u) {
  u = String(u || '').trim();
  if (/^https?:\/\//i.test(u) || /^[\w./#-]+$/.test(u)) return u;
  return '#';
}
function safeRgb(v) {
  return /^\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*$/.test(v || '') ? v : '139, 92, 246';
}
function safeId(v, i) {
  const id = String(v || '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
  return id || 'mod-' + i;
}
function fileName(m) {
  if (m.file) return m.file;
  try { return decodeURIComponent(String(m.url || '').split('?')[0].split('/').pop()); } catch (e) { return ''; }
}
function joinNames(names) {
  if (names.length <= 1) return names.join('');
  return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
}
function youtubeId(u) {
  const m = String(u || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{6,})/);
  return m ? m[1] : (/^[\w-]{6,}$/.test(u || '') ? u : '');
}

function dlButton(m) {
  if (m.updating) {
    return `<span class="dl dl-off" aria-disabled="true"><svg class="ic"><use href="#i-clock"/></svg><span>Updating — back soon</span></span>`;
  }
  const url = safeUrl(m.url);
  const local = !/^https?:/i.test(url);
  return `<a class="dl" href="${esc(url)}" ${local ? 'download' : 'rel="noreferrer"'} data-mod="${esc(m.name)}">
    <svg class="ic"><use href="#i-download"/></svg><span>Download</span><svg class="ic arr"><use href="#i-arrow"/></svg></a>
    ${local ? '' : '<span class="dl-hint"><svg class="ic"><use href="#i-shield"/></svg>Adblocker on — ignore any other button on that page</span>'}`;
}
function ossTag(m) {
  if (!m.openSource) return '';
  return `<span class="os-tag" title="The code for this mod is public — anyone can read it">
    <svg class="ic"><use href="#i-oss"/></svg><span>Open source</span></span>`;
}

function badgesFor(m) {
  return (m.updating ? ['Updating'] : []).concat(m.badges || []);
}
function badgeHtml(b) {
  if (b === 'Updating') return `<span class="badge badge-upd"><svg class="ic"><use href="#i-clock"/></svg>Updating</span>`;
  return `<span class="badge${/^new$/i.test(b) ? ' badge-new' : ''}">${esc(b)}</span>`;
}
function iconHtml(m) {
  const icon = ICONS.includes(m.icon) ? m.icon : 'box';
  return `<svg><use href="#m-${icon}"/></svg>`;
}

function featureCard(m, i) {
  const feats = (m.features || []).filter(Boolean).map((f, j) =>
    `<li><svg class="ic"><use href="#${FEATURE_ICONS[j % FEATURE_ICONS.length]}"/></svg>${esc(f)}</li>`).join('');
  return `<article class="mod card feature reveal${m.updating ? ' is-updating' : ''}" id="${safeId(m.id, i)}" style="--acc: ${safeRgb(m.accent)}">
    <div class="feature-ic-wrap" aria-hidden="true">
      <span class="radar"><span></span><span></span><span></span></span>
      <span class="mod-ic feature-ic">${iconHtml(m)}</span>
    </div>
    <div class="feature-body">
      ${badgesFor(m).length ? `<div class="feature-badges">${badgesFor(m).map(badgeHtml).join('')}</div>` : ''}
      <h3>${esc(m.name)}</h3>
      <p>${esc(m.description)}</p>
      ${feats ? `<ul class="feature-list">${feats}</ul>` : ''}
      ${m.note ? `<p class="mod-note"><svg class="ic"><use href="#i-alert"/></svg>${esc(m.note)}</p>` : ''}
    </div>
    <div class="feature-side">
      <div class="tags"><span>MC ${esc(m.mc || '1.21.11')}</span><span>Fabric</span>${ossTag(m)}</div>
      ${dlButton(m)}
    </div>
  </article>`;
}

function modCard(m, i, n) {
  return `<article class="mod card reveal${m.updating ? ' is-updating' : ''}" data-delay="${n % 4}" id="${safeId(m.id, i)}" style="--acc: ${safeRgb(m.accent)}">
    <div class="mod-top">
      <span class="mod-ic">${iconHtml(m)}</span>
      ${badgesFor(m).length ? `<span class="mod-badges">${badgesFor(m).map(badgeHtml).join('')}</span>` : ''}
    </div>
    <h3>${esc(m.name)}</h3>
    <p>${esc(m.description)}</p>
    <div class="tags"><span>MC ${esc(m.mc || '1.21.11')}</span><span>Fabric</span>${ossTag(m)}</div>
    ${m.note ? `<p class="mod-note"><svg class="ic"><use href="#i-alert"/></svg>${esc(m.note)}</p>` : ''}
    ${dlButton(m)}
  </article>`;
}

async function loadSiteData() {
  let d;
  try {
    const r = await fetch('site-data.json', { cache: 'no-store' });
    if (!r.ok) { applyTheme(null); return; }
    d = await r.json();
  } catch (e) { applyTheme(null); return; }
  try { renderSite(d); } catch (e) { console.error('[vexxo] render failed', e); applyTheme(null); }
}

/* The saved theme travels in site-data.json, which is fetched fresh every time,
   so changing it in the admin panel shows up even if site-theme.js is cached. */
function applyTheme(saved) {
  if (new URLSearchParams(location.search).get('theme')) return;   // ?theme= wins
  let t = saved || window.VX_THEME || 'auto';
  if (t === 'auto') {
    const m = new Date().getMonth();
    t = m === 9 ? 'halloween' : m === 11 ? 'xmas' : 'default';
  }
  isHalloween = t === 'halloween';
  isXmas = t === 'xmas';
  const html = document.documentElement;
  html.classList.toggle('halloween', isHalloween);
  html.classList.toggle('xmas', isXmas);
}

function renderSite(d) {
  applyTheme(d.theme);
  const mods = Array.isArray(d.mods) ? d.mods.filter(m => m && m.name) : [];
  const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  const text = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };

  if (mods.length) {
    let n = 0;
    set('featured-slot', mods.map((m, i) => m.featured ? featureCard(m, i) : '').join(''));
    set('mods-grid', mods.map((m, i) => m.featured ? '' : modCard(m, i, n++)).join(''));
    const grid = document.getElementById('mods-grid');
    if (grid) grid.style.display = n ? '' : 'none';

    set('panel-rows', mods.slice(0, 6).map(m => {
      const isNew = !m.updating && (m.badges || []).some(b => /^new$/i.test(b));
      const state = m.updating ? 'Updating' : isNew ? 'New' : 'Loaded';
      return `<div class="row" style="--acc: ${safeRgb(m.accent)}"><span class="row-ic">${iconHtml(m)}</span>
        <span class="row-txt"><b>${esc(m.name)}</b><small>${esc(fileName(m))}</small></span>
        <span class="row-state${m.updating ? ' upd' : isNew ? ' new' : ''}">${state}</span></div>`;
    }).join(''));

    const tail = ['Minecraft 1.21.11', 'Direct Downloads', 'No Redirects', 'Donut SMP', 'Always Free'];
    const items = mods.map(m => m.name).concat(tail).map(t => `<span>${esc(t)}</span>`).join('');
    set('marquee-track', items + items);

    set('footer-mods', mods.map((m, i) => `<a href="#${safeId(m.id, i)}">${esc(m.name)}</a>`).join(''));
    text('hero-mods', joinNames(mods.map(m => m.name)));
    text('dl-count', NUMBER_WORDS[mods.length] || String(mods.length));
    text('mbar-count', `${mods.length} mod${mods.length === 1 ? '' : 's'}`);
    const stat = document.getElementById('stat-mods');
    if (stat) { stat.dataset.count = mods.length; stat.textContent = mods.length; }
  }

  // Announcement bar
  const a = d.announcement || {};
  const bar = document.getElementById('announce');
  if (bar) {
    if (!a.enabled) bar.remove();
    else {
      bar.dataset.id = a.id || 'announcement';
      text('announce-tag', a.tag || 'New');
      text('announce-title', a.title || '');
      text('announce-main', a.text || '');
      text('announce-more', a.more || '');
      const link = document.getElementById('announce-link');
      if (link) {
        if (a.link) { link.href = safeUrl(a.link); text('announce-link-text', a.linkText || 'Learn more'); }
        else link.remove();
      }
    }
  }

  // Links
  const links = d.links || {};
  if (links.discord && /^https:\/\//.test(links.discord)) {
    document.querySelectorAll('a[href*="discord.gg"], a[href*="discord.com/invite"]').forEach(el => { el.href = links.discord; });
  }
  const yt = youtubeId(links.youtube);
  if (yt) {
    document.querySelectorAll('a[href*="youtu.be"], a[href*="youtube.com/watch"]').forEach(el => { el.href = 'https://youtu.be/' + yt; });
    document.querySelectorAll('iframe[src*="youtube.com/embed"]').forEach(el => { el.src = 'https://www.youtube.com/embed/' + yt; });
  }
}
