/* K线形态道场 · 形态数据与示意生成器
   零依赖、零外链。
   核心思路：每个形态不是一张固定的图，而是一个「参数化生成器」——
   每次调用都画出结构合法、但噪声、规模、斜率、K 线数量都不同的实例。
   学习者记住的是形态的本质，而不是某一张特定的图。 */
window.KPATTERNS = (function () {
  'use strict';

  /* ---------- 随机与曲线 ---------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(rng) { return (rng() + rng() + rng() + rng() - 2) / 2; }
  function between(rng, a, b) { return a + rng() * (b - a); }

  // Catmull-Rom 采样，让控制点变成平滑的价格路径
  function curveAt(pts, t) {
    var n = pts.length, i = 0;
    while (i < n - 2 && t > pts[i + 1][0]) i++;
    var p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
    var span = Math.max(1e-6, p2[0] - p1[0]);
    var u = Math.max(0, Math.min(1, (t - p1[0]) / span));
    var u2 = u * u, u3 = u2 * u;
    function f(a, b, c, d) {
      return 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u2 + (-a + 3 * b - 3 * c + d) * u3);
    }
    return f(p0[1], p1[1], p2[1], p3[1]);
  }

  /* ---------- 成交量形状 ---------- */
  function volShape(declineTo, spikeAt) {
    return function (t) {
      var v = 1.25 - (1.25 - declineTo) * Math.min(1, t / 0.8);
      if (t > spikeAt) v += 0.85 * (t - spikeAt) / Math.max(0.01, 1 - spikeAt);
      return Math.max(0.2, v);
    };
  }
  function volCup(t) {
    if (t < 0.55) return 0.75 - 0.25 * Math.sin(Math.PI * t / 0.55);
    if (t < 0.8) return 0.8 + 0.5 * (t - 0.55) / 0.25;
    return 1.35;
  }

  /* ---------- 由控制点生成 K 线 ---------- */
  function build(rng, points, opt) {
    opt = opt || {};
    var n = opt.n || Math.round(between(rng, 42, 50));
    var vol = opt.vol || 0.85;
    var prices = [], i, t;
    for (i = 0; i < n; i++) {
      t = i / (n - 1);
      prices.push(curveAt(points, t) + gauss(rng) * vol);
    }
    var candles = [];
    var prev = prices[0] - gauss(rng) * 0.5;
    for (i = 0; i < n; i++) {
      t = i / (n - 1);
      var close = prices[i];
      var open = i === 0 ? close - gauss(rng) * 0.6 : prev + gauss(rng) * vol * 0.16;
      var hi = Math.max(open, close) + Math.abs(gauss(rng)) * vol * 0.55 + Math.abs(close - open) * 0.12;
      var lo = Math.min(open, close) - Math.abs(gauss(rng)) * vol * 0.55 - Math.abs(close - open) * 0.12;
      var move = Math.abs(close - open);
      var v = 0.3 + Math.min(1, move / (vol * 1.6)) * 0.55 + rng() * 0.25;
      if (opt.volume) v *= opt.volume(t);
      candles.push({ o: open, h: hi, l: lo, c: close, v: v });
      prev = close;
    }
    var maxV = 0;
    candles.forEach(function (c) { if (c.v > maxV) maxV = c.v; });
    candles.forEach(function (c) { c.v = c.v / (maxV || 1); });
    return candles;
  }

  function line(aT, aP, bT, bP, label) {
    return { a: { t: aT, p: aP }, b: { t: bT, p: bP }, dash: true, label: label || '' };
  }

  /* ---------- 反转工具：把顶部形态镜像成底部形态 ---------- */
  function invert(genFn, opts) {
    opts = opts || {};
    return function (rng, broken) {
      var res = genFn(rng, broken);
      var min = Infinity, max = -Infinity;
      res.candles.forEach(function (c) { if (c.l < min) min = c.l; if (c.h > max) max = c.h; });
      var center = (min + max) / 2;
      res.candles.forEach(function (c) {
        var o = c.o, cl = c.c, hi = c.h, lo = c.l;
        c.o = 2 * center - o; c.c = 2 * center - cl;
        c.h = 2 * center - lo; c.l = 2 * center - hi;
      });
      res.points.forEach(function (p) { p.p = 2 * center - p.p; });
      res.lines.forEach(function (l) { l.a.p = 2 * center - l.a.p; l.b.p = 2 * center - l.b.p; });
      if (opts.relabel) {
        res.points.forEach(function (p) { if (opts.relabel[p.label]) p.label = opts.relabel[p.label]; });
        res.lines.forEach(function (l) { if (opts.relabel[l.label]) l.label = opts.relabel[l.label]; });
      }
      if (opts.ask) res.ask = opts.ask;
      if (opts.askLabel) res.askLabel = opts.askLabel;
      if (broken && opts.reasons && opts.reasons[broken]) res.reason = opts.reasons[broken];
      return res;
    };
  }

  /* =========================================================
     形态生成器
     ========================================================= */

  function hsTop(rng, broken) {
    var base = between(rng, 50, 57);
    var neck = base + between(rng, 11, 15);
    var sh = neck + between(rng, 7, 12);
    var head = sh + between(rng, 9, 15);
    var right = sh + between(rng, -2.5, 2.5);
    var tail = neck - between(rng, 8, 13);
    var reason = '';

    if (broken === 'rightHigher') {
      right = head + between(rng, 4, 8);
      reason = '右肩冲得比头部还高，中间那个峰不再是「头」，所以不能叫头肩顶。';
    } else if (broken === 'noBreak') {
      tail = neck + between(rng, 5, 8);
      reason = '价格只是回到颈线附近，并没有收盘跌破，形态还没确认。';
    } else if (broken === 'lopsided') {
      right = neck + between(rng, 0.5, 2);
      reason = '右肩几乎贴着颈线，两肩严重不对称，不是标准的头肩顶。';
    }

    var pts = [
      [0, base], [0.08, neck - 2], [0.18, sh], [0.30, neck + 1.5],
      [0.42, head], [0.52, neck + 1], [0.63, right], [0.72, neck - 0.5],
      [0.82, neck - 4], [0.92, neck - 8], [1, tail]
    ];
    return {
      candles: build(rng, pts, { volume: volShape(0.55, 0.8) }),
      points: [
        { t: 0.18, p: sh, label: '左肩' },
        { t: 0.42, p: head, label: '头' },
        { t: 0.63, p: right, label: '右肩' }
      ],
      lines: [line(0.29, neck + 1.5, 0.90, neck - 1, '颈线')],
      ask: '哪个位置是「头」？',
      askLabel: '头',
      valid: !broken,
      reason: reason
    };
  }

  function doubleTop(rng, broken) {
    var base = between(rng, 52, 58);
    var peak = base + between(rng, 14, 20);
    var neck = base + between(rng, 6, 9);
    var peak2 = peak + between(rng, -1.2, 1.2);
    var tail = neck - between(rng, 7, 12);
    var reason = '';

    if (broken === 'unequal') {
      peak2 = peak + between(rng, 8, 11);
      tail = neck + between(rng, 4, 6);
      reason = '第二个峰明显高于第一个，而且价格没有跌破颈线——这是上升趋势中的更高高点，不是双顶。';
    } else if (broken === 'noBreak') {
      tail = neck + between(rng, 5, 8);
      reason = '两峰之间回落之后，价格没有跌破颈线，双顶尚未确认。';
    } else if (broken === 'lowSecond') {
      peak2 = peak - between(rng, 9, 12);
      reason = '第二峰远低于第一峰，两峰高度差太大，不能算标准的双顶。';
    }

    var pts = [
      [0, base], [0.14, base + 5], [0.30, peak], [0.46, neck],
      [0.62, peak2], [0.74, neck + 1], [0.86, neck - 3], [1, tail]
    ];
    return {
      candles: build(rng, pts, { volume: volShape(0.55, 0.8) }),
      points: [
        { t: 0.30, p: peak, label: '第一峰' },
        { t: 0.62, p: peak2, label: '第二峰' },
        { t: 0.46, p: neck, label: '颈线' }
      ],
      lines: [line(0.44, neck, 0.92, neck, '颈线')],
      ask: '两峰之间回落到的那个低点，叫什么？',
      askLabel: '颈线',
      valid: !broken,
      reason: reason
    };
  }

  function tripleTop(rng, broken) {
    var base = between(rng, 50, 56);
    var peak = base + between(rng, 15, 20);
    var neck = base + between(rng, 7, 10);
    var p2 = peak + between(rng, -1, 1);
    var p3 = peak + between(rng, -1.5, 1.5);
    var tail = neck - between(rng, 7, 11);
    var reason = '';

    if (broken === 'ascending') {
      p2 = peak + 4; p3 = peak + 8;
      tail = peak - 7;
      reason = '三个高点一路抬高，这是上升趋势，不是三重顶。三重顶要求三次冲高都在同一水平受阻。';
    } else if (broken === 'noBreak') {
      tail = neck + between(rng, 5, 8);
      reason = '三峰之后价格没有跌破颈线，派发还没有被确认。';
    }

    var pts = [
      [0, base], [0.10, neck - 1], [0.22, peak], [0.34, neck],
      [0.46, p2], [0.58, neck + 0.5], [0.70, p3], [0.80, neck - 1],
      [0.90, neck - 4], [1, tail]
    ];
    return {
      candles: build(rng, pts, { volume: volShape(0.5, 0.8) }),
      points: [
        { t: 0.22, p: peak, label: '第一峰' },
        { t: 0.46, p: p2, label: '第二峰' },
        { t: 0.70, p: p3, label: '第三峰' },
        { t: 0.58, p: neck + 0.5, label: '颈线' }
      ],
      lines: [line(0.56, neck + 0.5, 0.93, neck + 0.5, '颈线')],
      ask: '三个峰之后，向下跌破的那条水平线叫什么？',
      askLabel: '颈线',
      valid: !broken,
      reason: reason
    };
  }

  function roundingTop(rng, broken) {
    var base = between(rng, 52, 58);
    var top = base + between(rng, 16, 22);
    var end = base - between(rng, 4, 8);
    var reason = '';
    var pts;

    if (broken === 'vshape') {
      pts = [[0, base - 2], [0.12, base + 5], [0.3, base + 12], [0.45, top], [0.52, top - 1],
        [0.62, base + 8], [0.75, base + 2], [0.88, base - 4], [1, end]];
      reason = '顶部是一个尖锐的倒 V，不是缓慢滚圆的弧线，所以不是圆弧顶。';
    } else {
      pts = [[0, base - 2], [0.10, base + 2], [0.22, base + 8], [0.34, base + 14],
        [0.45, top - 1.5], [0.55, top], [0.66, base + 14], [0.78, base + 8],
        [0.90, base + 1], [1, end]];
    }

    return {
      candles: build(rng, pts, { volume: volShape(0.35, 0.86) }),
      points: [
        { t: 0.10, p: base + 2, label: '起点' },
        { t: 0.55, p: top, label: '弧顶' },
        { t: 0.90, p: base + 1, label: '破位点' }
      ],
      lines: [line(0.86, base + 3, 1, base + 3, '支撑')],
      ask: '这条弧线最高的位置叫什么？',
      askLabel: '弧顶',
      valid: !broken,
      reason: reason
    };
  }

  function ascendingTriangle(rng, broken) {
    var sup = between(rng, 58, 64);
    var res = sup + between(rng, 14, 18);
    var reason = '';
    var pts, lines, tail = res + between(rng, 6, 10);

    if (broken === 'descendingHighs') {
      pts = [[0, sup], [0.10, res - 2], [0.22, res], [0.34, sup + 4], [0.46, res - 5],
        [0.58, sup + 8], [0.70, res - 9], [0.82, sup + 11], [0.92, res - 11], [1, res - 6]];
      reason = '高点也在逐步降低，这是对称三角形（收敛），不是「水平阻力 + 抬高支撑」的上升三角形。';
      tail = res - 6;
    } else if (broken === 'breakDown') {
      pts = [[0, sup], [0.10, res - 2], [0.22, res], [0.36, sup + 4], [0.50, res - 1],
        [0.62, sup + 8], [0.74, res - 1], [0.84, sup + 11], [0.92, res - 3], [1, sup - 10]];
      reason = '价格最后向下突破了上升的支撑线，上升三角形以向上突破为典型，这张图没有兑现。';
      tail = sup - 7;
    } else {
      pts = [[0, sup], [0.10, sup + 3], [0.22, res], [0.36, sup + 5], [0.50, res - 0.5],
        [0.62, sup + 9], [0.74, res - 0.5], [0.84, sup + 12], [0.93, res - 0.5], [1, res + 8]];
    }

    lines = [
      line(0.20, res, 1, res, ''),
      { a: { t: 0.34, p: sup + 5 }, b: { t: 0.93, p: res - 3 }, dash: true, label: '' }
    ];
    return {
      candles: build(rng, pts, { volume: volShape(0.45, 0.88) }),
      points: [
        { t: 0.22, p: res, label: '阻力触点' },
        { t: 0.62, p: sup + 9, label: '支撑触点' },
        { t: 0.95, p: res + 3, label: '突破点' }
      ],
      lines: lines,
      ask: '哪一个位置是向上突破的点？',
      askLabel: '突破点',
      valid: !broken,
      reason: reason
    };
  }

  function expandingTriangleBreak(rng, broken) {
    var sup = between(rng, 58, 64);
    var res = sup + between(rng, 14, 18);
    var mid = (sup + res) / 2;
    var up = rng() < 0.5;
    var reason = '';
    var pts, tail;

    if (broken === 'noConverge') {
      pts = [[0, sup], [0.12, res], [0.26, sup + 1], [0.40, res + 1], [0.54, sup + 1.5],
        [0.68, res + 2], [0.80, sup + 2], [0.90, res + 2], [1, res + 6]];
      tail = res + 6;
      reason = '两条边线大致平行，这是上升通道，不是要收敛到顶点的对称三角形。';
    } else if (broken === 'noBreak') {
      pts = [[0, mid], [0.10, sup + 2], [0.22, res], [0.36, sup + 6], [0.50, res - 1],
        [0.62, sup + 9], [0.74, res - 4], [0.84, sup + 11], [0.92, res - 6], [1, mid + 1]];
      tail = mid + 1;
      reason = '价格收敛到顶点附近，却没有明确向上或向下突破——形态已经消耗殆尽，不能再按三角形等方向。';
    } else if (up) {
      pts = [[0, mid], [0.10, sup + 2], [0.22, res], [0.36, sup + 6], [0.50, res - 1],
        [0.62, sup + 9], [0.74, res - 4], [0.84, sup + 11], [0.93, res - 6], [1, res + 7]];
      tail = res + 7;
    } else {
      pts = [[0, mid], [0.10, res - 2], [0.22, sup], [0.36, res - 5], [0.50, sup + 3],
        [0.62, res - 8], [0.74, sup + 6], [0.84, res - 10], [0.93, sup + 12], [1, sup - 7]];
      tail = sup - 7;
    }

    return {
      candles: build(rng, pts, { volume: volShape(0.45, 0.88) }),
      points: up ? [
        { t: 0.22, p: res, label: '上轨触点' },
        { t: 0.62, p: sup + 9, label: '下轨触点' },
        { t: 0.95, p: tail, label: '突破点' }
      ] : [
        { t: 0.62, p: res - 8, label: '上轨触点' },
        { t: 0.50, p: sup + 3, label: '下轨触点' },
        { t: 0.95, p: tail, label: '突破点' }
      ],
      lines: [
        { a: { t: 0.20, p: res + 1 }, b: { t: 1, p: mid + 1 }, dash: true, label: '' },
        { a: { t: 0.34, p: sup + 5 }, b: { t: 1, p: mid - 1 }, dash: true, label: '' }
      ],
      ask: '哪一个位置是三角形突破的位置？',
      askLabel: '突破点',
      valid: !broken,
      reason: reason
    };
  }

  function bullFlag(rng, broken) {
    var start = between(rng, 54, 60);
    var pole = start + between(rng, 18, 24);
    var flagBot = pole - between(rng, 4, 6);
    var flagTop = pole - 0.5;
    var reason = '';
    var pts, tail = pole + between(rng, 10, 15);

    if (broken === 'noPole') {
      pts = [[0, start], [0.12, start + 3], [0.24, start + 5], [0.36, start + 2],
        [0.48, start + 4.5], [0.60, start + 2], [0.72, start + 4], [0.84, start + 3], [1, start + 6]];
      tail = start + 6;
      reason = '前面没有一段陡峭的急涨作为「旗杆」，只是普通震荡，不能叫旗形。';
    } else if (broken === 'deepRetrace') {
      flagBot = pole - between(rng, 13, 17);
      tail = pole + 3;
      reason = '旗面回调超过了旗杆的一半，趋势已经被破坏，更像反转而不是旗形整理。';
    }

    pts = [[0, start], [0.10, start + 4], [0.20, pole - 1], [0.28, pole],
      [0.36, flagBot + 1], [0.43, flagTop - 1], [0.50, flagBot], [0.57, flagTop - 1.5],
      [0.64, flagBot + 0.5], [0.71, flagTop - 1], [0.78, flagTop - 3],
      [0.86, flagTop + 4], [0.94, tail - 2], [1, tail]];
    return {
      candles: build(rng, pts, { volume: volShape(0.4, 0.82) }),
      points: [
        { t: 0.28, p: pole, label: '旗杆顶' },
        { t: 0.57, p: flagBot, label: '旗面低点' },
        { t: 0.94, p: tail - 2, label: '突破点' }
      ],
      lines: [
        line(0.30, flagTop, 1, flagTop, ''),
        { a: { t: 0.34, p: flagBot }, b: { t: 1, p: flagBot - 1 }, dash: true, label: '' }
      ],
      ask: '急涨之后那段窄幅整理，最低点在哪里？',
      askLabel: '旗面低点',
      valid: !broken,
      reason: reason
    };
  }

  function pennant(rng, broken) {
    var start = between(rng, 54, 60);
    var pole = start + between(rng, 20, 26);
    var mid = pole - between(rng, 3, 5);
    var tail = pole + between(rng, 10, 14);
    var reason = '';
    var pts;

    if (broken === 'longConsolidation') {
      pts = [[0, start], [0.12, start + 5], [0.22, pole], [0.28, pole - 2], [0.34, pole - 0.5],
        [0.40, pole - 2.5], [0.46, pole - 1], [0.52, pole - 3], [0.58, pole - 1.5],
        [0.64, pole - 3.5], [0.70, pole - 2], [0.76, pole - 4], [0.82, pole - 2.5],
        [0.90, pole + 2], [1, tail]];
      reason = '整理期拖得太长，已经形成对称三角形，不再是「三角旗」那种短促的整理。';
    } else {
      pts = [[0, start], [0.12, start + 5], [0.22, pole],
        [0.29, pole - 1], [0.35, pole - 7],
        [0.41, pole - 1.8], [0.47, pole - 6],
        [0.53, pole - 2.6], [0.59, pole - 5],
        [0.65, pole - 3.3], [0.71, pole - 4.2],
        [0.78, pole - 3.4], [0.86, pole + 1], [0.93, tail - 2], [1, tail]];
    }

    return {
      candles: build(rng, pts, { volume: volShape(0.42, 0.84) }),
      points: [
        { t: 0.22, p: pole, label: '旗杆顶' },
        { t: 0.59, p: pole - 5, label: '旗面' },
        { t: 0.92, p: tail - 1, label: '突破点' }
      ],
      lines: [
        { a: { t: 0.27, p: pole - 1 }, b: { t: 0.79, p: pole - 3.4 }, dash: true, label: '' },
        { a: { t: 0.27, p: pole - 7 }, b: { t: 0.79, p: pole - 3.4 }, dash: true, label: '' }
      ],
      ask: '哪一个位置是突破点？',
      askLabel: '突破点',
      valid: !broken,
      reason: reason
    };
  }

  function risingWedge(rng, broken) {
    var low = between(rng, 56, 62);
    var high = low + between(rng, 12, 16);
    var reason = '';
    var pts, end;

    if (broken === 'channel') {
      pts = [[0, low], [0.12, high], [0.24, low + 2], [0.36, high + 2], [0.48, low + 4],
        [0.60, high + 4], [0.72, low + 6], [0.84, high + 6], [1, high + 8]];
      reason = '上下轨大致平行，这是上升通道，不是逐渐收敛的上升楔形。';
      end = high + 8;
    } else if (broken === 'breakUp') {
      pts = [[0, low], [0.12, high], [0.24, low + 3], [0.36, high + 2], [0.48, low + 6],
        [0.60, high + 4], [0.72, low + 8], [0.82, high + 5], [0.90, high + 2], [1, high + 10]];
      reason = '价格向上突破了楔形上轨，上升楔形以向下突破为典型，这张图没有兑现。';
      end = high + 10;
    } else {
      pts = [[0, low], [0.12, high], [0.24, low + 3], [0.36, high + 1.5], [0.48, low + 6],
        [0.60, high + 2], [0.72, low + 8], [0.82, high + 2.5], [0.90, low + 3], [1, low - 8]];
      end = low - 8;
    }

    return {
      candles: build(rng, pts, { volume: volShape(0.45, 0.86) }),
      points: [
        { t: 0.12, p: high, label: '上轨触点' },
        { t: 0.48, p: low + 6, label: '下轨触点' },
        { t: 0.95, p: end, label: '跌破点' }
      ],
      lines: [
        { a: { t: 0.10, p: high }, b: { t: 0.95, p: high + 4 }, dash: true, label: '' },
        { a: { t: 0.22, p: low + 2 }, b: { t: 0.95, p: low + 9 }, dash: true, label: '' }
      ],
      ask: '哪一个是价格跌破楔形下轨的位置？',
      askLabel: '跌破点',
      valid: !broken,
      reason: reason
    };
  }

  function cupHandle(rng, broken) {
    var rim = between(rng, 68, 74);
    var bottom = rim - between(rng, 12, 18);
    var handle = rim - between(rng, 4, 6);
    var tail = rim + between(rng, 8, 12);
    var reason = '';
    var pts;

    if (broken === 'vCup') {
      pts = [[0, rim - 4], [0.10, rim - 8], [0.22, bottom], [0.30, bottom + 2],
        [0.40, rim - 6], [0.50, rim - 3], [0.58, rim], [0.68, rim - 3],
        [0.74, rim - 2], [0.82, rim + 2], [0.92, tail - 2], [1, tail]];
      reason = '杯体是尖锐的 V 形，不是圆弧底，V 形反转又快又急，不构成杯柄形态。';
    } else if (broken === 'deepHandle') {
      handle = bottom + 2;
      pts = [[0, rim - 4], [0.10, rim - 8], [0.22, bottom], [0.34, bottom + 3], [0.46, rim - 6],
        [0.56, rim - 2], [0.64, rim], [0.72, rim - 6], [0.78, handle], [0.84, handle + 1],
        [0.92, rim - 2], [1, rim + 3]];
      reason = '柄部回调太深，几乎跌回杯底，说明抛压没有消化，不是有效的杯柄。';
      tail = rim + 3;
    } else {
      pts = [[0, rim - 4], [0.10, rim - 8], [0.22, bottom], [0.34, bottom + 3], [0.46, rim - 6],
        [0.56, rim - 2], [0.64, rim], [0.72, rim - 3], [0.78, handle], [0.84, handle + 1],
        [0.92, rim + 2], [1, tail]];
    }

    return {
      candles: build(rng, pts, { volume: volCup }),
      points: [
        { t: 0.22, p: bottom, label: '杯底' },
        { t: 0.64, p: rim, label: '杯口' },
        { t: 0.78, p: handle, label: '柄部低点' }
      ],
      lines: [line(0.62, rim, 1, rim, '杯口颈线')],
      ask: '圆弧右侧那次小幅回调的低点，叫什么？',
      askLabel: '柄部低点',
      valid: !broken,
      reason: reason
    };
  }

  function rectangle(rng, broken) {
    var sup = between(rng, 58, 64);
    var res = sup + between(rng, 12, 16);
    var reason = '';
    var pts, tail;

    if (broken === 'slanted') {
      pts = [[0, sup], [0.12, res], [0.26, sup + 3], [0.40, res + 3], [0.54, sup + 6],
        [0.68, res + 6], [0.82, sup + 9], [0.94, res + 9], [1, res + 12]];
      reason = '上下边界明显向上倾斜，这是上升通道，不是水平的箱体。';
      tail = res + 12;
    } else {
      var dir = rng() < 0.5 ? 1 : -1;
      pts = [[0, sup + 3], [0.10, res - 1], [0.22, sup + 1], [0.34, res], [0.46, sup + 2],
        [0.58, res - 1], [0.70, sup + 1], [0.82, res - 2], [0.90, dir > 0 ? res + 1 : sup - 1],
        [1, dir > 0 ? res + 9 : sup - 9]];
      tail = dir > 0 ? res + 9 : sup - 9;
    }

    return {
      candles: build(rng, pts, { volume: volShape(0.5, 0.86) }),
      points: [
        { t: 0.22, p: sup + 1, label: '下轨' },
        { t: 0.34, p: res, label: '上轨' },
        { t: 0.95, p: tail, label: '突破点' }
      ],
      lines: [line(0.08, res, 1, res, '上轨'), line(0.06, sup, 1, sup, '下轨')],
      ask: '哪一个位置代表箱体被突破？',
      askLabel: '突破点',
      valid: !broken,
      reason: reason
    };
  }

  /* ---------- 镜像形态（底部 / 下降楔形 / 下降三角） ---------- */

  var hsBottom = invert(hsTop, {
    ask: '哪个位置是「头」？',
    askLabel: '头',
    reasons: {
      rightHigher: '右肩跌得比头部还低，中间那个低点不再是「头」，不能叫头肩底。',
      noBreak: '价格只是回到颈线附近，并没有向上突破，形态还没确认。',
      lopsided: '右肩几乎贴着颈线，两肩严重不对称，不是标准的头肩底。'
    }
  });

  var doubleBottom = invert(doubleTop, {
    relabel: { 第一峰: '第一谷', 第二峰: '第二谷' },
    ask: '两谷之间反弹到的高点，叫什么？',
    askLabel: '颈线',
    reasons: {
      unequal: '第二个谷明显低于第一个，价格也没站上颈线——这是下降趋势中的更低低点，不是双底。',
      noBreak: '两谷之间反弹之后，价格没有向上突破颈线，双底尚未确认。',
      lowSecond: '第二谷远低于第一谷，两谷高度差太大，不能算标准的双底。'
    }
  });

  var tripleBottom = invert(tripleTop, {
    relabel: { 第一峰: '第一谷', 第二峰: '第二谷', 第三峰: '第三谷' },
    ask: '三个谷之后，向上突破的那条水平线叫什么？',
    askLabel: '颈线',
    reasons: {
      ascending: '三个低点一路降低，这是下降趋势，不是三重底。三重底要求三次探底都在同一水平获得支撑。',
      noBreak: '三谷之后价格没有向上突破颈线，筑底还没有被确认。'
    }
  });

  var roundingBottom = invert(roundingTop, {
    relabel: { 弧顶: '弧底', 破位点: '突破点' },
    ask: '这条弧线最低的位置叫什么？',
    askLabel: '弧底',
    reasons: {
      vshape: '底部是一个尖锐的 V 形，不是缓慢滚圆的弧线，所以不是圆弧底。'
    }
  });

  var descendingTriangle = invert(ascendingTriangle, {
    relabel: { 阻力触点: '支撑触点', 支撑触点: '阻力触点', 突破点: '跌破点' },
    ask: '哪一个位置是向下跌破的点？',
    askLabel: '跌破点',
    reasons: {
      descendingHighs: '低点也在逐步抬高，这是对称三角形（收敛），不是「水平支撑 + 降低高点」的下降三角形。',
      breakDown: '价格最后向上突破了下降的阻力线，下降三角形以向下突破为典型，这张图没有兑现。'
    }
  });

  var fallingWedge = invert(risingWedge, {
    relabel: { 上轨触点: '下轨触点', 下轨触点: '上轨触点', 跌破点: '突破点' },
    ask: '哪一个是价格突破楔形上轨的位置？',
    askLabel: '突破点',
    reasons: {
      channel: '上下轨大致平行，这是下降通道，不是逐渐收敛的下降楔形。',
      breakUp: '价格向下跌破了楔形下轨——下降楔形以向上突破为典型，这张图没有兑现。'
    }
  });

  /* ---------- 形态清单 ---------- */

  var list = [
    {
      id: 'hs-top', zh: '头肩顶', en: 'Head and Shoulders Top', alias: 'Head & Shoulders',
      unit: 'topping', bias: 'bear', biasLabel: '看跌反转',
      tagline: '三个峰，中间最高；跌破颈线，涨势结束',
      summary: '上涨末端出现三个峰：中间最高叫「头」，两侧较低且大致等高叫「肩」。两次回落低点连成颈线。价格跌破颈线，通常意味着上升趋势走到头了。',
      signs: ['三个峰，中间的「头」明显最高', '左右肩高度接近，时间跨度也大致对称', '两次回落低点大致水平，或略微上倾', '跌破颈线时最好伴随放量', '跌破后回抽颈线不过，是二次确认'],
      volume: '左肩放量、头部量能开始萎缩、右肩更小，跌破颈线时再度放量——「量价背离 + 破位放量」是典型组合。',
      confirm: '收盘价跌破颈线才算确认。量度目标 ≈ 头部到颈线的垂直距离，从跌破点向下量。',
      trap: '右肩高于头部、或价格只是回到颈线但没有跌破，都不算头肩顶。颈线倾斜角度太大时可靠性也会下降。',
      gen: hsTop,
      breaks: [
        { key: 'rightHigher', label: '右肩高过头部' },
        { key: 'noBreak', label: '没有跌破颈线' },
        { key: 'lopsided', label: '两肩严重不对称' }
      ]
    },
    {
      id: 'double-top', zh: '双顶（M 头）', en: 'Double Top', alias: 'M Top',
      unit: 'topping', bias: 'bear', biasLabel: '看跌反转',
      tagline: '两次冲高同一水平都失败，跌破颈线确认',
      summary: '价格两次冲高到几乎同一水平受阻回落，中间的低谷连成颈线，形似字母 M。跌破颈线，说明上方抛压已经占上风。',
      signs: ['两个峰高度相差一般小于 3%', '两峰之间有明显回落，形成颈线', '第二峰的量能通常小于第一峰', '跌破颈线时放量更可靠'],
      volume: '第二峰缩量是重要线索；跌破颈线时放量，确认派发完成。',
      confirm: '收盘跌破颈线。量度目标 ≈ 峰到颈线的距离，从跌破点向下量。',
      trap: '两峰高度差太大就不是双顶；跌破颈线后很快拉回颈线上方，是假突破。',
      gen: doubleTop,
      breaks: [
        { key: 'unequal', label: '第二峰明显更高' },
        { key: 'noBreak', label: '没有跌破颈线' },
        { key: 'lowSecond', label: '第二峰明显更低' }
      ]
    },
    {
      id: 'triple-top', zh: '三重顶', en: 'Triple Top', alias: '',
      unit: 'topping', bias: 'bear', biasLabel: '看跌反转',
      tagline: '三次冲高同一水平，第三次也上不去',
      summary: '价格三次冲高到同一水平受阻回落，形成三个依次排列的峰。比双顶多一次试探，说明上方派发更充分，跌破颈线后的下跌往往更果断。',
      signs: ['三个峰大致在同一水平', '两次回落低点大致相同，构成颈线', '每次冲高的量能逐次递减', '第三次冲高常伴随指标背离'],
      volume: '三次冲高的成交量依次递减，是「多头力竭」的直接证据。',
      confirm: '收盘跌破颈线。量度目标 ≈ 峰到颈线的距离。',
      trap: '三个高点若一路抬高，那是上升趋势而不是三重顶。',
      gen: tripleTop,
      breaks: [
        { key: 'ascending', label: '高点一路抬高' },
        { key: 'noBreak', label: '没有跌破颈线' }
      ]
    },
    {
      id: 'rounding-top', zh: '圆弧顶', en: 'Rounding Top', alias: 'Saucer Top',
      unit: 'topping', bias: 'bear', biasLabel: '看跌反转',
      tagline: '顶部慢慢滚圆，像倒扣的碗',
      summary: '顶部没有尖锐的高点，价格在高位缓慢滚圆，形成倒扣的碗形。常出现在长期上涨的末端，是动能一点点耗尽的过程。',
      signs: ['高点连线是平滑的弧线，没有明显尖峰', '波动率逐步下降，K 线实体变小', '成交量同步萎缩', '下跌初期缓慢，跌破支撑后可能加速'],
      volume: '整段量能持续萎缩，是「无人接力」的信号。',
      confirm: '价格跌破弧线右侧的支撑/颈线，才算确认。',
      trap: '时间跨度太短就只是普通顶部；弧形整理也可能向下假突破后再拉回。',
      gen: roundingTop,
      breaks: [
        { key: 'vshape', label: '顶部是尖锐的 V 形' }
      ]
    },
    {
      id: 'hs-bottom', zh: '头肩底', en: 'Inverse Head and Shoulders', alias: 'Head and Shoulders Bottom',
      unit: 'bottoming', bias: 'bull', biasLabel: '看涨反转',
      tagline: '三个谷，中间最低；站上颈线，跌势结束',
      summary: '头肩顶的镜像。下跌末端出现三个谷，中间最低的是「头」，两侧较高且大致等高是「肩」。价格向上突破颈线，通常意味着下跌趋势结束。',
      signs: ['三个谷，中间的「头」明显最低', '左右肩高度接近', '两次反弹高点连成颈线', '突破颈线时明显放量'],
      volume: '左肩放量下跌、头部缩量、右肩温和放量，突破颈线时明显放量——量能提前转强是重要线索。',
      confirm: '收盘站上颈线。量度目标 ≈ 头部到颈线的距离，从突破点向上量。',
      trap: '右肩低于头部、或只是碰到颈线没有站上，都不算头肩底。',
      gen: hsBottom,
      breaks: [
        { key: 'rightHigher', label: '右肩低于头部' },
        { key: 'noBreak', label: '没有站上颈线' },
        { key: 'lopsided', label: '两肩严重不对称' }
      ]
    },
    {
      id: 'double-bottom', zh: '双底（W 底）', en: 'Double Bottom', alias: 'W Bottom',
      unit: 'bottoming', bias: 'bull', biasLabel: '看涨反转',
      tagline: '两次探底都被接住，突破颈线确认',
      summary: '价格两次下跌到几乎同一水平获得支撑反弹，中间的高点连成颈线，形似字母 W。向上突破颈线，说明下方买盘开始占上风。',
      signs: ['两个谷高度相差一般小于 3%', '两谷之间有明显反弹，形成颈线', '第二谷的量能常小于第一谷', '突破颈线时放量'],
      volume: '第二谷缩量说明抛压衰竭；突破颈线放量，确认反转成立。',
      confirm: '收盘站上颈线。量度目标 ≈ 谷到颈线的距离，从突破点向上量。',
      trap: '两谷高度差太大就不是双底；突破后很快跌回颈线下方是假突破。',
      gen: doubleBottom,
      breaks: [
        { key: 'unequal', label: '第二谷明显更低' },
        { key: 'noBreak', label: '没有站上颈线' },
        { key: 'lowSecond', label: '第二谷略低' }
      ]
    },
    {
      id: 'triple-bottom', zh: '三重底', en: 'Triple Bottom', alias: '',
      unit: 'bottoming', bias: 'bull', biasLabel: '看涨反转',
      tagline: '三次探底同一水平都被买盘接住',
      summary: '价格三次下跌到同一水平都获得支撑，形成三个依次排列的谷。比双底多一次确认，突破颈线后的上涨往往更扎实。',
      signs: ['三个谷大致在同一水平', '两次反弹高点大致相同，构成颈线', '每次探底的量能逐次递减', '突破颈线时放量'],
      volume: '三次探底量能递减，说明卖压在衰减。',
      confirm: '收盘站上颈线。量度目标 ≈ 谷到颈线的距离。',
      trap: '三个低点若一路降低，那是下降趋势而不是三重底。',
      gen: tripleBottom,
      breaks: [
        { key: 'ascending', label: '低点一路降低' },
        { key: 'noBreak', label: '没有站上颈线' }
      ]
    },
    {
      id: 'rounding-bottom', zh: '圆弧底', en: 'Rounding Bottom', alias: 'Saucer Bottom',
      unit: 'bottoming', bias: 'bull', biasLabel: '看涨反转',
      tagline: '底部慢慢磨圆，像一只碗',
      summary: '底部没有尖锐的低点，价格在低位缓慢滚圆，形成碗形。是卖压逐渐枯竭、买盘慢慢接力的过程，常需要较长时间完成。',
      signs: ['低点连线是平滑的弧线', '波动率与成交量在底部同步萎缩', '右侧回升时量能温和放大', '突破碗口/颈线后趋势更明确'],
      volume: '底部缩量、右侧回升放量，是典型的筹码从弱手转到强手。',
      confirm: '价格突破弧线右侧的颈线/碗口，才算确认。',
      trap: '时间跨度太短就只是普通反弹；V 形底不是圆弧底。',
      gen: roundingBottom,
      breaks: [
        { key: 'vshape', label: '底部是尖锐的 V 形' }
      ]
    },
    {
      id: 'ascending-triangle', zh: '上升三角形', en: 'Ascending Triangle', alias: '',
      unit: 'triangle', bias: 'bull', biasLabel: '看涨延续',
      tagline: '水平阻力 + 不断抬高的低点，多方步步紧逼',
      summary: '高点被同一条水平阻力压住，低点却不断抬高，价格被挤向三角形顶点。买盘一次比一次急，向上突破的概率较大。',
      signs: ['至少两个（最好三个）高点在同一水平', '低点持续抬高', '越接近顶点，波动越小', '突破前缩量，突破时放量'],
      volume: '收敛过程量能萎缩，突破阻力时明显放量，是有效突破的关键。',
      confirm: '收盘放量突破水平阻力。量度目标 ≈ 三角形底边高度，从突破点向上量。',
      trap: '水平阻力若明显倾斜就不是上升三角形；到顶点仍无量突破，容易变成假突破。',
      gen: ascendingTriangle,
      breaks: [
        { key: 'descendingHighs', label: '高点也在降低' },
        { key: 'breakDown', label: '向下突破' }
      ]
    },
    {
      id: 'descending-triangle', zh: '下降三角形', en: 'Descending Triangle', alias: '',
      unit: 'triangle', bias: 'bear', biasLabel: '看跌延续',
      tagline: '水平支撑 + 不断降低的高点，空方步步紧逼',
      summary: '低点被同一条水平支撑托住，高点却不断降低，价格被挤向顶点。卖盘一次比一次急，向下跌破的概率较大。',
      signs: ['至少两个高点依次降低', '低点在同一水平获得支撑', '越接近顶点波动越小', '跌破支撑时放量'],
      volume: '收敛过程缩量，跌破支撑时放量，确认卖压占优。',
      confirm: '收盘放量跌破水平支撑。量度目标 ≈ 三角形高度，从跌破点向下量。',
      trap: '水平支撑若明显倾斜就不是下降三角形；跌破后快速拉回是假突破。',
      gen: descendingTriangle,
      breaks: [
        { key: 'descendingHighs', label: '低点也在抬高' },
        { key: 'breakDown', label: '向上突破' }
      ]
    },
    {
      id: 'symmetrical-triangle', zh: '对称三角形', en: 'Symmetrical Triangle', alias: '收敛三角形',
      unit: 'triangle', bias: 'neutral', biasLabel: '方向未定',
      tagline: '高点降低、低点抬高，越收越窄，等突破',
      summary: '高点不断降低、低点不断抬高，两条边线逐渐收敛，方向未定。它描述的是「多空暂时平衡、波动收敛」，突破方向才决定后续。',
      signs: ['上下边线都向中间收敛', '至少各有两个触点', '通常在三角形 2/3 处突破', '越拖到顶点，突破越不可靠'],
      volume: '整理过程缩量，突破时放量。无量突破的可信度低。',
      confirm: '收盘突破任一边线并放量。量度目标 ≈ 三角形底边高度，从突破点量。',
      trap: '不要提前押方向；顶点处缩量横盘，容易变成无效形态。',
      gen: expandingTriangleBreak,
      breaks: [
        { key: 'noConverge', label: '两边线大致平行' },
        { key: 'noBreak', label: '走到顶点也没突破' }
      ]
    },
    {
      id: 'bull-flag', zh: '上升旗形', en: 'Bull Flag', alias: '',
      unit: 'flag', bias: 'bull', biasLabel: '看涨延续',
      tagline: '急涨一根旗杆，窄幅回调，再放量突破',
      summary: '一段陡峭的急涨形成「旗杆」，随后价格小幅回落、窄幅整理形成「旗面」，再放量向上突破，通常延续原来的上涨。',
      signs: ['前面有一段陡峭急涨（旗杆）', '旗面回调幅度一般不超过旗杆的 1/3 到 1/2', '旗面整理时间短，几天到几周', '旗面缩量，突破放量'],
      volume: '旗面缩量说明只是获利回吐，不是趋势反转；突破时放量确认。',
      confirm: '放量突破旗面上边界。量度目标 ≈ 旗杆高度，从突破点向上量。',
      trap: '回调超过旗杆一半、或整理拖太久，趋势可能已经转弱，不再是旗形。',
      gen: bullFlag,
      breaks: [
        { key: 'noPole', label: '没有旗杆' },
        { key: 'deepRetrace', label: '回调超过一半' }
      ]
    },
    {
      id: 'bear-flag', zh: '下降旗形', en: 'Bear Flag', alias: '',
      unit: 'flag', bias: 'bear', biasLabel: '看跌延续',
      tagline: '急跌一根旗杆，小幅反弹，再放量下破',
      summary: '一段陡峭的急跌形成「旗杆」，随后价格小幅反弹、窄幅整理形成「旗面」，再放量向下跌破，通常延续原来的下跌。',
      signs: ['前面有一段陡峭急跌（旗杆）', '旗面反弹幅度一般不超过旗杆的 1/3 到 1/2', '旗面整理时间短', '旗面缩量，跌破放量'],
      volume: '反弹缩量说明只是空头回补，不是趋势反转；跌破时放量确认。',
      confirm: '放量跌破旗面下边界。量度目标 ≈ 旗杆高度，从跌破点向下量。',
      trap: '反弹超过旗杆一半、或整理拖太久，可能已经转势。',
      gen: invert(bullFlag, {
        relabel: { 旗杆顶: '旗杆底', 旗面低点: '旗面高点', 突破点: '跌破点' },
        ask: '急跌之后那段窄幅整理，最高点在哪里？',
        askLabel: '旗面高点',
        reasons: {
          noPole: '前面没有一段陡峭的急跌作为「旗杆」，只是普通震荡，不能叫下降旗形。',
          deepRetrace: '旗面反弹超过了旗杆的一半，下跌趋势已经被破坏，更像反转而不是旗形整理。'
        }
      }),
      breaks: [
        { key: 'noPole', label: '没有旗杆' },
        { key: 'deepRetrace', label: '反弹超过一半' }
      ]
    },
    {
      id: 'pennant', zh: '三角旗形', en: 'Pennant', alias: '',
      unit: 'flag', bias: 'neutral', biasLabel: '方向未定',
      tagline: '旗杆之后极短的小三角整理，突破后延续',
      summary: '急涨或急跌之后，价格进入一个非常短促的对称三角整理，形似小三角旗。整理结束后通常沿旗杆方向继续。',
      signs: ['前面有明显旗杆', '整理期很短，通常不超过 3 周', '两条边线快速收敛', '整理过程缩量'],
      volume: '整理缩量、突破放量，与旗形一致。',
      confirm: '放量突破三角旗的边线。量度目标 ≈ 旗杆高度。',
      trap: '整理拖长就变成对称三角形，不再是三角旗；三角旗方向由旗杆决定。',
      gen: pennant,
      breaks: [
        { key: 'longConsolidation', label: '整理期过长' }
      ]
    },
    {
      id: 'rising-wedge', zh: '上升楔形', en: 'Rising Wedge', alias: '',
      unit: 'flag', bias: 'bear', biasLabel: '看跌反转',
      tagline: '越涨越窄，涨势在衰竭',
      summary: '高点和低点都在抬高，但两条边线逐渐靠拢，涨势在收窄中耗尽。上升楔形通常向下突破，是一个看跌形态。',
      signs: ['上下轨都向上倾斜，但逐渐收敛', '价格重心仍在抬高，波动却变小', '量能整体萎缩', '跌破下轨时放量'],
      volume: '上涨过程中量能不断萎缩，是「越涨越没人跟」的典型表现。',
      confirm: '收盘跌破楔形下轨。量度目标 ≈ 楔形最宽处的高度，从跌破点向下量。',
      trap: '上下轨平行的是上升通道，不是楔形；出现在下跌趋势的反弹中也可能继续向下。',
      gen: risingWedge,
      breaks: [
        { key: 'channel', label: '两边线平行' },
        { key: 'breakUp', label: '向上突破' }
      ]
    },
    {
      id: 'falling-wedge', zh: '下降楔形', en: 'Falling Wedge', alias: '',
      unit: 'flag', bias: 'bull', biasLabel: '看涨反转',
      tagline: '越跌越窄，跌势在衰竭',
      summary: '高点和低点都在降低，但两条边线逐渐靠拢，下跌动能在收窄中耗尽。下降楔形通常向上突破，是一个看涨形态。',
      signs: ['上下轨都向下倾斜，但逐渐收敛', '价格重心仍在降低，波动却变小', '量能整体萎缩', '突破上轨时放量'],
      volume: '下跌过程缩量，说明抛压在衰减；突破时放量确认。',
      confirm: '收盘突破楔形上轨。量度目标 ≈ 楔形最宽处的高度，从突破点向上量。',
      trap: '上下轨平行的是下降通道，不是楔形；无量突破容易失败。',
      gen: fallingWedge,
      breaks: [
        { key: 'channel', label: '两边线平行' },
        { key: 'breakUp', label: '向下突破' }
      ]
    },
    {
      id: 'cup-handle', zh: '杯柄形态', en: 'Cup and Handle', alias: 'Cup with Handle',
      unit: 'cup', bias: 'bull', biasLabel: '看涨延续',
      tagline: '圆弧底（杯）+ 小幅回调（柄），突破柄部高点',
      summary: '先走出一段圆弧底形成「杯」，右侧回升到杯口附近后小幅回调形成「柄」，再放量突破柄部高点，通常延续上涨。威廉·欧奈尔把它视为经典的强势整理。',
      signs: ['杯体是 U 形圆弧，不是 V 形', '杯深一般 12%~33%', '柄部回调浅，通常不超过杯深的 1/3', '柄部位于杯体上半部', '突破柄部高点时放量'],
      volume: '杯底缩量、右侧回升放量、柄部缩量、突破放量，是教科书式的节奏。',
      confirm: '放量突破柄部高点/杯口颈线。量度目标 ≈ 杯深。',
      trap: 'V 形杯、柄部过深或柄在杯体下半部，可靠性大幅下降。',
      gen: cupHandle,
      breaks: [
        { key: 'vCup', label: '杯体是 V 形' },
        { key: 'deepHandle', label: '柄部回调过深' }
      ]
    },
    {
      id: 'rectangle', zh: '箱形整理', en: 'Rectangle', alias: 'Trading Range',
      unit: 'cup', bias: 'neutral', biasLabel: '方向未定',
      tagline: '上下两条水平线之间来回，等突破',
      summary: '价格在水平的上下轨之间反复震荡，多空暂时达成平衡。放量突破任一边界后，通常沿突破方向走出一段，幅度约等于箱体高度。',
      signs: ['至少两次触顶、两次触底', '上下轨大致水平', '箱体内量能逐渐萎缩', '突破时放量'],
      volume: '箱内缩量、突破放量。箱内的频繁假突破是主要陷阱。',
      confirm: '收盘放量突破任一边界。量度目标 ≈ 箱体高度。',
      trap: '上下轨明显倾斜的是通道不是箱体；箱内追涨杀跌容易被两头打脸。',
      gen: rectangle,
      breaks: [
        { key: 'slanted', label: '上下轨倾斜' }
      ]
    }
  ];

  var byId = {};
  list.forEach(function (p) { byId[p.id] = p; });

  /* ---------- 对外接口 ---------- */
  // 把 K 线按区间合并，给小尺寸图表用，保留形态骨架
  function decimate(candles, target) {
    if (!target || candles.length <= target) return candles;
    var out = [], step = candles.length / target;
    for (var i = 0; i < target; i++) {
      var a = Math.floor(i * step), b = Math.max(a + 1, Math.floor((i + 1) * step));
      var part = candles.slice(a, b);
      var h = -Infinity, l = Infinity, vsum = 0;
      for (var j = 0; j < part.length; j++) {
        if (part[j].h > h) h = part[j].h;
        if (part[j].l < l) l = part[j].l;
        vsum += part[j].v;
      }
      out.push({ o: part[0].o, c: part[part.length - 1].c, h: h, l: l, v: vsum / part.length });
    }
    return out;
  }

  function variant(id, seed, forceInvalid, opts) {
    var p = byId[id];
    if (!p) throw new Error('unknown pattern: ' + id);
    var rng = mulberry32(seed >>> 0);
    var broken = null;
    if (forceInvalid) {
      if (opts && opts.breakKey) broken = opts.breakKey;
      else {
        var keys = p.breaks && p.breaks.length ? p.breaks : [{ key: null }];
        broken = keys[Math.floor(rng() * keys.length)].key;
      }
    }
    var res = p.gen(rng, broken);
    res.id = id;
    res.seed = seed;
    res.valid = !broken;
    res.reason = res.reason || '';
    if (opts && opts.n) res.candles = decimate(res.candles, opts.n);
    res.pattern = p;
    return res;
  }

  return {
    list: list,
    byId: byId,
    variant: variant,
    _rng: mulberry32
  };
})();
