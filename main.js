/* Shared interactivity — drawing-set edition.
   Theme, sheet frame, mobile nav, reveal, lightbox, project filter,
   drawing-sheet modal (with live 3D), work orders, journey map. */
(function () {
  document.documentElement.classList.add('js');
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // for the curious — hello from the title block
  try {
    console.log(
      '%c┌──────────────────────────────────┐\n' +
      '│  GK ENGINEERING — DRAWING SET    │\n' +
      '│  DRAWN BY: G. KIM   ·   REV C    │\n' +
      '│  ghkim1106@connect.hku.hk        │\n' +
      '└──────────────────────────────────┘',
      'font: 600 11px/1.5 monospace; color: #1d4e89;'
    );
  } catch (e) {}

  // Fix blank screen on Back / bfcache
  window.addEventListener('pageshow', function () { document.body.classList.remove('page-leaving'); });

  // Footer year
  document.querySelectorAll('span[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // ---- Theme toggle ----
  var moon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var sun = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19"/></svg>';
  // ---- Language (EN / KO) ----
  var DICT = window.I18N || {};
  var lang = 'en';
  try { lang = localStorage.getItem('lang') === 'ko' ? 'ko' : 'en'; } catch (e) {}
  var langPainters = [];
  function t(key) { var e = DICT[key]; return e ? (e[lang] || e.en) : null; }
  function applyLang() {
    document.documentElement.setAttribute('lang', lang === 'ko' ? 'ko' : 'en');
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (v != null) el.innerHTML = v;
    });
    // topbar nav labels (keep the <i>NN</i> sheet number)
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      var file = (a.getAttribute('href') || '').split('/').pop().replace('.html', '') || 'index';
      var v = t('nav.' + file);
      if (v != null) {
        var i = a.querySelector('i');
        a.innerHTML = (i ? i.outerHTML : '') + v;
      }
    });
    langPainters.forEach(function (p) { p(); });
  }
  function setLang(l) {
    lang = l;
    try { localStorage.setItem('lang', l); } catch (e) {}
    applyLang();
  }

  var themePainters = [];
  function wireTheme(btn, withLabel) {
    function paint() {
      var dark = document.documentElement.classList.contains('dark');
      btn.innerHTML = (dark ? sun : moon) +
        (withLabel ? '<span class="dock-label">' + (t(dark ? 'ui.light' : 'ui.dark') || (dark ? 'Light' : 'Dark')) + '</span>' : '');
    }
    paint(); themePainters.push(paint); langPainters.push(paint);
    btn.addEventListener('click', function () {
      var dark = document.documentElement.classList.toggle('dark');
      try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
      themePainters.forEach(function (p) { p(); });
    });
  }
  document.querySelectorAll('.theme-btn').forEach(function (b) { wireTheme(b, false); });

  // language button — top right of the bar, before the mobile hamburger
  (function () {
    var tb = document.querySelector('.topbar .tb-inner');
    if (!tb) return;
    var btn = document.createElement('button');
    btn.className = 'lang-btn'; btn.type = 'button';
    function paint() {
      btn.textContent = lang === 'ko' ? 'EN' : '한국어';
      btn.setAttribute('aria-label', lang === 'ko' ? 'Switch to English' : '한국어로 보기');
    }
    paint(); langPainters.push(paint);
    btn.addEventListener('click', function () { setLang(lang === 'ko' ? 'en' : 'ko'); });
    var toggleBtn = tb.querySelector('.nav-toggle');
    tb.insertBefore(btn, toggleBtn || null);
  })();

  // ---- Dock: flat sheet-tab rail (desktop; CSS hides it under 900px) ----
  (function () {
    var path = location.pathname.split('/').pop() || 'index.html';
    var items = [
      ['index.html', '01', 'Home'],
      ['about.html', '02', 'About'],
      ['cv.html', '03', 'CV'],
      ['projects.html', '04', 'Projects'],
      ['personal.html', '05', 'Personal'],
      ['blog.html', '06', 'Log']
    ];
    var dock = document.createElement('nav');
    dock.className = 'dock'; dock.setAttribute('aria-label', 'Sheets');
    dock.innerHTML = items.map(function (it) {
      var active = (path === it[0] || (path === '' && it[0] === 'index.html') ||
                    (path === 'post.html' && it[0] === 'blog.html')) ? ' active' : '';
      var key = 'nav.' + it[0].replace('.html', '');
      return '<a class="dock-link' + active + '" href="' + it[0] + '" aria-label="' + it[2] + '"' +
        (active ? ' aria-current="page"' : '') + '>' +
        it[1] + '<span class="dock-label" data-dock-key="' + key + '">' + it[1] + ' &middot; ' + it[2] + '</span></a>';
    }).join('');
    var themeBtn = document.createElement('button');
    themeBtn.className = 'dock-link'; themeBtn.type = 'button';
    themeBtn.setAttribute('aria-label', 'Toggle dark mode');
    wireTheme(themeBtn, true);
    dock.appendChild(themeBtn);
    document.body.appendChild(dock);
    langPainters.push(function () {
      dock.querySelectorAll('[data-dock-key]').forEach(function (lbl) {
        var v = t(lbl.getAttribute('data-dock-key'));
        if (v != null) lbl.innerHTML = lbl.textContent.split('·')[0].trim() + ' &middot; ' + v;
      });
    });
  })();

  // ---- Drafting cursor: crosshair guides, coords, grid snap, bracket lock ----
  var finePointer = window.matchMedia && window.matchMedia('(pointer:fine)').matches;
  if (finePointer) {
    document.documentElement.classList.add('has-xcur');

    var glow = document.createElement('div');
    glow.className = 'grid-glow'; document.body.appendChild(glow);

    // halo of drafting crosses at grid intersections around the cursor
    var xf = document.createElement('canvas');
    xf.style.cssText = 'position:fixed;inset:0;z-index:-1;pointer-events:none;';
    document.body.appendChild(xf);
    var xfCtx = xf.getContext('2d');
    var xfColor = '29,78,137';
    function xfTheme() {
      xfColor = document.documentElement.classList.contains('dark') ? '89,166,240' : '29,78,137';
    }
    xfTheme(); themePainters.push(xfTheme);
    function xfSize() { xf.width = window.innerWidth; xf.height = window.innerHeight; }
    xfSize(); window.addEventListener('resize', xfSize);
    var XF_R = 170, GRID = 28;
    function xfDraw(cx, cy) {
      xfCtx.clearRect(0, 0, xf.width, xf.height);
      if (cx < 0) return;
      var x0 = Math.max(0, Math.floor((cx - XF_R) / GRID) * GRID - 1);
      var y0 = Math.max(0, Math.floor((cy - XF_R) / GRID) * GRID - 1);
      for (var gx = x0; gx <= cx + XF_R; gx += GRID) {
        for (var gy = y0; gy <= cy + XF_R; gy += GRID) {
          var d = Math.hypot(gx - cx, gy - cy);
          if (d > XF_R) continue;
          var a = (1 - d / XF_R);
          a = a * a * 0.55;
          var s = 2.4 + a * 4;
          xfCtx.strokeStyle = 'rgba(' + xfColor + ',' + a.toFixed(3) + ')';
          xfCtx.lineWidth = 1;
          xfCtx.beginPath();
          xfCtx.moveTo(gx - s, gy); xfCtx.lineTo(gx + s, gy);
          xfCtx.moveTo(gx, gy - s); xfCtx.lineTo(gx, gy + s);
          xfCtx.stroke();
        }
      }
    }

    var xc = document.createElement('div');
    xc.className = 'xcur'; xc.setAttribute('aria-hidden', 'true');
    xc.innerHTML = '<span class="xc-h"></span><span class="xc-v"></span>' +
      '<span class="xc-snap"></span><span class="xc-read"></span>' +
      '<span class="xc-box"><i class="b1"></i><i class="b2"></i><i class="b3"></i><i class="b4"></i></span>' +
      '<span class="xc-dot"></span>';
    document.body.appendChild(xc);
    var xcH = xc.querySelector('.xc-h'), xcV = xc.querySelector('.xc-v'),
        xcDot = xc.querySelector('.xc-dot'), xcSnap = xc.querySelector('.xc-snap'),
        xcRead = xc.querySelector('.xc-read'), xcBox = xc.querySelector('.xc-box');

    var mx = -200, my = -200, ticking = false, boxEl = null;
    var rootStyle = document.documentElement.style;
    var LOCK_SEL = 'a,button,.btn,.ptile,.role-card,.song,.fact,.tags span,.pf-btn,' +
      '.photo-slot,.gallery img,.theme-btn,.nav-toggle,input[type="range"],.now-card,.post-list li,tr[data-href]';
    // text the readout should get out of the way of (non-interactive)
    var TEXT_SEL = 'p,h1,h2,h3,h4,h5,h6,li,blockquote,figcaption,caption,td,th,dt,dd,' +
      'label,em,strong,code,pre,summary,.role-name,.role-org,.now-label,.now-tag,' +
      '.song-title,.song-artist,.ptile-title,.ptile-desc,.fig-label,.city-label,.tagline,.lede';

    function paint() {
      ticking = false;
      xcH.style.transform = 'translateY(' + my + 'px)';
      xcV.style.transform = 'translateX(' + mx + 'px)';
      xcDot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      // snap to the nearest 28px grid intersection (grid is fixed at -1px offset)
      var gx = Math.round((mx + 1) / 28) * 28 - 1;
      var gy = Math.round((my + 1) / 28) * 28 - 1;
      xcSnap.style.transform = 'translate(' + gx + 'px,' + gy + 'px)';
      xcRead.style.transform = 'translate(' + (mx + 16) + 'px,' + (my + 18) + 'px)';
      xcRead.textContent = 'X ' + String(Math.max(0, Math.round(mx))).padStart(4, '0') +
                           '  Y ' + String(Math.max(0, Math.round(my))).padStart(4, '0');
      rootStyle.setProperty('--mx', mx + 'px');
      rootStyle.setProperty('--my', my + 'px');
      xfDraw(mx, my);
      if (boxEl) {
        var r = boxEl.getBoundingClientRect();
        xcBox.style.transform = 'translate(' + (r.left - 6) + 'px,' + (r.top - 6) + 'px)';
        xcBox.style.width = (r.width + 12) + 'px';
        xcBox.style.height = (r.height + 12) + 'px';
      }
    }
    function queue() { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      document.documentElement.classList.add('xcur-on');
      queue();
    }, { passive: true });
    document.addEventListener('mouseleave', function () {
      document.documentElement.classList.remove('xcur-on');
      xfDraw(-1, -1);
    });
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest ? e.target.closest(LOCK_SEL) : null;
      boxEl = t;
      xc.classList.toggle('lock', !!t);
      // hide the X/Y readout over plain text (not just interactive elements)
      xc.classList.toggle('on-text', !t && !!(e.target.closest && e.target.closest(TEXT_SEL)));
      queue();
    });
    window.addEventListener('scroll', function () { if (boxEl) queue(); }, { passive: true });
  }

  // ---- Sheet frame (drawing border with zone markers, desktop) ----
  var frame = document.createElement('div');
  frame.className = 'sheet-frame'; frame.setAttribute('aria-hidden', 'true');
  frame.innerHTML =
    '<span class="sf-zone za">A</span><span class="sf-zone zb">B</span>' +
    '<span class="sf-zone zc">C</span><span class="sf-zone z1">1</span><span class="sf-zone z2">2</span>';
  document.body.appendChild(frame);

  // ---- Back-to-top ----
  var top = document.createElement('button');
  top.className = 'to-top'; top.setAttribute('aria-label', 'Back to top');
  top.innerHTML = '&uarr;';
  top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  document.body.appendChild(top);

  var cue = document.querySelector('.scroll-cue');
  function onScroll() {
    var h = document.documentElement;
    top.classList.toggle('show', h.scrollTop > 400);
    if (cue) cue.classList.toggle('hide', h.scrollTop > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Clickable rows (hero BOM etc.) ----
  document.querySelectorAll('[data-href]').forEach(function (row) {
    row.addEventListener('click', function () { location.href = row.getAttribute('data-href'); });
    row.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); location.href = row.getAttribute('data-href'); }
    });
  });

  // ---- Mobile nav ----
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  // ---- Scroll reveal ----
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i, 6) * 50) + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // ---- Lightbox ----
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<img alt="">';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector('img');
  function openLightbox(src, alt) { lbImg.src = src; lbImg.alt = alt || ''; lb.classList.add('open'); }
  function closeLightbox() { lb.classList.remove('open'); }
  lb.addEventListener('click', closeLightbox);
  document.querySelectorAll('.gallery img, .photo-slot img').forEach(function (img) {
    img.addEventListener('click', function () { openLightbox(img.src, img.alt); });
  });

  // ---- Projects: category filter ----
  var filterBar = document.getElementById('proj-filters');
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.ptile'));
  if (filterBar && tiles.length) {
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.pf-btn') : null;
      if (!btn) return;
      var cat = btn.getAttribute('data-filter');
      filterBar.querySelectorAll('.pf-btn').forEach(function (b) { b.classList.toggle('active', b === btn); });
      tiles.forEach(function (p) {
        var cats = (p.getAttribute('data-cat') || '').split(' ');
        var match = cat === 'all' || cats.indexOf(cat) !== -1;
        if (match) {
          p.hidden = false;
          requestAnimationFrame(function () { p.classList.remove('filtered'); });
        } else {
          p.classList.add('filtered');
          setTimeout(function () { if (p.classList.contains('filtered')) p.hidden = true; }, 320);
        }
      });
    });
  }

  // ---- Projects: drawing-sheet modal ----
  if (tiles.length) {
    var modal = document.createElement('div');
    modal.className = 'proj-modal';
    modal.innerHTML = '<div class="pm-sheet" role="dialog" aria-modal="true" aria-label="Project sheet">' +
      '<div class="pm-head"><span>GK ENGINEERING — <b class="pm-dwg"></b></span>' +
      '<button class="pm-close" aria-label="Close">&times;</button></div>' +
      '<div class="pm-body"></div></div>';
    document.body.appendChild(modal);
    var pmBody = modal.querySelector('.pm-body');
    var pmSheet = modal.querySelector('.pm-sheet');
    var pmDwg = modal.querySelector('.pm-dwg');
    var viewerHandle = null;
    var attr = function (el, a) { return el.getAttribute(a) || '—'; };
    var esc1 = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

    var openModal = function (tile) {
      var title = attr(tile, 'data-title');
      var tag = attr(tile, 'data-tag');
      var id = attr(tile, 'data-id');
      var detail = tile.querySelector('.proj-detail');
      var gallery = tile.querySelectorAll('.proj-gallery img');
      var model = tile.getAttribute('data-model-src') ||
        (tile.querySelector('.ptile-stage') && tile.querySelector('.ptile-stage').getAttribute('data-model'));
      var fallback = tile.querySelector('.robot-fallback');

      var strip = '';
      gallery.forEach(function (im) {
        var src = im.getAttribute('src'); if (src) strip += '<img src="' + src + '" alt="' + esc1(im.getAttribute('alt') || '') + '">';
      });

      // revision history from data-revs: "A|desc;;B|desc;;C|desc"
      var revs = '';
      var rawRevs = tile.getAttribute('data-revs');
      if (rawRevs) {
        var rows = rawRevs.split(';;').map(function (r) {
          var parts = r.split('|');
          return '<tr><td>' + esc1(parts[0] || '') + '</td><td>' + esc1(parts[1] || '') + '</td><td>' + esc1(parts[2] || '') + '</td></tr>';
        }).join('');
        revs = '<table class="pm-revs"><caption>Revision history</caption>' +
          '<thead><tr><th>REV</th><th>DESCRIPTION</th><th>DATE</th></tr></thead><tbody>' + rows + '</tbody></table>';
      }

      var stage = '';
      if (model) {
        stage = '<div class="pm-stage" data-model="' + model + '"' +
          (tile.querySelector('[data-rx]') ? ' data-rx="' + tile.querySelector('[data-rx]').getAttribute('data-rx') + '"' : '') +
          (tile.querySelector('[data-ry]') ? ' data-ry="' + tile.querySelector('[data-ry]').getAttribute('data-ry') + '"' : '') + '>' +
          (fallback ? '<img class="robot-fallback" src="' + fallback.getAttribute('src') + '" alt="">' : '') +
          '<span class="robot-hint">drag to rotate</span></div>';
      }

      pmDwg.textContent = 'DWG ' + id;
      pmBody.innerHTML =
        '<p class="pm-tag">' + esc1(tag) + '</p>' +
        '<h2 class="pm-title">' + esc1(title) + '</h2>' +
        stage +
        '<div class="pm-detail">' + (detail ? detail.innerHTML : '') + '</div>' +
        (strip ? '<div class="pm-strip">' + strip + '</div>' : '') +
        revs +
        '<table class="pm-block"><tbody>' +
        '<tr><th>DWG</th><td>' + esc1(id) + '</td><th>YEAR</th><td>' + esc1(attr(tile, 'data-year')) + '</td></tr>' +
        '<tr><th>ROLE</th><td colspan="3">' + esc1(attr(tile, 'data-role')) + '</td></tr>' +
        '<tr><th>STACK</th><td colspan="3">' + esc1(attr(tile, 'data-stack')) + '</td></tr>' +
        '<tr><th>STATUS</th><td colspan="3">' + esc1(attr(tile, 'data-status')) + '</td></tr>' +
        '<tr><th>SCALE</th><td>NTS</td><th>DRAWN</th><td>G. KIM</td></tr>' +
        '</tbody></table>';

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      pmSheet.scrollTop = 0; modal.scrollTop = 0;

      var pmStage = pmBody.querySelector('.pm-stage');
      if (pmStage && window.mountViewer) viewerHandle = window.mountViewer(pmStage);

      pmBody.querySelectorAll('.pm-strip img').forEach(function (im) {
        im.addEventListener('click', function () { openLightbox(im.src, im.alt); });
      });
    };

    var closeModal = function () {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (viewerHandle) { try { viewerHandle.dispose(); } catch (e) {} viewerHandle = null; }
      pmBody.innerHTML = '';
    };

    tiles.forEach(function (tile) {
      tile.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('.model-stage')) return; // drags rotate the model
        openModal(tile);
      });
      tile.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(tile); }
      });
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal || (e.target.closest && e.target.closest('.pm-close'))) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { if (lb.classList.contains('open')) closeLightbox(); else if (modal.classList.contains('open')) closeModal(); }
    });
  }

  // ---- Stage chrome: loader + center mark + corner annotations ----
  var loaderHTML = '<div class="xh-loader" aria-hidden="true"><span></span></div><span class="ldr-label">loading geometry</span>';
  document.querySelectorAll('.ptile-stage').forEach(function (st, i) {
    if (!st.querySelector('.model-loader') && st.hasAttribute('data-model')) {
      var ldr = document.createElement('div');
      ldr.className = 'model-loader'; ldr.setAttribute('aria-label', 'Loading 3D model');
      ldr.innerHTML = loaderHTML;
      st.appendChild(ldr);
    }
    if (!st.querySelector('.vp-center')) {
      var cm = document.createElement('span'); cm.className = 'vp-center'; st.appendChild(cm);
      var c1 = document.createElement('span'); c1.className = 'vp-corner tl'; c1.textContent = 'VIEW: ISO'; st.appendChild(c1);
      var c2 = document.createElement('span'); c2.className = 'vp-corner br';
      c2.textContent = (st.closest('.ptile') && st.closest('.ptile').getAttribute('data-id')) || ''; st.appendChild(c2);
    }
  });

  // ---- "Active work orders" from now.json ----
  var nowGrid = document.getElementById('now-grid');
  if (nowGrid) {
    fetch('now.json').then(function (r) { return r.json(); }).then(function (d) {
      var items = (d && d.items) || [];
      if (!items.length) { nowGrid.innerHTML = ''; return; }
      nowGrid.innerHTML = items.map(function (it, i) {
        var label = typeof it === 'string' ? it : (it.label || '');
        var tag = (it && it.tag) || '';
        var idx = 'WO-' + String(i + 1).padStart(2, '0');
        return '<li class="now-card"><span class="now-idx">' + idx + '</span>' +
          '<span class="now-label">' + esc(label) + '</span>' +
          '<span class="now-tag">' + esc(tag) + '</span>' +
          '<span class="now-status">&#9679; OPEN</span></li>';
      }).join('');
      var cards = nowGrid.querySelectorAll('.now-card');
      if ('IntersectionObserver' in window && !reduced) {
        var nio = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('shown'); nio.unobserve(e.target); } });
        }, { threshold: 0.2 });
        cards.forEach(function (el, i) { el.style.transitionDelay = (i * 70) + 'ms'; nio.observe(el); });
      } else {
        cards.forEach(function (el) { el.classList.add('shown'); });
      }
    }).catch(function () { nowGrid.innerHTML = ''; });
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  // ---- Journey map: draw the route when it scrolls into view ----
  var journey = document.querySelector('.journey');
  if (journey) {
    var route = journey.querySelector('.route');
    if (route && route.getTotalLength) {
      var len = Math.ceil(route.getTotalLength());
      route.style.strokeDasharray = '6 5';
      journey.style.setProperty('--route-len', len);
      // for the draw animation we need a solid dash the length of the path
      route.style.strokeDasharray = len + ' ' + len;
      route.style.strokeDashoffset = len;
    }
    if ('IntersectionObserver' in window && !reduced) {
      var jio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            journey.classList.add('drawn');
            if (route) {
              route.style.transition = 'stroke-dashoffset 3.2s cubic-bezier(.4,0,.2,1)';
              requestAnimationFrame(function () { route.style.strokeDashoffset = '0'; });
              setTimeout(function () { route.style.strokeDasharray = '6 5'; route.style.strokeDashoffset = ''; route.style.transition = ''; }, 3400);
            }
            jio.unobserve(journey);
          }
        });
      }, { threshold: 0.35 });
      jio.observe(journey);
    } else if (route) {
      route.style.strokeDasharray = '6 5'; route.style.strokeDashoffset = '';
    }
  }

  // translate static content once everything is injected
  applyLang();
})();
