/* K线形态道场 · Canvas 蜡烛图渲染
   零依赖。一个 canvas 一次只画一张图：
   KChart.render(canvas, series, { showLines, showLabels, showVolume, animate, letters }) */
window.KChart = (function () {
  'use strict';

  var frames = new WeakMap();
  var LEGEND = { cn: { up: '#e5484d', down: '#12a150' }, intl: { up: '#16a34a', down: '#e5484d' } };
  var mode = 'cn';
  var THEME = {
    grid: 'rgba(31, 41, 51, 0.075)',
    text: '#8b95a5',
    line: 'rgba(108, 92, 231, 0.9)',
    point: '#6c5ce7',
    label: '#ffffff'
  };

  function setPalette(m) { mode = m === 'intl' ? 'intl' : 'cn'; }

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function render(canvas, series, opt) {
    if (!canvas || !series || !series.candles || !series.candles.length) return;
    var prev = frames.get(canvas);
    if (prev) cancelAnimationFrame(prev);
    canvas._series = series;
    canvas._opt = opt || {};
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (canvas._opt.animate === false || reduced) {
      paint(canvas, 1);
      return;
    }
    var dur = canvas._opt.duration || 560;
    var start = null;
    function tick(now) {
      if (start === null) start = now;
      var k = Math.min(1, (now - start) / dur);
      paint(canvas, easeOut(k));
      if (k < 1) frames.set(canvas, requestAnimationFrame(tick));
    }
    frames.set(canvas, requestAnimationFrame(tick));
  }

  function redraw(canvas) {
    if (canvas && canvas._series) paint(canvas, 1);
  }

  function paint(canvas, progress) {
    var series = canvas._series;
    if (!series) return;
    var opt = canvas._opt || {};
    var rect = canvas.getBoundingClientRect();
    var cssW = Math.max(100, Math.round(rect.width || canvas.clientWidth || 300));
    var cssH = Math.max(80, Math.round(rect.height || canvas.clientHeight || 160));
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var bw = Math.round(cssW * dpr), bh = Math.round(cssH * dpr);
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw; canvas.height = bh;
    }
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    var pal = LEGEND[mode];
    var candles = series.candles;
    var n = candles.length;
    var showVol = opt.showVolume !== false;
    var padL = 5, padR = 5, padT = 8, padB = 4;
    var volH = showVol ? Math.max(12, cssH * 0.2) : 0;
    var chartH = cssH - padT - volH - padB - (showVol ? 6 : 0);
    var chartW = cssW - padL - padR;
    var step = chartW / n;
    var cw = Math.max(1.4, step * 0.68);

    var min = Infinity, max = -Infinity, i;
    for (i = 0; i < n; i++) {
      if (candles[i].l < min) min = candles[i].l;
      if (candles[i].h > max) max = candles[i].h;
    }
    var span = max - min || 1;
    min -= span * 0.06;
    max += span * 0.06;
    span = max - min;

    function xOf(t) { return padL + t * chartW; }
    function yOf(p) { return padT + (max - p) / span * chartH; }

    // 网格
    ctx.strokeStyle = THEME.grid;
    ctx.lineWidth = 1;
    for (i = 0; i <= 3; i++) {
      var gy = padT + chartH * i / 3;
      ctx.beginPath();
      ctx.moveTo(padL, gy + 0.5);
      ctx.lineTo(cssW - padR, gy + 0.5);
      ctx.stroke();
    }

    // 蜡烛
    var shown = Math.max(1, Math.round(n * progress));
    for (i = 0; i < shown; i++) {
      var c = candles[i];
      var cx = padL + step * (i + 0.5);
      var up = c.c >= c.o;
      var col = up ? pal.up : pal.down;
      var top = yOf(Math.max(c.o, c.c));
      var bot = yOf(Math.min(c.o, c.c));
      var hh = Math.max(1, bot - top);
      ctx.strokeStyle = col;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, yOf(c.h));
      ctx.lineTo(cx, yOf(c.l));
      ctx.stroke();
      ctx.fillStyle = col;
      ctx.fillRect(cx - cw / 2, top, cw, hh);
    }

    // 成交量
    if (showVol) {
      var vBase = cssH - padB;
      ctx.globalAlpha = 0.28;
      for (i = 0; i < shown; i++) {
        var cc = candles[i];
        var vh = Math.max(1, cc.v * volH);
        ctx.fillStyle = cc.c >= cc.o ? pal.up : pal.down;
        ctx.fillRect(padL + step * (i + 0.5) - cw / 2, vBase - vh, cw, vh);
      }
      ctx.globalAlpha = 1;
    }

    // 边线（颈线 / 趋势线），最后淡入
    if (opt.showLines !== false && series.lines && series.lines.length && progress > 0.72) {
      var la = Math.min(1, (progress - 0.72) / 0.28);
      ctx.save();
      ctx.globalAlpha = la;
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = THEME.line;
      ctx.lineWidth = 1.4;
      series.lines.forEach(function (ln) {
        ctx.beginPath();
        ctx.moveTo(xOf(ln.a.t), yOf(ln.a.p));
        ctx.lineTo(xOf(ln.b.t), yOf(ln.b.p));
        ctx.stroke();
        var dup = (series.points || []).some(function (pt) { return pt.label === ln.label; });
        if (opt.showLabels && ln.label && !dup) {
          var lx = Math.min(xOf(ln.b.t) - 2, cssW - padR - 4);
          var ly = yOf(ln.b.p) - 5;
          ly = Math.max(padT + 8, Math.min(padT + chartH - 4, ly));
          ctx.font = '600 9px -apple-system, "PingFang SC", sans-serif';
          ctx.textAlign = 'right';
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'rgba(255,255,255,0.92)';
          ctx.strokeText(ln.label, lx, ly);
          ctx.fillStyle = THEME.line;
          ctx.fillText(ln.label, lx, ly);
        }
      });
      ctx.restore();
      ctx.setLineDash([]);
    }

    // 标注点
    if (opt.showPoints && series.points && series.points.length && progress > 0.82) {
      var pa = Math.min(1, (progress - 0.82) / 0.18);
      var mid = (min + max) / 2;
      ctx.save();
      ctx.globalAlpha = pa;
      series.points.forEach(function (pt, idx) {
        var px = xOf(pt.t), py = yOf(pt.p);
        var letter = String.fromCharCode(65 + idx);
        if (opt.letters) {
          ctx.beginPath();
          ctx.arc(px, py, 7.5, 0, Math.PI * 2);
          ctx.fillStyle = THEME.point;
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.95)';
          ctx.lineWidth = 1.6;
          ctx.stroke();
          ctx.fillStyle = THEME.label;
          ctx.font = '700 9px -apple-system, "PingFang SC", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(letter, px, py + 0.5);
        } else if (opt.showLabels) {
          var above = pt.p > mid;
          var tx = px, align = 'center';
          if (px > cssW - 48) { tx = cssW - padR - 2; align = 'right'; }
          else if (px < padL + 48) { tx = padL + 2; align = 'left'; }
          var ty = above ? py - 12 : py + 17;
          ty = Math.max(padT + 8, Math.min(padT + chartH - 4, ty));
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = THEME.point;
          ctx.fill();
          ctx.font = '600 9px -apple-system, "PingFang SC", sans-serif';
          ctx.textAlign = align;
          ctx.textBaseline = 'middle';
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'rgba(255,255,255,0.95)';
          ctx.strokeText(pt.label, tx, ty);
          ctx.fillStyle = THEME.point;
          ctx.fillText(pt.label, tx, ty);
        }
      });
      ctx.restore();
      ctx.textBaseline = 'alphabetic';
    }
  }

  return { render: render, redraw: redraw, setPalette: setPalette };
})();
