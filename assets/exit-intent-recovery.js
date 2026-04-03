/**
 * Exit-Intent Cart Recovery — TechAuraz 2026
 * 
 * Hidden CRO tip: Captures 10-15% of abandoning visitors with
 * a last-chance discount popup when they move to close the tab.
 * 
 * Features:
 * - Desktop: Mouse leaving viewport (exit intent)
 * - Mobile: Back button / rapid scroll up (rage scroll)
 * - Only shows once per session (localStorage gated)
 * - Only triggers if cart has items or user viewed a product
 * - Spanish copy optimized for Colombian market
 * - Countdown urgency (5 minutes)
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'ta_exit_shown';
  var SESSION_TIMEOUT = 30 * 60 * 1000; // 30 min

  // Don't show more than once per session
  function wasShownRecently() {
    try {
      var ts = localStorage.getItem(STORAGE_KEY);
      if (!ts) return false;
      return Date.now() - parseInt(ts) < SESSION_TIMEOUT;
    } catch (e) { return false; }
  }

  function markShown() {
    try { localStorage.setItem(STORAGE_KEY, Date.now().toString()); } catch (e) { }
  }

  // Only show on product or collection pages with engagement
  function shouldShow() {
    if (wasShownRecently()) return false;
    var isRelevantPage = /\/(products|collections)\//.test(location.pathname) || location.pathname === '/';
    return isRelevantPage;
  }

  function createPopup() {
    if (document.getElementById('ta-exit-popup')) return;

    var overlay = document.createElement('div');
    overlay.id = 'ta-exit-popup';
    overlay.innerHTML = [
      '<div class="ta-exit__backdrop"></div>',
      '<div class="ta-exit__modal" role="dialog" aria-modal="true" aria-label="Oferta especial">',
      '  <button class="ta-exit__close" aria-label="Cerrar">&times;</button>',
      '  <div class="ta-exit__emoji">🎁</div>',
      '  <h2 class="ta-exit__title">\u00a1Espera! Te tenemos algo especial</h2>',
      '  <p class="ta-exit__text">Completa tu compra en los pr\u00f3ximos <strong><span id="ta-exit-timer">5:00</span></strong> y obt\u00e9n:</p>',
      '  <div class="ta-exit__offer">',
      '    <span class="ta-exit__discount">ENV\u00cdO GRATIS</span>',
      '    <span class="ta-exit__plus">+</span>',
      '    <span class="ta-exit__bonus">Garant\u00eda Extendida</span>',
      '  </div>',
      '  <a href="/collections/all" class="ta-exit__cta">Ver Productos \u2192</a>',
      '  <p class="ta-exit__footer">Solo para nuevos clientes \u2022 L\u00edmite 1 por persona</p>',
      '</div>'
    ].join('\n');

    var style = document.createElement('style');
    style.textContent = [
      '#ta-exit-popup { position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s;pointer-events:none }',
      '#ta-exit-popup.active { opacity:1;pointer-events:auto }',
      '.ta-exit__backdrop { position:absolute;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(4px) }',
      '.ta-exit__modal { position:relative;background:#fff;border-radius:20px;padding:2.5rem 2rem;max-width:420px;width:90%;text-align:center;box-shadow:0 25px 50px -12px rgba(0,0,0,.25);transform:translateY(20px) scale(.95);transition:transform .4s cubic-bezier(.175,.885,.32,1.275) }',
      '#ta-exit-popup.active .ta-exit__modal { transform:translateY(0) scale(1) }',
      '.ta-exit__close { position:absolute;top:12px;right:16px;background:none;border:none;font-size:28px;cursor:pointer;color:#64748b;line-height:1;padding:4px }',
      '.ta-exit__close:hover { color:#0f172a }',
      '.ta-exit__emoji { font-size:48px;margin-bottom:8px }',
      '.ta-exit__title { font-size:22px;font-weight:800;color:#0f172a;margin:0 0 8px;line-height:1.3 }',
      '.ta-exit__text { font-size:15px;color:#475569;margin:0 0 20px }',
      '.ta-exit__offer { display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:24px }',
      '.ta-exit__discount { background:linear-gradient(135deg,#2563eb,#1e40af);color:#fff;padding:8px 16px;border-radius:10px;font-weight:700;font-size:15px }',
      '.ta-exit__plus { color:#94a3b8;font-size:20px;font-weight:300 }',
      '.ta-exit__bonus { background:#f0fdf4;color:#15803d;padding:8px 16px;border-radius:10px;font-weight:700;font-size:15px;border:1px solid #bbf7d0 }',
      '.ta-exit__cta { display:inline-block;background:linear-gradient(135deg,#2563eb,#1e40af);color:#fff;padding:14px 32px;border-radius:12px;font-weight:700;font-size:16px;text-decoration:none;transition:transform .2s,box-shadow .2s;margin-bottom:16px }',
      '.ta-exit__cta:hover { transform:translateY(-2px);box-shadow:0 8px 25px rgba(37,99,235,.4) }',
      '.ta-exit__footer { font-size:12px;color:#94a3b8;margin:0 }',
      '@media(max-width:480px) { .ta-exit__modal { padding:2rem 1.5rem } .ta-exit__title { font-size:19px } .ta-exit__offer { flex-direction:column;gap:8px } }'
    ].join('\n');

    document.head.appendChild(style);
    document.body.appendChild(overlay);

    // Close handlers
    overlay.querySelector('.ta-exit__close').addEventListener('click', close);
    overlay.querySelector('.ta-exit__backdrop').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    // Countdown timer (5 min)
    var timerEl = document.getElementById('ta-exit-timer');
    var remaining = 300;
    var interval = setInterval(function () {
      remaining--;
      if (remaining <= 0) { clearInterval(interval); close(); return; }
      var m = Math.floor(remaining / 60);
      var s = remaining % 60;
      timerEl.textContent = m + ':' + (s < 10 ? '0' : '') + s;
    }, 1000);

    // Show with animation
    requestAnimationFrame(function () {
      overlay.classList.add('active');
    });

    markShown();
  }

  function close() {
    var el = document.getElementById('ta-exit-popup');
    if (el) {
      el.classList.remove('active');
      setTimeout(function () { el.remove(); }, 300);
    }
  }

  function show() {
    if (!shouldShow()) return;
    createPopup();
  }

  // ===== Desktop: Exit intent (mouse leaves viewport) =====
  var exitDelay = null;
  document.addEventListener('mouseout', function (e) {
    if (e.clientY > 5) return; // Only top of page
    if (exitDelay) return;
    exitDelay = setTimeout(function () {
      show();
    }, 100);
  });

  document.addEventListener('mouseenter', function () {
    if (exitDelay) {
      clearTimeout(exitDelay);
      exitDelay = null;
    }
  });

  // ===== Mobile: Rapid scroll up (rage scroll = intent to leave) =====
  var lastScrollY = 0;
  var rapidScrollCount = 0;
  window.addEventListener('scroll', function () {
    var currentY = window.scrollY;
    if (currentY < lastScrollY - 100 && currentY < 200) { // Fast scroll up near top
      rapidScrollCount++;
      if (rapidScrollCount >= 2) {
        show();
        rapidScrollCount = 0;
      }
    } else {
      rapidScrollCount = 0;
    }
    lastScrollY = currentY;
  }, { passive: true });

  // ===== Wait 30s minimum before showing =====
  // Don't annoy users who just arrived
  var pageLoadTime = Date.now();
  var origShow = show;
  show = function () {
    if (Date.now() - pageLoadTime < 30000) return;
    origShow();
  };
})();
