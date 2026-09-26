/* ==========================================================================
   GLCooper Publications — starfield background + cover fallback
   Upload to: public_html/starfield.js
   ========================================================================== */
(function () {
  'use strict';

  /* ── 1. Starfield ───────────────────────────────────────────────────── */
  var canvas = document.getElementById('sky');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var stars = [];
    var w = 0, h = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var reduced = window.matchMedia &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function seed() {
      var count = Math.max(70, Math.min(260, Math.round((w * h) / 11000)));
      stars = [];
      for (var i = 0; i < count; i++) {
        var r = Math.random();
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: r > 0.965 ? 1.5 + Math.random() * 0.9 : 0.35 + Math.random() * 0.75,
          base: r > 0.965 ? 0.75 : 0.18 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
          speed: 0.0004 + Math.random() * 0.0011,
          warm: Math.random() > 0.82
        });
      }
    }

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      draw(0);
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#070e1e';
      ctx.fillRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var a = reduced
          ? s.base
          : s.base * (0.62 + 0.38 * Math.sin(s.phase + t * s.speed));
        if (a < 0.02) continue;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.warm
          ? 'rgba(242,223,174,' + a.toFixed(3) + ')'
          : 'rgba(224,236,255,' + a.toFixed(3) + ')';
        ctx.fill();
        if (s.r > 1.4) {
          var g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 6);
          g.addColorStop(0, 'rgba(200,222,255,' + (a * 0.32).toFixed(3) + ')');
          g.addColorStop(1, 'rgba(200,222,255,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function loop(t) {
      draw(t);
      window.requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    resize();
    if (!reduced && window.requestAnimationFrame) {
      window.requestAnimationFrame(loop);
    }
  }

  /* ── 2. Missing cover art falls back to the typographic cover ────────── */
  var imgs = document.querySelectorAll('.cover > img, .portrait > img');
  Array.prototype.forEach.call(imgs, function (img) {
    img.addEventListener('error', function () {
      if (img.parentNode) img.parentNode.removeChild(img);
    });
    if (img.complete && img.naturalWidth === 0 && img.parentNode) {
      img.parentNode.removeChild(img);
    }
  });
})();
