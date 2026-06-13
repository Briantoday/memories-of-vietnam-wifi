(function () {
  'use strict';

  const STORAGE_KEY = 'mov-lang';
  const DEFAULT_LANG = 'en';

  function detectLang() {
    const stored = (() => { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } })();
    if (stored === 'vi' || stored === 'en') return stored;
    const nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
    return nav.startsWith('vi') ? 'vi' : DEFAULT_LANG;
  }

  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-en], [data-vi]').forEach((el) => {
      const text = el.getAttribute('data-' + lang);
      if (text != null) el.textContent = text;
    });
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  }

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (lang) applyLang(lang);
    });
  });

  applyLang(detectLang());

  // === Gallery slideshow ===
  const slides = Array.from(document.querySelectorAll('.gallery-slide'));
  const dots = Array.from(document.querySelectorAll('.g-dot'));
  let current = 0;
  let timer = null;
  const INTERVAL = 5000;

  function showSlide(i) {
    if (i === current) return;
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(() => showSlide(current + 1), INTERVAL);
  }
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showSlide(i);
      startTimer();
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopTimer();
    else startTimer();
  });

  if (slides.length > 1) startTimer();

  // === Map zoom & pan ===
  (function () {
    var container = document.getElementById('mapZoom');
    var img = document.getElementById('mapImg');
    if (!container || !img) return;

    var scale = 1, posX = 0, posY = 0;
    var MIN = 1, MAX = 3.5, STEP = 0.25;
    var isDragging = false, startX, startY, lastPosX, lastPosY;
    var lastTap = 0;

    function clampPos() {
      var cw = container.clientWidth, ch = container.clientHeight;
      var iw = img.naturalWidth || img.clientWidth;
      var ih = img.naturalHeight || img.clientHeight;
      var sw = iw * scale * (cw / iw);
      var sh = ih * scale * (ch / ih);
      var maxX = 0, minX = cw - sw;
      var maxY = 0, minY = ch - sh;
      if (sw <= cw) { posX = (cw - sw) / 2; } else { posX = Math.min(maxX, Math.max(minX, posX)); }
      if (sh <= ch) { posY = (ch - sh) / 2; } else { posY = Math.min(maxY, Math.max(minY, posY)); }
    }

    function applyTransform() {
      clampPos();
      img.style.transform = 'translate(' + posX + 'px,' + posY + 'px) scale(' + scale + ')';
    }

    function zoomTo(newScale, cx, cy) {
      var prev = scale;
      scale = Math.min(MAX, Math.max(MIN, newScale));
      var ratio = scale / prev;
      posX = cx - (cx - posX) * ratio;
      posY = cy - (cy - posY) * ratio;
      applyTransform();
    }

    document.getElementById('mapZoomIn').addEventListener('click', function () {
      var r = container.getBoundingClientRect();
      zoomTo(scale + STEP, r.width / 2, r.height / 2);
    });
    document.getElementById('mapZoomOut').addEventListener('click', function () {
      var r = container.getBoundingClientRect();
      zoomTo(scale - STEP, r.width / 2, r.height / 2);
    });

    container.addEventListener('wheel', function (e) {
      e.preventDefault();
      var r = container.getBoundingClientRect();
      var cx = e.clientX - r.left, cy = e.clientY - r.top;
      zoomTo(scale + (e.deltaY < 0 ? STEP : -STEP), cx, cy);
    }, { passive: false });

    // Pointer drag
    container.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      isDragging = true;
      startX = e.clientX; startY = e.clientY;
      lastPosX = posX; lastPosY = posY;
      container.setPointerCapture(e.pointerId);
    });
    container.addEventListener('pointermove', function (e) {
      if (!isDragging) return;
      posX = lastPosX + (e.clientX - startX);
      posY = lastPosY + (e.clientY - startY);
      applyTransform();
    });
    container.addEventListener('pointerup', function () { isDragging = false; });
    container.addEventListener('pointercancel', function () { isDragging = false; });

    // Pinch-to-zoom
    var pinchDist = 0, pinchScale = 1;
    container.addEventListener('touchstart', function (e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        var dx = e.touches[0].clientX - e.touches[1].clientX;
        var dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchDist = Math.hypot(dx, dy);
        pinchScale = scale;
      }
      // Double-tap zoom
      if (e.touches.length === 1) {
        var now = Date.now();
        if (now - lastTap < 300) {
          e.preventDefault();
          var r = container.getBoundingClientRect();
          var cx = e.touches[0].clientX - r.left;
          var cy = e.touches[0].clientY - r.top;
          if (scale > 1.1) { scale = 1; posX = 0; posY = 0; applyTransform(); }
          else { zoomTo(2.5, cx, cy); }
        }
        lastTap = now;
      }
    }, { passive: false });
    container.addEventListener('touchmove', function (e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        var dx = e.touches[0].clientX - e.touches[1].clientX;
        var dy = e.touches[0].clientY - e.touches[1].clientY;
        var dist = Math.hypot(dx, dy);
        var r = container.getBoundingClientRect();
        var cx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - r.left;
        var cy = (e.touches[0].clientY + e.touches[1].clientY) / 2 - r.top;
        zoomTo(pinchScale * (dist / pinchDist), cx, cy);
      }
    }, { passive: false });
  })();

  // === Reveal on scroll ===
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));
  }
})();
