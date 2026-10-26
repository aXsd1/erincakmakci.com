/* erincakmakci.com — motion */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  let vw = innerWidth, vh = innerHeight;

  /* ---------- Split text ---------- */
  const splitEl = el => {
    const mode = el.dataset.split;
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          const parts = mode === 'chars' ? Array.from(n.textContent) : n.textContent.split(/(\s+)/);
          parts.forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            const s = document.createElement('span');
            s.className = mode === 'chars' ? 'char' : 'word';
            s.style.setProperty('--i', i++);
            s.textContent = p;
            frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    el.dataset.splitDone = '1';
  };

  /* ---------- Dil (EN varsayılan; EN metinler HTML'den okunur) ---------- */
  const TR = {
    "loader.role": "Yazılım Mühendisi",
    "loader.port": "Portfolyo ’26",
    "nav.label": "Ana menü",
    "nav.top": "Başa dön",
    "nav.about": "Hakkımda",
    "nav.work": "İşler",
    "nav.skills": "Yetkinlikler",
    "nav.contact": "İletişim",
    "hero.eyebrow": "(01) — Portfolyo",
    "hero.status": "Yeni projelere açık",
    "hero.alt": "Erin Çakmakçı portresi",
    "hero.sr": "Erin Çakmakçı — Yazılım Mühendisi",
    "hero.lead": "Yazılım mühendisiyim. Web, mobil ve API tarafında <strong>sade arayüzler</strong> ve <strong>sağlam altyapılar</strong> inşa ediyorum.",
    "hero.scroll": "Kaydır",
    "marquee.label": "Kullandığım teknolojiler",
    "about.eyebrow": "(02) — Hakkımda",
    "about.text": "Karmaşık sistemleri <em>sade</em> deneyimlere dönüştürüyorum. Haritada yaşayan bir sosyal ağdan, kendi kendine uçan bir İHA’ya kadar — her satırı, kullanıcı hiç fark etmeyecek kadar <em>akıcı</em> olsun diye yazıyorum.",
    "work.eyebrow": "(03) — Seçili işler",
    "work.title": "Ürünler, <span class=\"outline\">motorlar</span><br>ve platformlar.",
    "le.tag": "Mobil · API · Harita",
    "le.kicker": "Dünyanın Instagram’ı.",
    "le.desc": "Paylaşılan her fotoğraf, çekildiği noktaya haritada iğnelenir. Flutter mobil uygulama, sözleşme-öncelikli PHP REST API, yönetim paneli ve MapLibre GL ile çalışan tanıtım sitesi.",
    "le.link": "Siteyi ziyaret et",
    "cur.open": "Aç",
    "uav.tag": "Otonom sistemler · Simülasyon",
    "uav.title": "VTOL İHA",
    "uav.kicker": "Pistsiz kalkar, kanatla uçar.",
    "uav.desc": "Kanal içinde zıt dönen iki pervane ve vane’lerle itki vektörleme yapan otonom tail-sitter İHA. 12 kg’lık prototip için aero katsayı üreteci, C++ 6-DOF Gazebo eklentisi, yamalı PX4 kontrol tahsisi ve tarayıcıdan çalışan yer kontrol arayüzü.",
    "uav.s1": "Monte Carlo SITL koşusu",
    "uav.s2": "10 m askıda konum",
    "uav.s3": "dikeyden yataya geçiş",
    "cur.github": "GitHub’da incele",
    "hud.mode": "MOD",
    "hud.alt": "İRTİFA",
    "hud.spd": "HIZ",
    "hud.pitch": "YUNUSLAMA",
    "cs.tag": "Tersine mühendislik",
    "cs.kicker": "Çalışan bir oyunun belleğini okumak.",
    "cs.desc": "Açık kaynak Valthrun tabanı üzerine Rust ile geliştirdiğim fork. Kernel seviyesinde salt-okunur bellek erişimi, oyunun şemasından sınıf ve alan offset’lerini çözme, DirectX/Vulkan overlay, paylaşımlı bellek ve WebSocket ile canlı web radar, Ed25519 imzalı güncelleyici launcher.",
    "cs.ro": "client.dll · salt-okunur",
    "ar.eyebrow": "(04) — Arşiv",
    "ar.title": "Diğer işler",
    "ar.trompet": "MCTS ile hamle düşünen bot rakibi olan kart oyunu; durumsuz oyun API’si.",
    "ar.kh": "BTK Hackathon projesi: kentsel buluşmaları keşfet, topluluğunu kur.",
    "ar.ets": "Yönetim paneli ve proje yükleme altyapısıyla modern bir web çözümü.",
    "ar.sb": "Premium tasarım ve mimarlık stüdyosu için sinematik bir vitrin sitesi.",
    "ar.am": "Bir mimarlık ofisi için sade, tipografi odaklı kurumsal site.",
    "ar.store.t": "Mağaza",
    "ar.store": "Ürün, kategori ve sipariş yönetimi olan yönetim panelli e-ticaret altyapısı.",
    "cur.write": "Yaz",
    "ar.cta.t": "Sıradaki<br><span class=\"outline\">senin projen</span>",
    "ar.cta": "Bir fikrin varsa birlikte inşa edelim.",
    "sk.eyebrow": "(05) — Yetkinlikler",
    "sk.title": "Uçtan uca.<br><span class=\"outline\">Ekrandan sunucuya.</span>",
    "sk.api.t": "Sözleşme-öncelikli API’ler.",
    "sk.api": "Önce sözleşme, sonra kod. PHP ve Python ile versiyonlu REST uçları, migration’lar ve yönetim panelleri.",
    "sk.mob.e": "Mobil",
    "sk.mob": "Tek kod tabanı, iki platform. Harita, kamera ve konum odaklı akışlar.",
    "sk.auto.e": "Otonom sistemler",
    "sk.auto.t": "Uçuş & simülasyon",
    "sk.auto": "PX4, ROS 2 ve 6-DOF fizik modelleriyle SITL’de binlerce koşu ile doğrulanan otonomi.",
    "sk.sys.e": "Sistem",
    "sk.sys": "Tersine mühendislik, bellek analizi ve Ed25519 imzalı otomatik güncelleme istemcileri.",
    "sk.ui.e": "Arayüz",
    "sk.ui.t": "Sade & hareketli",
    "sk.ui": "Tasarım sözleşmeleri, akıcı motion ve fazlası olmayan arayüzler.",
    "ct.eyebrow": "(06) — İletişim",
    "ct.t1": "Bir fikrin mi var?",
    "ct.t2": "Konuşalım.",
    "ct.orb": "Mail<br>gönder",
    "ct.mail": "E-posta",
    "ft.tz": "Türkiye",
    "ft.top": "Başa dön ↑",
    "term.ok1": "✓ şema güncel",
    "term.ok2": "✓ askı 10 m · ±5 cm · 0,5°",
    "hud.m.ground": "YERDE",
    "hud.m.takeoff": "KALKIŞ",
    "hud.m.ftrans": "ÖN GEÇİŞ",
    "hud.m.cruise": "SEYİR",
    "hud.m.btrans": "GERİ GEÇİŞ",
    "hud.m.land": "İNİŞ",
    "meta.title": "Erin Çakmakçı — Yazılım Mühendisi",
    "meta.desc": "Erin Çakmakçı — web, mobil ve API tarafında sade arayüzler ve sağlam altyapılar inşa eden yazılım mühendisi.",
    "lang.label": "Dil"
  };
  const EN = {
    "term.ok1": "✓ schema up to date",
    "term.ok2": "✓ hover 10 m · ±5 cm · 0.5°",
    "hud.m.ground": "ON GROUND",
    "hud.m.takeoff": "TAKEOFF",
    "hud.m.ftrans": "TRANSITION",
    "hud.m.cruise": "CRUISE",
    "hud.m.btrans": "BACK-TRANS",
    "hud.m.land": "LANDING",
    "meta.title": "Erin Çakmakçı — Software Engineer",
    "meta.desc": "Erin Çakmakçı — software engineer building simple interfaces and solid infrastructure across web, mobile and APIs.",
    "lang.label": "Language"
  };
  $$('[data-i18n]').forEach(el => { EN[el.dataset.i18n] = el.innerHTML; });
  const i18nAttrs = el => el.dataset.i18nAttr.split(';').map(p => p.split(':'));
  $$('[data-i18n-attr]').forEach(el => i18nAttrs(el).forEach(([a, k]) => { EN[k] = el.getAttribute(a); }));

  let lang = 'en';
  try { const saved = localStorage.getItem('lang'); if (saved === 'tr' || saved === 'en') lang = saved; } catch (e) {}
  const t = k => (lang === 'tr' ? TR[k] : EN[k]) ?? EN[k] ?? k;
  const langHooks = [];

  const applyLang = () => {
    root.lang = lang;
    $$('[data-i18n]').forEach(el => {
      const v = t(el.dataset.i18n);
      el.innerHTML = v;
      if (el.dataset.split) splitEl(el);
    });
    $$('[data-i18n-attr]').forEach(el => i18nAttrs(el).forEach(([a, k]) => el.setAttribute(a, t(k))));
    document.title = t('meta.title');
    $('meta[name="description"]').setAttribute('content', t('meta.desc'));
    const sw = $('.lang');
    if (sw) {
      sw.dataset.active = lang;
      sw.setAttribute('aria-label', t('lang.label'));
      $$('[data-lang]', sw).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    }
    langHooks.forEach(fn => fn());
  };

  $$('[data-lang]').forEach(btn => btn.addEventListener('click', () => {
    const next = btn.dataset.lang;
    if (next === lang) return;
    try { localStorage.setItem('lang', next); } catch (e) {}
    root.classList.add('is-switching');
    setTimeout(() => {
      lang = next;
      applyLang();
      requestAnimationFrame(() => root.classList.remove('is-switching'));
    }, reduce ? 0 : 280);
  }));

  // TR seçiliyse bölmeden önce metinleri değiştir
  if (lang !== 'en') applyLang();
  else $$('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  $$('[data-split]').forEach(el => { if (!el.dataset.splitDone) splitEl(el); });

  /* ---------- Loader ---------- */
  const loaderCount = $('[data-loader-count]');
  const loaderBar = $('[data-loader-bar]');
  let loaded = document.readyState === 'complete';
  addEventListener('load', () => { loaded = true; });
  // yavaş bir kaynak girişi kilitlemesin
  setTimeout(() => { loaded = true; }, 3500);

  const startLoader = () => {
    const minTime = reduce ? 0 : 1600;
    const t0 = performance.now();
    let shown = 0;
    const tick = now => {
      const elapsed = now - t0;
      // yükleme bitmeden %90'ı geçme
      const target = loaded ? 1 : Math.min(.9, elapsed / minTime);
      const timeCap = minTime ? clamp(elapsed / minTime) : 1;
      shown = lerp(shown, Math.min(target, timeCap), .12);
      if (loaded && timeCap >= 1 && shown > .995) shown = 1;
      loaderCount.textContent = String(Math.round(shown * 100)).padStart(3, '0');
      loaderBar.style.transform = `scaleX(${shown})`;
      if (shown < 1) requestAnimationFrame(tick);
      else finish();
    };
    requestAnimationFrame(tick);
  };
  const finish = () => {
    root.classList.add('is-ready');
    setTimeout(() => root.classList.remove('is-loading'), 600);
    // giriş animasyonu bitince nav anında gizlenip görünebilsin
    setTimeout(() => { $('.nav').style.transitionDelay = '0s'; }, 2000);
  };
  if (history.scrollRestoration) history.scrollRestoration = 'manual';
  scrollTo(0, 0);
  startLoader();

  /* ---------- Perlin noise ---------- */
  const P = new Uint8Array(512);
  {
    const p = [...Array(256).keys()];
    for (let i = 255; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [p[i], p[j]] = [p[j], p[i]]; }
    for (let i = 0; i < 512; i++) P[i] = p[i & 255];
  }
  const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
  const grad = (h, x, y, z) => {
    const u = h < 8 ? x : y, v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
  };
  const noise = (x, y, z) => {
    const fx = Math.floor(x), fy = Math.floor(y), fz = Math.floor(z);
    const X = fx & 255, Y = fy & 255, Z = fz & 255;
    x -= fx; y -= fy; z -= fz;
    const u = fade(x), v = fade(y), w = fade(z);
    const A = P[X] + Y, AA = P[A] + Z, AB = P[A + 1] + Z, B = P[X + 1] + Y, BA = P[B] + Z, BB = P[B + 1] + Z;
    return lerp(
      lerp(lerp(grad(P[AA] & 15, x, y, z), grad(P[BA] & 15, x - 1, y, z), u),
           lerp(grad(P[AB] & 15, x, y - 1, z), grad(P[BB] & 15, x - 1, y - 1, z), u), v),
      lerp(lerp(grad(P[AA + 1] & 15, x, y, z - 1), grad(P[BA + 1] & 15, x - 1, y, z - 1), u),
           lerp(grad(P[AB + 1] & 15, x, y - 1, z - 1), grad(P[BB + 1] & 15, x - 1, y - 1, z - 1), u), v), w);
  };

  /* ---------- Kontür çizgileri (marching squares) ---------- */
  const pointer = { x: -9999, y: -9999, active: false };

  class Contours {
    constructor(canvas) {
      this.c = canvas;
      this.ctx = canvas.getContext('2d');
      this.o = Object.assign({ alpha: .25, cell: 14, scale: .002, speed: 1, mouse: 1 }, JSON.parse(canvas.dataset.contours || '{}'));
      this.t = Math.random() * 100;
      this.m = { x: -9999, y: -9999, s: 0 };
      this.visible = false;
      this.levels = [];
      for (let l = -0.42; l <= 0.43; l += 0.07) this.levels.push(+l.toFixed(2));
      this.resize();
      new ResizeObserver(() => this.resize()).observe(canvas);
      new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; }).observe(canvas);
    }
    resize() {
      const r = this.c.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      this.w = r.width; this.h = r.height;
      this.c.width = Math.max(1, r.width * dpr); this.c.height = Math.max(1, r.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cell = vw < 720 ? this.o.cell * 1.3 : this.o.cell;
      this.cell = cell;
      this.cols = Math.ceil(r.width / cell) + 1;
      this.rows = Math.ceil(r.height / cell) + 1;
      this.f = new Float32Array(this.cols * this.rows);
    }
    frame(dt) {
      if (!this.visible || !this.w) return;
      this.t += dt * 0.00007 * this.o.speed;
      const { ctx, cols, rows, cell, f, o } = this;

      // imleç yumuşak takip
      if (o.mouse) {
        const r = this.c.getBoundingClientRect();
        const inside = pointer.active && pointer.x >= r.left && pointer.x <= r.right && pointer.y >= r.top && pointer.y <= r.bottom;
        if (inside) {
          this.m.x = this.m.s ? lerp(this.m.x, pointer.x - r.left, .08) : pointer.x - r.left;
          this.m.y = this.m.s ? lerp(this.m.y, pointer.y - r.top, .08) : pointer.y - r.top;
        }
        this.m.s = lerp(this.m.s, inside ? 1 : 0, .05);
      }
      const s = o.scale, t = this.t, mr2 = 170 * 170, ms = this.m.s * .55;
      for (let j = 0; j < rows; j++) {
        const y = j * cell;
        for (let i = 0; i < cols; i++) {
          const x = i * cell;
          let v = noise(x * s, y * s, t) + .45 * noise(x * s * 2.1 + 40, y * s * 2.1, t * 1.4);
          if (ms > .01) {
            const dx = x - this.m.x, dy = y - this.m.y;
            v += ms * Math.exp(-(dx * dx + dy * dy) / mr2);
          }
          f[j * cols + i] = v;
        }
      }

      ctx.clearRect(0, 0, this.w, this.h);
      ctx.lineJoin = 'round';
      this.levels.forEach((L, k) => {
        const major = k % 3 === 0;
        ctx.strokeStyle = `rgba(255,122,26,${major ? o.alpha * 1.7 : o.alpha})`;
        ctx.lineWidth = major ? 1.2 : .8;
        ctx.beginPath();
        for (let j = 0; j < rows - 1; j++) {
          for (let i = 0; i < cols - 1; i++) {
            const a = f[j * cols + i], b = f[j * cols + i + 1], c = f[(j + 1) * cols + i + 1], d = f[(j + 1) * cols + i];
            const idx = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (d > L ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            const x = i * cell, y = j * cell;
            const T = () => [x + cell * (L - a) / (b - a), y];
            const R = () => [x + cell, y + cell * (L - b) / (c - b)];
            const B = () => [x + cell * (L - d) / (c - d), y + cell];
            const Lf = () => [x, y + cell * (L - a) / (d - a)];
            const seg = (p, q) => { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
            switch (idx) {
              case 1: case 14: seg(Lf(), B()); break;
              case 2: case 13: seg(B(), R()); break;
              case 3: case 12: seg(Lf(), R()); break;
              case 4: case 11: seg(T(), R()); break;
              case 6: case 9: seg(T(), B()); break;
              case 7: case 8: seg(Lf(), T()); break;
              case 5: seg(T(), R()); seg(Lf(), B()); break;
              case 10: seg(Lf(), T()); seg(B(), R()); break;
            }
          }
        }
        ctx.stroke();
      });
    }
  }
  const contours = $$('canvas[data-contours]').map(c => new Contours(c));

  /* ---------- İHA uçuş profili ---------- */
  const flight = (() => {
    const svg = $('[data-flight]');
    if (!svg) return null;
    const path = $('[data-flight-path]', svg), uav = $('[data-flight-uav]', svg);
    const trail = path.cloneNode();
    trail.removeAttribute('data-flight-path');
    trail.setAttribute('class', 'flight__trail');
    path.after(trail);
    const L = path.getTotalLength();
    trail.style.strokeDasharray = L;
    const hud = { mode: $('[data-hud-mode]'), alt: $('[data-hud-alt]'), spd: $('[data-hud-spd]'), pitch: $('[data-hud-pitch]') };
    const GROUND = 258, M_PER_PX = 30 / (GROUND - 84); // seyir 30 m'de
    const PERIOD = 9000, HOLD = 1400;
    const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    let visible = false, clock = 0, prev = 0, hudT = 0;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(svg);
    const draw = s => {
      const p = path.getPointAtLength(s * L);
      const q = path.getPointAtLength(Math.min(L, s * L + 1));
      const r = s * L + 1 > L ? path.getPointAtLength(L - 1) : p;
      const a = Math.atan2(q.y - r.y, q.x - r.x) * 180 / Math.PI;
      // tail-sitter: tırmanırken burun yukarı, inişte de burun yukarı (kuyruk üstü)
      const rot = a > 0 ? -a : a;
      uav.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${rot.toFixed(1)})`);
      trail.style.strokeDashoffset = (L * (1 - s)).toFixed(1);
      return { p, rot };
    };
    draw(0);
    return {
      frame(dt) {
        if (!visible) return;
        clock = (clock + dt) % (PERIOD + HOLD);
        const s = ease(clamp(clock / PERIOD));
        const { p, rot } = draw(s);
        hudT += dt;
        if (hudT < 120) return;
        const v = Math.abs(s - prev) * L * M_PER_PX / (hudT / 1000);
        prev = s; hudT = 0;
        const mode = s >= 1 ? 'ground' : p.x < 60.5 && p.y > 150 ? 'takeoff' : p.x < 140 ? 'ftrans' : p.x < 300 ? 'cruise' : p.y < 150 ? 'btrans' : 'land';
        hud.mode.textContent = t('hud.m.' + mode);
        hud.alt.textContent = `${Math.max(0, (GROUND - p.y) * M_PER_PX).toFixed(1)} m`;
        hud.spd.textContent = `${v.toFixed(1)} m/s`;
        hud.pitch.textContent = `${Math.round(-rot)}°`;
      }
    };
  })();

  /* ---------- Bellek görüntüleyici ---------- */
  const mem = (() => {
    const hex = $('[data-hex]');
    if (!hex) return null;
    const ROWS = 12, COLS = 8;
    const h2 = n => n.toString(16).toUpperCase().padStart(2, '0');
    const rb = () => h2((Math.random() * 256) | 0);
    const base = 0x7FF61A2B3C40;
    const rows = [];
    hex.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
      const line = document.createElement('span');
      line.className = 'hex__row';
      const addr = document.createElement('i');
      addr.textContent = (base + r * COLS).toString(16).toUpperCase().slice(-8);
      line.appendChild(addr);
      const bytes = [];
      for (let c = 0; c < COLS; c++) {
        const b = document.createElement('span');
        b.textContent = rb();
        line.appendChild(b); bytes.push(b);
      }
      hex.appendChild(line); rows.push({ line, bytes });
    }
    const offs = $$('[data-off]');
    let visible = false, t = 0, scan = 0, resolveT = 0;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hex);
    const resolve = () => {
      offs.forEach((el, i) => {
        const final = '+0x' + ((0x100 + Math.random() * 0x1400) | 0).toString(16).toUpperCase();
        let n = 0;
        setTimeout(function scramble() {
          el.textContent = '+0x' + Array.from({ length: final.length - 3 }, () => '0123456789ABCDEF'[(Math.random() * 16) | 0]).join('');
          el.classList.remove('ok');
          if (++n < 10) setTimeout(scramble, 50);
          else { el.textContent = final; el.classList.add('ok'); }
        }, i * 200);
      });
    };
    return {
      frame(dt) {
        if (!visible) return;
        t += dt; resolveT -= dt;
        if (resolveT <= 0) { resolve(); resolveT = 7000; }
        if (t < 90) return;
        t = 0;
        rows[scan].line.classList.remove('is-scan');
        scan = (scan + 1) % ROWS;
        rows[scan].line.classList.add('is-scan');
        for (let k = 0; k < 3; k++) {
          const row = rows[(Math.random() * ROWS) | 0];
          const b = row.bytes[(Math.random() * COLS) | 0];
          b.textContent = rb();
          b.classList.remove('flip'); void b.offsetWidth; b.classList.add('flip');
        }
      }
    };
  })();

  /* ---------- Reveal ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .18, rootMargin: '0px 0px -5% 0px' });
  $$('[data-reveal], [data-pcard], .tile').forEach(el => io.observe(el));

  /* ---------- Terminal ---------- */
  const term = $('[data-terminal]');
  if (term) {
    const out = $('[data-terminal-out]', term);
    const script = [
      ['$ ', 'php migrations/run.php', 'cmd'],
      ['', '  → 0007_create_pins.sql', 'dim'],
      ['', 'term.ok1', 'ok'],
      ['$ ', 'curl -s /api/v1/feed?near=41.0,28.9', 'cmd'],
      ['', '{ "ok": true, "pins": 128 }', 'dim'],
      ['$ ', 'px4/sitl_hover_check.sh', 'cmd'],
      ['', 'term.ok2', 'ok'],
    ];
    let started = false;
    const run = async () => {
      const wait = ms => new Promise(r => setTimeout(r, ms));
      for (;;) {
        out.innerHTML = '';
        for (const [prompt, text, kind] of script) {
          const line = document.createElement('span');
          line.className = kind === 'ok' ? 'c-ok' : kind === 'dim' ? 'c-dim' : '';
          out.appendChild(line);
          line.textContent = prompt;
          if (kind === 'cmd' && !reduce) {
            for (const ch of text) { line.textContent += ch; await wait(28 + Math.random() * 40); }
            await wait(320);
          } else { line.textContent += kind === 'ok' ? t(text) : text; await wait(reduce ? 0 : 260); }
          out.appendChild(document.createTextNode('\n'));
        }
        if (reduce) return;
        await wait(3200);
      }
    };
    new IntersectionObserver(([e], o) => { if (e.isIntersecting && !started) { started = true; o.disconnect(); run(); } }, { threshold: .4 }).observe(term);
  }

  /* ---------- Spotlight kartlar ---------- */
  $$('[data-spot]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Tilt ---------- */
  if (finePointer && !reduce) {
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Manyetik ---------- */
  const magnets = finePointer && !reduce ? $$('[data-magnetic]').map(el => ({ el, x: 0, y: 0, tx: 0, ty: 0 })) : [];
  magnets.forEach(m => {
    m.el.addEventListener('pointermove', e => {
      const r = m.el.getBoundingClientRect();
      m.tx = (e.clientX - (r.left + r.width / 2)) * .35;
      m.ty = (e.clientY - (r.top + r.height / 2)) * .35;
    });
    m.el.addEventListener('pointerleave', () => { m.tx = m.ty = 0; });
  });

  /* ---------- İmleç ---------- */
  const cur = $('.cursor'), dot = $('.cursor-dot'), curLabel = $('.cursor span');
  const cpos = { x: vw / 2, y: vh / 2 };
  addEventListener('pointermove', e => {
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
    if (finePointer) document.body.classList.add('has-cursor');
  }, { passive: true });
  document.addEventListener('pointerleave', () => { pointer.active = false; document.body.classList.remove('has-cursor'); });
  if (finePointer) {
    addEventListener('pointerdown', () => cur.classList.add('is-down'));
    addEventListener('pointerup', () => cur.classList.remove('is-down'));
    document.addEventListener('pointerover', e => {
      const lab = e.target.closest('[data-cursor]');
      const hov = e.target.closest('a, button, [data-tilt]');
      cur.classList.toggle('has-label', !!lab);
      cur.classList.toggle('is-hover', !!hov && !lab);
      if (lab) curLabel.textContent = lab.dataset.cursor;
    });
  }

  /* ---------- Scroll sahneleri ---------- */
  const nav = $('.nav');
  const progress = $('[data-progress]');
  const hero = $('[data-hero]');
  const heroWords = $$('[data-hero-word]');
  const heroPhoto = $('[data-hero-photo]');
  const heroFade = $('[data-hero-fade]');
  const manifesto = $('[data-manifesto]');
  let mWords = $$('.manifesto__text .word');
  langHooks.push(() => { mWords = $$('.manifesto__text .word'); });
  const pcards = $$('[data-pcard]');
  const archive = $('[data-archive]');
  const track = $('[data-archive-track]');
  const marquee = $('.marquee__track');

  // marquee içeriğini çoğalt: kesintisiz döngü
  if (marquee) marquee.innerHTML += marquee.innerHTML;
  let mqX = 0, mqVel = 0, mqW = 0;

  const sizeArchive = () => {
    if (!archive || !track) return;
    const extra = Math.max(0, track.scrollWidth - vw);
    archive.style.height = `${vh + extra}px`;
    archive._extra = extra;
  };
  const measure = () => {
    vw = innerWidth; vh = innerHeight;
    sizeArchive();
    mqW = marquee ? marquee.scrollWidth / 2 : 0;
  };
  measure();
  addEventListener('resize', measure);
  langHooks.push(measure);
  document.fonts && document.fonts.ready.then(measure);

  let sy = scrollY, lastY = scrollY, lastNavY = scrollY;
  const smooth = { hero: 0, manifesto: 0, archive: 0 };

  const scenes = () => {
    const y = scrollY;
    const vel = y - lastY; lastY = y;
    sy = lerp(sy, y, .14);

    // progress
    const max = document.documentElement.scrollHeight - vh;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    // nav: aşağı kaydırınca gizle
    if (root.classList.contains('is-ready')) {
      if (y > vh * .6 && y > lastNavY + 6) nav.classList.add('is-hidden');
      else if (y < lastNavY - 6 || y < vh * .6) nav.classList.remove('is-hidden');
      if (Math.abs(y - lastNavY) > 6) lastNavY = y;
    }

    if (reduce) return vel;

    // hero
    if (sy < vh * 1.2) {
      const p = clamp(sy / hero.offsetHeight);
      heroWords.forEach(w => { w.style.transform = `translate3d(0, calc(-62% + ${p * -22}vh), 0) scale(${1 + p * .12})`; });
      const mx = pointer.active && finePointer ? (pointer.x / vw - .5) : 0;
      const my = pointer.active && finePointer ? (pointer.y / vh - .5) : 0;
      smooth.mx = lerp(smooth.mx || 0, mx, .06); smooth.my = lerp(smooth.my || 0, my, .06);
      heroPhoto.style.transform = `translate3d(calc(-50% + ${smooth.mx * -14}px), ${p * 14 + smooth.my * -6}vh, 0) scale(${1 - p * .1})`;
      heroWords[0].style.translate = `${smooth.mx * 24}px 0`;
      heroWords[1].style.translate = `${smooth.mx * 36}px 0`;
      heroFade.style.opacity = String(1 - clamp(p * 2.2));
    }

    // manifesto: kelimeleri sırayla aydınlat
    if (manifesto) {
      const r = manifesto.getBoundingClientRect();
      const p = clamp((-r.top + vh * .25) / (r.height - vh * .9));
      const n = mWords.length;
      mWords.forEach((w, i) => {
        const o = .14 + .86 * clamp(p * n * 1.05 - i);
        w.style.setProperty('--o', o.toFixed(3));
      });
    }

    // proje kartları: bir sonraki geldikçe küçülüp kararır
    // mobilde kartlar sticky değil, istif efekti yok
    if (vw > 900) pcards.forEach((c, i) => {
      const next = pcards[i + 1];
      if (!next) return;
      const r = next.getBoundingClientRect();
      const q = clamp((vh - r.top) / (vh * .85));
      c.style.transform = `scale(${1 - q * .06})`;
      c.style.setProperty('--dim', (q * .45).toFixed(3));
    });

    // yatay arşiv
    if (archive && archive._extra) {
      const r = archive.getBoundingClientRect();
      const p = clamp(-r.top / (r.height - vh));
      smooth.archive = lerp(smooth.archive, p, .12);
      track.style.transform = `translate3d(${-smooth.archive * archive._extra}px, 0, 0)`;
    }

    return vel;
  };

  /* ---------- Ana döngü ---------- */
  let last = performance.now();
  const loop = now => {
    const dt = Math.min(64, now - last); last = now;
    const vel = scenes();

    // marquee: kaydırma hızıyla ivmelenir
    if (marquee && mqW && !reduce) {
      mqVel = lerp(mqVel, Math.abs(vel) * .6, .1);
      mqX -= (dt * .05) + mqVel;
      if (mqX <= -mqW) mqX += mqW;
      marquee.style.transform = `translate3d(${mqX}px, 0, 0)`;
    }

    // imleç
    if (finePointer) {
      cpos.x = lerp(cpos.x, pointer.x, .18); cpos.y = lerp(cpos.y, pointer.y, .18);
      cur.style.transform = `translate3d(${cpos.x}px, ${cpos.y}px, 0)`;
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
    }
    magnets.forEach(m => {
      m.x = lerp(m.x, m.tx, .15); m.y = lerp(m.y, m.ty, .15);
      m.el.style.translate = `${m.x.toFixed(2)}px ${m.y.toFixed(2)}px`;
    });

    if (!reduce) {
      contours.forEach(c => c.frame(dt));
      flight && flight.frame(dt);
      mem && mem.frame(dt);
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  // reduced motion: tek kare çiz
  if (reduce) {
    setTimeout(() => contours.forEach(c => { c.visible = true; c.frame(16); }), 100);
  }

  /* ---------- Footer ---------- */
  const clock = $('[data-clock]');
  const fmt = new Intl.DateTimeFormat('tr-TR', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const tickClock = () => { clock.textContent = fmt.format(new Date()); };
  tickClock(); setInterval(tickClock, 1000);
  $('[data-year]').textContent = new Date().getFullYear();
})();
