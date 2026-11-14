/* K线形态道场 · 应用逻辑
   零依赖。状态存 localStorage，课程由形态数据实时生成，每轮题目和图形都不一样。 */
(function () {
  'use strict';

  var P = window.KPATTERNS;
  var Chart = window.KChart;
  var view = document.getElementById('view');

  var STORE_KEY = 'kline_dojo_v1';
  var DAILY_GOAL = 60;
  var MAX_HEARTS = 4;

  var PATTERN_EMOJI = {
    'hs-top': '⛰️', 'double-top': '🔺', 'triple-top': '🏔️', 'rounding-top': '🌂',
    'hs-bottom': '🕳️', 'double-bottom': '🔻', 'triple-bottom': '🏞️', 'rounding-bottom': '🥣',
    'ascending-triangle': '📐', 'descending-triangle': '📏', 'symmetrical-triangle': '🔷',
    'bull-flag': '🚩', 'bear-flag': '🏴', 'pennant': '⛳',
    'rising-wedge': '📈', 'falling-wedge': '📉',
    'cup-handle': '☕', 'rectangle': '🔲'
  };

  var UNITS = [
    { id: 'basics', title: '第 1 单元 · 看懂 K 线', desc: '先弄明白一根蜡烛在说什么', emoji: '🕯️', lessons: ['intro'] },
    { id: 'topping', title: '第 2 单元 · 见顶信号', desc: '涨到头部的样子', emoji: '⛰️', lessons: ['hs-top', 'double-top', 'triple-top', 'rounding-top'] },
    { id: 'bottoming', title: '第 3 单元 · 见底信号', desc: '跌不下去的样子', emoji: '🕳️', lessons: ['hs-bottom', 'double-bottom', 'triple-bottom', 'rounding-bottom'] },
    { id: 'triangle', title: '第 4 单元 · 三角收敛', desc: '越收越窄，等待方向', emoji: '📐', lessons: ['ascending-triangle', 'descending-triangle', 'symmetrical-triangle'] },
    { id: 'flag', title: '第 5 单元 · 旗形与楔形', desc: '急涨急跌之后的休息', emoji: '🚩', lessons: ['bull-flag', 'bear-flag', 'pennant', 'rising-wedge', 'falling-wedge'] },
    { id: 'cup', title: '第 6 单元 · 杯柄与箱体', desc: '强势股的经典整理', emoji: '☕', lessons: ['cup-handle', 'rectangle'] },
    { id: 'checkpoint', title: '第 7 单元 · 综合大考', desc: '混在一起，看你还认不认得', emoji: '🏆', lessons: ['checkpoint'] }
  ];

  var UNIT_CAT = {
    topping: '顶部反转', bottoming: '底部反转', triangle: '三角收敛',
    flag: '旗形与楔形', cup: '杯柄与箱体', basics: '基础', checkpoint: '综合'
  };

  /* ================= 工具 ================= */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function shuffle(a) {
    var arr = a.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function newSeed() { return Math.floor(Math.random() * 1e9) + 1; }
  function hashStr(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function dateStr(d) {
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }
  function todayStr() { return dateStr(new Date()); }
  function yesterdayStr() { var d = new Date(); d.setDate(d.getDate() - 1); return dateStr(d); }
  var CIRCLED = ['①', '②', '③', '④', '⑤', '⑥'];

  /* ================= 状态 ================= */

  function defaults() {
    return {
      xp: 0, streak: 0, lastDay: '', day: '', dayXp: 0,
      lessons: {}, mistakes: {}, seen: {},
      settings: { sound: true, palette: 'cn' }
    };
  }
  function load() {
    var s = defaults();
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var o = JSON.parse(raw);
        Object.keys(s).forEach(function (k) {
          if (k === 'settings') {
            Object.keys(s.settings).forEach(function (sk) {
              if (o.settings && typeof o.settings[sk] !== 'undefined') s.settings[sk] = o.settings[sk];
            });
          } else if (typeof o[k] !== 'undefined') {
            s[k] = o[k];
          }
        });
      }
    } catch (e) { /* 隐私模式下读不到就用默认值 */ }
    return s;
  }
  var S = load();

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
  }
  function ensureDay() {
    var t = todayStr();
    if (S.day !== t) { S.day = t; S.dayXp = 0; save(); }
  }
  function lessonRec(id) { return S.lessons[id] || { level: 0, plays: 0, best: 0 }; }

  /* ================= 声音 ================= */

  var actx = null;
  function audio() {
    if (!S.settings.sound) return null;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!actx) {
      try { actx = new AC(); } catch (e) { return null; }
    }
    if (actx.state === 'suspended') { try { actx.resume(); } catch (e) { } }
    return actx;
  }
  function tone(freq, delay, dur, type, vol, slideTo) {
    var c = audio();
    if (!c) return;
    var t = c.currentTime + delay;
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.1, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.03);
  }
  function sfxGood() { tone(660, 0, 0.1, 'sine', 0.11); tone(990, 0.075, 0.16, 'sine', 0.09); }
  function sfxBad() { tone(230, 0, 0.18, 'sawtooth', 0.055, 150); }
  function sfxComplete() {
    [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.09, 0.2, 'sine', 0.09); });
  }

  /* ================= Toast / 彩带 ================= */

  var toastTimer = null;
  function showToast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 1800);
  }

  function confetti() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var cv = document.getElementById('fx');
    var ctx = cv.getContext('2d');
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var W = window.innerWidth, H = window.innerHeight;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var colors = ['#58cc02', '#6c5ce7', '#ffc800', '#1cb0f6', '#ff4b4b'];
    var parts = [];
    for (var i = 0; i < 90; i++) {
      parts.push({
        x: W / 2 + (Math.random() - 0.5) * 120,
        y: H * 0.4,
        vx: (Math.random() - 0.5) * 9,
        vy: -Math.random() * 8 - 3,
        r: 3 + Math.random() * 4,
        c: colors[i % colors.length],
        rot: Math.random() * 6
      });
    }
    var t0 = performance.now();
    function frame(now) {
      var k = Math.min(1, (now - t0) / 1500);
      ctx.clearRect(0, 0, W, H);
      parts.forEach(function (p) {
        p.vy += 0.3; p.x += p.vx; p.y += p.vy; p.rot += 0.12;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = 1 - k;
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.7);
        ctx.restore();
      });
      if (k < 1) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, W, H);
    }
    requestAnimationFrame(frame);
  }

  /* ================= 路由 ================= */

  var route = { tab: 'home', detail: null };
  var session = null;

  function updateTabs() {
    $$('.tab').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.tab === route.tab);
    });
  }

  function go(tab, detail) {
    session = null;
    document.body.classList.remove('in-lesson');
    route.tab = tab;
    route.detail = detail || null;
    updateTabs();
    render();
    window.scrollTo(0, 0);
  }

  function render() {
    ensureDay();
    updateChips();
    if (route.tab === 'home') renderHome();
    else if (route.tab === 'library') {
      if (route.detail) renderDetail(route.detail);
      else renderLibrary();
    } else if (route.tab === 'review') renderReview();
    else renderStats();
  }

  function updateChips() {
    var streak = $('#chipStreak'), xp = $('#chipXp');
    if (streak) streak.textContent = '🔥 ' + S.streak;
    if (xp) xp.textContent = '⚡ ' + S.xp;
  }

  /* ================= 课程元信息 ================= */

  function lessonMeta(id) {
    if (id === 'intro') return { id: id, icon: '🕯️', title: 'K 线入门', sub: '一根蜡烛的四个价格', unit: 'basics' };
    if (id === 'checkpoint') return { id: id, icon: '🏆', title: '综合大考', sub: '混合抽题', unit: 'checkpoint' };
    if (id === '__review') return { id: id, icon: '🎯', title: '错题复习', sub: '专门练错过的', unit: 'checkpoint' };
    if (id === '__random') return { id: id, icon: '🎲', title: '随机测验', sub: '六道混抽', unit: 'checkpoint' };
    var p = P.byId[id];
    if (!p) return { id: id, icon: '❓', title: id, sub: '', unit: 'basics' };
    return { id: id, icon: PATTERN_EMOJI[id] || '📊', title: p.zh, sub: p.biasLabel, unit: p.unit, pattern: p };
  }

  function flatLessons() {
    return UNITS.reduce(function (acc, u) { return acc.concat(u.lessons); }, []);
  }
  function isUnlocked(id) {
    if (lessonRec(id).level > 0) return true;
    var arr = flatLessons();
    var i = arr.indexOf(id);
    if (i <= 0) return true;
    var prev = lessonRec(arr[i - 1]);
    return prev.level > 0;
  }

  /* ================= 首页 ================= */

  function renderHome() {
    document.body.classList.remove('in-lesson');
    var pct = Math.min(100, Math.round(S.dayXp / DAILY_GOAL * 100));
    var left = Math.max(0, DAILY_GOAL - S.dayXp);
    var goalLine = left > 0 ? ('再赚 ' + left + ' XP 就完成今天的目标') : '今天的目标达成，保持这个节奏';
    var html = '';

    html += '<section class="goal-card">';
    html += '<div class="ring" style="--p:' + pct + '"><b>' + S.dayXp + '<small>/ ' + DAILY_GOAL + ' XP</small></b></div>';
    html += '<div class="goal-text"><h2>' + (left > 0 ? '今日目标' : '今日目标已完成 🎉') + '</h2>';
    html += '<p>' + goalLine + '。连续学习 ' + S.streak + ' 天。</p></div>';
    html += '<div class="goal-flame" aria-hidden="true">' + (S.streak > 2 ? '🔥' : '✨') + '</div>';
    html += '</section>';

    html += '<div class="quick">';
    html += '<button class="btn btn-ghost btn-sm" id="quickRandom">🎲 随机测 6 题</button>';
    html += '<button class="btn btn-ghost btn-sm" id="quickLib">📖 翻图鉴</button>';
    html += '</div>';

    UNITS.forEach(function (u) {
      html += '<div class="unit ' + u.id + '">';
      html += '<div><h2>' + u.title + '</h2><p>' + u.desc + '</p></div>';
      html += '<div class="unit-emoji" aria-hidden="true">' + u.emoji + '</div>';
      html += '</div>';
      html += '<div class="path">';
      u.lessons.forEach(function (id, i) { html += nodeHTML(id, i, u.lessons.length); });
      html += '</div>';
    });

    html += '<div class="disclaimer">本应用用于练习 K 线形态的识别与术语，示例图形由算法生成，不构成任何投资建议。形态只提高概率，不保证结果。</div>';

    view.innerHTML = html;

    $$('.node').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.dataset.lesson;
        if (!isUnlocked(id)) { showToast('先完成上一课，就能解锁这里'); return; }
        startLesson(id, { tab: 'home', detail: null });
      });
    });
    var qr = $('#quickRandom');
    if (qr) qr.addEventListener('click', function () { startLesson('__random', { tab: 'home', detail: null }); });
    var ql = $('#quickLib');
    if (ql) ql.addEventListener('click', function () { go('library'); });
  }

  function nodeHTML(id, index, total) {
    var m = lessonMeta(id);
    var rec = lessonRec(id);
    var done = rec.level > 0;
    var unlocked = isUnlocked(id);
    var cls = 'node' + (done ? ' is-done' : (unlocked ? ' is-ready' : ' is-locked'));
    var icon = done ? '✓' : (unlocked ? m.icon : '🔒');
    var crowns = rec.level > 1 ? '<span class="node-crowns">' + new Array(Math.min(3, rec.level - 1) + 1).join('👑') + '</span>' : '';
    var sub = done ? ('已练 ' + (rec.plays || 1) + ' 次') : m.sub;
    var shifts = total === 1 ? [0] : total === 2 ? [-34, 34] : total === 3 ? [-46, 0, 46] : [-52, -18, 52, 18, 0];
    var shift = shifts[index % shifts.length];
    return '<button class="' + cls + '" data-lesson="' + id + '" style="--shift:' + shift + 'px"' + (unlocked ? '' : ' aria-disabled="true"') + '>' +
      '<span class="node-badge">' + icon + crowns + '</span>' +
      '<span class="node-title">' + m.title + '</span>' +
      '<span class="node-sub">' + sub + '</span>' +
      '</button>';
  }

  /* ================= 图鉴 ================= */

  var libFilter = 'all';

  var FILTERS = [
    { id: 'all', label: '全部' },
    { id: 'topping', label: '顶部反转' },
    { id: 'bottoming', label: '底部反转' },
    { id: 'triangle', label: '三角收敛' },
    { id: 'flag', label: '旗形与楔形' },
    { id: 'cup', label: '杯柄与箱体' }
  ];

  function renderLibrary() {
    updateTabs();
    var list = P.list.filter(function (p) { return libFilter === 'all' || p.unit === libFilter; });
    var html = '<div class="filter-row">';
    FILTERS.forEach(function (f) {
      html += '<button class="fchip' + (libFilter === f.id ? ' is-active' : '') + '" data-f="' + f.id + '">' + f.label + '</button>';
    });
    html += '</div>';
    html += '<div class="lib-grid">';
    list.forEach(function (p) {
      html += '<button class="lib-card" data-pid="' + p.id + '">' +
        '<canvas data-chart="thumb-' + p.id + '"></canvas>' +
        '<h3>' + p.zh + '</h3>' +
        '<p>' + p.en + '</p>' +
        '<span class="badge ' + p.bias + '">' + p.biasLabel + '</span>' +
        '<span class="badge cat">' + (UNIT_CAT[p.unit] || '形态') + '</span>' +
        '</button>';
    });
    html += '</div>';
    html += '<div class="disclaimer">点开任意形态，能看到它的三种不同长相、识别要点和常见误判。</div>';
    view.innerHTML = html;

    $$('.fchip').forEach(function (b) {
      b.addEventListener('click', function () { libFilter = b.dataset.f; renderLibrary(); });
    });
    $$('.lib-card').forEach(function (b) {
      b.addEventListener('click', function () { go('library', b.dataset.pid); });
    });
    $$('.lib-card canvas').forEach(function (cv) {
      var pid = cv.dataset.chart.replace('thumb-', '');
      Chart.render(cv, P.variant(pid, hashStr(pid), false, { n: 28 }), {
        animate: false, showVolume: false, showLines: false
      });
    });
  }

  /* ================= 形态详情 ================= */

  var detailSeed = newSeed();

  function renderDetail(pid) {
    var p = P.byId[pid];
    if (!p) { go('library'); return; }
    updateTabs();
    var rec = lessonRec(pid);
    var html = '<div class="detail-head">' +
      '<button class="icon-btn" id="detailBack" aria-label="返回图鉴">←</button>' +
      '<div class="detail-title"><h2>' + p.zh + '</h2><p>' + p.en + '</p></div>' +
      '</div>';
    html += '<div class="detail-body">';
    html += '<div class="detail-tags">' +
      '<span class="badge ' + p.bias + '">' + p.biasLabel + '</span>' +
      '<span class="badge cat">' + (UNIT_CAT[p.unit] || '形态') + '</span>' +
      (rec.level > 0 ? '<span class="badge bull">已练 ' + rec.plays + ' 次</span>' : '') +
      '</div>';
    html += '<p class="q-sub" style="margin:0 0 4px">' + p.tagline + '</p>';

    html += '<div class="variants-head"><h3>同一个形态，三种正确长相</h3><button class="btn btn-ghost btn-sm" id="shuffleVariants">换一组</button></div>';
    html += '<div class="variants" id="variants">';
    for (var i = 0; i < 3; i++) {
      html += '<div class="variant"><canvas data-chart="var-' + i + '"></canvas><span>变体 ' + (i + 1) + ' · 噪声、时间跨度都不同</span></div>';
    }
    html += '</div>';
    html += '<p class="variant-note">三张图都成立，但长得不一样——形态看的是结构关系，不是某一条特定曲线。</p>';

    html += '<div class="info-block"><h3>🔍 怎么识别</h3><ul>' + p.signs.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul></div>';
    html += '<div class="info-block"><h3>📊 成交量</h3><p>' + p.volume + '</p></div>';
    html += '<div class="info-block"><h3>✅ 怎么确认</h3><p>' + p.confirm + '</p></div>';
    html += '<div class="info-block"><h3>⚠️ 容易看错</h3><p class="warn">' + p.trap + '</p></div>';
    html += '<div class="info-block"><h3>🧠 一句话记住</h3><p>' + p.summary + '</p></div>';

    html += '<div class="detail-cta">' +
      '<button class="btn btn-primary" id="practiceOne">练这一课</button>' +
      '<button class="btn btn-ghost" id="backLib">返回图鉴</button>' +
      '</div>';
    html += '<div class="disclaimer">示例图形由算法随机生成，仅用于学习形态识别，不构成投资建议。</div>';
    html += '</div>';
    view.innerHTML = html;

    renderVariants(pid);

    $('#detailBack').addEventListener('click', function () { go('library'); });
    $('#backLib').addEventListener('click', function () { go('library'); });
    $('#shuffleVariants').addEventListener('click', function () {
      detailSeed = newSeed();
      renderVariants(pid);
    });
    $('#practiceOne').addEventListener('click', function () {
      startLesson(pid, { tab: 'library', detail: pid });
    });
  }

  function renderVariants(pid) {
    for (var i = 0; i < 3; i++) {
      var cv = view.querySelector('[data-chart="var-' + i + '"]');
      if (!cv) continue;
      var series = P.variant(pid, detailSeed + i * 9176, false, { n: 38 });
      Chart.render(cv, series, { showLines: true, showPoints: i === 0, showLabels: i === 0, showVolume: true });
    }
  }

  /* ================= 复习 ================= */

  function mistakeIds() {
    return Object.keys(S.mistakes).filter(function (id) { return S.mistakes[id] > 0 && P.byId[id]; });
  }

  function renderReview() {
    updateTabs();
    var ids = mistakeIds();
    var html = '';
    if (!ids.length) {
      html = '<div class="empty"><div class="big">🎯</div><h3>错题本是空的</h3>' +
        '<p>做题时答错的内容会自动收进这里。<br>先把每一课的形态过一遍吧。</p>' +
        '<div style="margin-top:18px"><button class="btn btn-purple" id="reviewGoHome">去学习</button></div></div>';
    } else {
      html = '<div class="section-title"><h2>错题本</h2><span>' + ids.length + ' 个形态待复习</span></div>';
      html += '<div class="panel"><p class="q-sub" style="margin:0 0 10px">复习全部答对后，这些记录会自动清掉。</p>';
      html += '<div class="mistake-list">';
      ids.forEach(function (id) {
        var p = P.byId[id];
        html += '<div class="mistake-row">' +
          '<span class="emoji">' + (PATTERN_EMOJI[id] || '📊') + '</span>' +
          '<div class="txt"><b>' + p.zh + '</b><small>' + p.en + '</small></div>' +
          '<span class="count">错 ' + S.mistakes[id] + ' 次</span>' +
          '</div>';
      });
      html += '</div>';
      html += '<div style="margin-top:16px"><button class="btn btn-primary" id="reviewStart">开始复习</button></div>';
      html += '<div style="margin-top:10px"><button class="btn btn-ghost btn-sm" id="reviewClear">清空错题本</button></div>';
      html += '</div>';
    }
    view.innerHTML = html;

    var homeBtn = $('#reviewGoHome');
    if (homeBtn) homeBtn.addEventListener('click', function () { go('home'); });
    var start = $('#reviewStart');
    if (start) start.addEventListener('click', function () { startLesson('__review', { tab: 'review', detail: null }); });
    var clear = $('#reviewClear');
    if (clear) clear.addEventListener('click', function () {
      if (window.confirm('清空错题本？这个操作不能撤销。')) { S.mistakes = {}; save(); renderReview(); }
    });
  }

  /* ================= 我的 ================= */

  function renderStats() {
    updateTabs();
    var doneCount = flatLessons().filter(function (id) { return lessonRec(id).level > 0; }).length;
    var mastered = P.list.filter(function (p) { return lessonRec(p.id).level >= 3; }).length;
    var html = '<div class="section-title"><h2>我的进度</h2><span>本地保存，换设备不同步</span></div>';
    html += '<div class="stats-grid">' +
      '<div class="stat-card purple"><b>' + S.xp + '</b><span>累计 XP</span></div>' +
      '<div class="stat-card orange"><b>' + S.streak + '</b><span>连续学习天数</span></div>' +
      '<div class="stat-card green"><b>' + doneCount + ' / ' + flatLessons().length + '</b><span>已完成课程</span></div>' +
      '<div class="stat-card gold"><b>' + mastered + ' / ' + P.list.length + '</b><span>精通形态</span></div>' +
      '</div>';

    html += '<div class="section-title"><h2>偏好设置</h2><span>只影响显示</span></div>';
    html += '<div class="panel">';
    html += '<div class="setting-row"><div class="st"><b>蜡烛配色</b><small>中国习惯红涨绿跌，国际习惯相反</small></div>' +
      '<div class="seg"><button data-palette="cn" class="' + (S.settings.palette === 'cn' ? 'is-active' : '') + '">红涨</button>' +
      '<button data-palette="intl" class="' + (S.settings.palette === 'intl' ? 'is-active' : '') + '">绿涨</button></div></div>';
    html += '<div class="setting-row"><div class="st"><b>音效</b><small>答对、答错和完成时的提示音</small></div>' +
      '<button class="switch' + (S.settings.sound ? ' on' : '') + '" id="soundSwitch" aria-label="音效开关"></button></div>';
    html += '</div>';

    html += '<div class="section-title"><h2>形态熟练度</h2><span>每完成一轮升一级</span></div>';
    html += '<div class="panel"><div class="mastery-list">';
    P.list.forEach(function (p) {
      var rec = lessonRec(p.id);
      var dots = '';
      for (var i = 0; i < 3; i++) dots += '<span class="dot' + (i < rec.level ? ' on' : '') + '"></span>';
      html += '<div class="mastery-row"><b>' + p.zh + '</b><span class="lv">' + (rec.level ? rec.level + ' 级' : '未开始') + '</span><span class="dots">' + dots + '</span></div>';
    });
    html += '</div></div>';

    html += '<div class="panel" style="margin-top:22px"><button class="btn btn-ghost btn-sm" id="resetAll">重置全部进度</button></div>';
    html += '<div class="disclaimer">数据只保存在这台设备的浏览器里。清除浏览器数据会一起清掉。</div>';
    view.innerHTML = html;

    $$('.seg button').forEach(function (b) {
      b.addEventListener('click', function () {
        S.settings.palette = b.dataset.palette;
        Chart.setPalette(S.settings.palette);
        save();
        renderStats();
      });
    });
    var sw = $('#soundSwitch');
    if (sw) sw.addEventListener('click', function () {
      S.settings.sound = !S.settings.sound;
      save();
      sw.classList.toggle('on', S.settings.sound);
      if (S.settings.sound) sfxGood();
    });
    var reset = $('#resetAll');
    if (reset) reset.addEventListener('click', function () {
      if (window.confirm('确定清空所有学习进度？这个操作不能撤销。')) {
        S = defaults();
        Chart.setPalette('cn');
        save();
        go('home');
      }
    });
  }

  /* ================= 出题 ================= */

  function optionSet(correct, others) {
    var opts = shuffle([correct].concat(others));
    return { options: opts, answer: opts.indexOf(correct) };
  }

  function pickOthers(pid, n) {
    var p = P.byId[pid];
    var pool = P.list.filter(function (x) { return x.id !== pid; });
    var same = shuffle(pool.filter(function (x) { return x.unit === p.unit; }));
    var rest = shuffle(pool.filter(function (x) { return x.unit !== p.unit; }));
    return same.concat(rest).slice(0, n);
  }

  function quizIdentifyZh(pid, seed, kicker) {
    var p = P.byId[pid];
    var others = pickOthers(pid, 3);
    var set = optionSet(p, others);
    return {
      type: 'quiz', pid: pid, kicker: kicker || '看图识形态',
      q: '这张图是哪种形态？',
      sub: '先看形状，再找关键位置',
      series: P.variant(pid, seed),
      tall: true,
      options: set.options.map(function (x) { return x.zh; }),
      answer: set.answer,
      explain: p.zh + '（' + p.en + '）：' + p.tagline + '。'
    };
  }

  function quizIdentifyEn(pid, seed) {
    var p = P.byId[pid];
    var others = pickOthers(pid, 3);
    var set = optionSet(p, others);
    return {
      type: 'quiz', pid: pid, kicker: '中文 ↔ English',
      q: '「' + p.zh + '」的英文术语是？',
      sub: '记住英文名，看外文资料时能对上号',
      series: P.variant(pid, seed),
      options: set.options.map(function (x) { return x.en; }),
      answer: set.answer,
      explain: p.zh + ' = ' + p.en + (p.alias ? '（也叫 ' + p.alias + '）' : '') + '。'
    };
  }

  function quizValidity(pid, seed) {
    var p = P.byId[pid];
    var invalid = Math.random() < 0.5;
    var series = P.variant(pid, seed, invalid);
    return {
      type: 'quiz', pid: pid, kicker: '它成立吗',
      q: '这张图可以称为「' + p.zh + '」吗？',
      sub: '形态成立不成立，看的是结构条件',
      series: series,
      tall: true,
      options: ['可以，形态成立', '不行，不成立'],
      answer: invalid ? 1 : 0,
      explain: invalid
        ? (series.reason || '关键条件没有满足，不能算作该形态。')
        : ('成立。' + p.tagline + '。' + p.confirm)
    };
  }

  function quizBias(pid, seed) {
    var p = P.byId[pid];
    var idx = p.bias === 'bull' ? 0 : p.bias === 'bear' ? 1 : 2;
    return {
      type: 'quiz', pid: pid, kicker: '它预示什么',
      q: '这个形态通常预示什么？',
      sub: '选最贴切的方向',
      series: P.variant(pid, seed),
      options: ['看涨', '看跌', '方向不明'],
      answer: idx,
      explain: '这是' + p.biasLabel + '形态。' + p.confirm
    };
  }

  function multiStep(pid, seed) {
    var items = [
      { series: P.variant(pid, seed, false, { n: 26 }), valid: true, reason: '' },
      { series: P.variant(pid, seed + 31, false, { n: 26 }), valid: true, reason: '' },
      { series: P.variant(pid, seed + 67, true, { n: 26 }), valid: false, reason: '' },
      { series: P.variant(pid, seed + 103, true, { n: 26 }), valid: false, reason: '' }
    ];
    items.forEach(function (it) {
      if (!it.valid) it.reason = it.series.reason || '关键条件不满足，形态不成立。';
    });
    items = shuffle(items);
    return { type: 'multi', pid: pid, items: items };
  }

  function anatomyStep(pid, seed) {
    var p = P.byId[pid];
    var series = P.variant(pid, seed);
    var points = series.points || [];
    var answer = -1;
    for (var i = 0; i < points.length; i++) {
      if (points[i].label === series.askLabel) { answer = i; break; }
    }
    if (answer < 0 && points.length) answer = 0;
    return {
      type: 'anatomy', pid: pid, series: series,
      question: series.ask || '图中标注的哪一处是关键位置？',
      answer: answer,
      options: points.map(function (_, i) { return String.fromCharCode(65 + i); }),
      explain: p.zh + ' 的关键位置：' + points.map(function (pt, i) {
        return String.fromCharCode(65 + i) + ' ' + pt.label;
      }).join('、') + '。'
    };
  }

  function matchStep(pid, seed) {
    var p = P.byId[pid];
    var learned = P.list.filter(function (x) {
      return x.id !== pid && lessonRec(x.id).level > 0;
    });
    var pool = learned.length >= 2 ? learned : P.list.filter(function (x) { return x.id !== pid; });
    var picks = shuffle(pool).slice(0, 2);
    var pairs = shuffle([p].concat(picks)).map(function (x) { return { zh: x.zh, en: x.en }; });
    return { type: 'match', pid: pid, pairs: pairs, explain: pairs.map(function (x) { return x.zh + ' = ' + x.en; }).join('；') + '。' };
  }

  function patternSteps(pid, seed) {
    var p = P.byId[pid];
    var steps = [
      { type: 'teach', pid: pid, seed: seed },
      quizIdentifyZh(pid, seed + 11),
      multiStep(pid, seed + 23),
      quizIdentifyEn(pid, seed + 37),
      quizValidity(pid, seed + 41),
      anatomyStep(pid, seed + 53),
      matchStep(pid, seed + 59)
    ];
    if (p.bias !== 'neutral') steps.push(quizBias(pid, seed + 71));
    return steps;
  }

  function checkpointSteps(seed) {
    var pool = shuffle(P.list).slice(0, 8);
    var steps = [];
    steps.push(quizIdentifyZh(pool[0].id, seed + 5, '综合大考'));
    steps.push(quizIdentifyZh(pool[1].id, seed + 11, '综合大考'));
    steps.push(multiStep(pool[2].id, seed + 17));
    steps.push(quizValidity(pool[3].id, seed + 23));
    steps.push(quizIdentifyEn(pool[4].id, seed + 29));
    steps.push(multiStep(pool[5].id, seed + 31));
    steps.push(quizValidity(pool[6].id, seed + 41));
    steps.push(quizIdentifyZh(pool[7].id, seed + 47, '综合大考'));
    return steps;
  }

  function randomSteps(seed) {
    var pool = shuffle(P.list).slice(0, 6);
    return pool.map(function (p, i) {
      if (i % 3 === 2) return quizValidity(p.id, seed + i * 13);
      return quizIdentifyZh(p.id, seed + i * 13, '随机测验');
    });
  }

  function reviewSteps(seed) {
    var ids = shuffle(mistakeIds()).slice(0, 4);
    var steps = [];
    ids.forEach(function (id, i) {
      steps.push(quizIdentifyZh(id, seed + i * 17, '错题复习'));
      steps.push(quizValidity(id, seed + i * 17 + 5));
    });
    return steps.slice(0, 8);
  }

  function introSteps() {
    return [
      { type: 'teach', key: 'candle' },
      {
        type: 'quiz', kicker: 'K 线入门', q: '图中最后一根 K 线，收盘价高于开盘价，它叫什么？',
        sub: '先认识最基础的两种蜡烛',
        series: introSeries('bull'),
        options: ['阳线', '阴线', '十字星'], answer: 0,
        explain: '收盘价高于开盘价就是阳线（中文行情软件里通常画成红色）。反过来，收盘低于开盘是阴线。'
      },
      {
        type: 'quiz', kicker: 'K 线入门', q: '一根 K 线带着很长的下影线，通常说明…',
        sub: '影线代表价格去过、但没留住的地方',
        series: introSeries('hammer'),
        options: ['下方有买盘承接', '上方抛压沉重', '当时几乎没有成交'], answer: 0,
        explain: '下影线长，说明价格往下冲过又被买了回来，下方承接较强。长上影线则相反，代表上方抛压重。'
      },
      {
        type: 'quiz', kicker: 'K 线入门', q: '高点不断抬高、低点也不断抬高，这是…',
        sub: '趋势的定义',
        series: introSeries('uptrend'),
        options: ['上升趋势', '下降趋势', '横盘震荡'], answer: 0,
        explain: '更高的高点 + 更高的低点，就是上升趋势。反过来，更低的高点 + 更低的低点，是下降趋势。'
      },
      { type: 'teach', key: 'probability' }
    ];
  }

  function introSeries(kind) {
    function mk(o, c, w) { return { o: o, c: c, h: Math.max(o, c) + w, l: Math.min(o, c) - w, v: 0.5 }; }
    var candles = [], i, p;
    if (kind === 'uptrend') {
      for (i = 0; i < 16; i++) {
        p = 58 + i * 1.3;
        candles.push(mk(p, p + (i % 3 === 0 ? -1.5 : 1.9), 1.0));
      }
    } else {
      for (i = 0; i < 13; i++) {
        p = 60 + Math.sin(i * 0.8) * 2.6;
        candles.push(mk(p, p + (i % 2 ? -0.9 : 1.1), 0.9));
      }
      if (kind === 'hammer') candles.push({ o: 61.6, c: 61.2, h: 62.3, l: 56.2, v: 0.95 });
      else candles.push({ o: 60.2, c: 62.8, h: 63.2, l: 59.9, v: 0.9 });
    }
    return { candles: candles };
  }

  function buildSteps(id) {
    var seed = newSeed();
    if (id === 'intro') return introSteps();
    if (id === 'checkpoint') return checkpointSteps(seed);
    if (id === '__random') return randomSteps(seed);
    if (id === '__review') return reviewSteps(seed);
    if (!P.byId[id]) return [];
    return patternSteps(id, seed);
  }

  /* ================= 课程播放器 ================= */

  function startLesson(id, from) {
    var steps = buildSteps(id);
    if (!steps.length) {
      showToast('暂时没有可用的题目');
      session = null;
      document.body.classList.remove('in-lesson');
      render();
      return;
    }
    session = {
      id: id,
      steps: steps,
      idx: 0,
      hearts: MAX_HEARTS,
      correct: 0,
      total: 0,
      checked: false,
      selection: null,
      teachMode: false,
      check: null,
      currentPid: null,
      patternIds: steps.filter(function (s) { return s.pid; }).map(function (s) { return s.pid; }),
      from: from || { tab: route.tab, detail: route.detail }
    };
    document.body.classList.add('in-lesson');
    window.scrollTo(0, 0);
    renderLesson();
  }

  function exitLesson() {
    var from = session ? session.from : null;
    session = null;
    document.body.classList.remove('in-lesson');
    if (from) { route.tab = from.tab; route.detail = from.detail; }
    updateTabs();
    render();
  }

  function heartsHTML() {
    var s = '';
    for (var i = 0; i < MAX_HEARTS; i++) {
      s += '<span class="' + (i < session.hearts ? '' : 'dead') + '">❤️</span>';
    }
    return s;
  }

  function updateHearts() {
    var el = $('#hearts');
    if (el) el.innerHTML = heartsHTML();
  }

  function lessonShell(inner) {
    var pct = Math.round(session.idx / session.steps.length * 100);
    return '<div class="lesson">' +
      '<div class="lesson-head">' +
      '<button class="icon-btn" id="lessonClose" aria-label="退出这一课">✕</button>' +
      '<div class="progress-track"><div class="progress-fill" id="progressFill" style="width:' + pct + '%"></div></div>' +
      '<div class="hearts" id="hearts">' + heartsHTML() + '</div>' +
      '</div>' +
      '<div class="lesson-body" id="lessonBody">' + inner + '</div>' +
      '<div class="lesson-foot"><div class="lesson-foot-inner">' +
      '<div class="feedback" id="feedback"></div>' +
      '<button class="btn btn-primary" id="mainBtn" disabled>检查</button>' +
      '</div></div></div>';
  }

  function renderLesson() {
    if (!session) return;
    if (session.idx >= session.steps.length) { finishLesson(); return; }
    var step = session.steps[session.idx];
    session.checked = false;
    session.selection = null;
    session.teachMode = false;
    session.check = null;
    session.currentPid = step.pid || null;

    var built;
    if (step.type === 'teach') built = renderTeach(step);
    else if (step.type === 'quiz') built = renderQuiz(step);
    else if (step.type === 'multi') built = renderMulti(step);
    else if (step.type === 'anatomy') built = renderAnatomy(step);
    else if (step.type === 'match') built = renderMatch(step);
    else built = { html: '<p>未知题型</p>' };

    view.innerHTML = lessonShell(built.html);

    $('#lessonClose').addEventListener('click', exitLesson);
    $('#mainBtn').addEventListener('click', onMainBtn);

    if (built.after) built.after();
    if (built.charts) {
      built.charts.forEach(function (c) {
        var cv = view.querySelector('[data-chart="' + c.key + '"]');
        if (cv) Chart.render(cv, c.series, c.opt);
      });
    }
    if (step.type === 'teach') {
      session.teachMode = true;
      var btn = $('#mainBtn');
      btn.textContent = '明白了';
      btn.disabled = false;
    }
    updateHearts();
    window.scrollTo(0, 0);
  }

  function onMainBtn() {
    if (!session) return;
    var btn = $('#mainBtn');
    if (session.teachMode) { nextStep(); return; }
    if (!session.checked) {
      if (btn.disabled || !session.check) return;
      var res = session.check();
      if (res) runCheck(res);
      return;
    }
    if (session.hearts <= 0) { failScreen(); return; }
    nextStep();
  }

  function nextStep() {
    session.idx++;
    renderLesson();
  }

  function showFeedback(res) {
    var f = $('#feedback');
    if (!f) return;
    f.className = 'feedback show ' + (res.ok ? 'ok' : 'bad');
    f.innerHTML = '<b>' + res.title + '</b>' + (res.detail ? '<br>' + res.detail : '');
  }

  function loseHeart() {
    if (!session) return;
    session.hearts = Math.max(0, session.hearts - 1);
    updateHearts();
    var h = $('#hearts');
    if (h) {
      h.style.transform = 'scale(1.16)';
      setTimeout(function () { if (h) h.style.transform = ''; }, 180);
    }
  }

  function recordMistake(pid) {
    if (!pid) return;
    S.mistakes[pid] = Math.min(9, (S.mistakes[pid] || 0) + 1);
    save();
  }

  function runCheck(res) {
    if (!session || session.checked) return;
    session.checked = true;
    session.total++;
    if (res.ok) {
      session.correct++;
      sfxGood();
    } else {
      recordMistake(session.currentPid);
      loseHeart();
      sfxBad();
    }
    showFeedback(res);
    var btn = $('#mainBtn');
    if (btn) {
      btn.disabled = false;
      btn.textContent = '继续';
    }
  }

  /* ---------- 题型：知识卡 ---------- */

  function renderTeach(step) {
    if (step.key === 'candle') return renderCandleTeach();
    if (step.key === 'probability') return renderProbabilityTeach();
    var p = P.byId[step.pid];
    var variants = [0, 1, 2].map(function (i) {
      return P.variant(step.pid, step.seed + i * 7919, false, { n: 34 });
    });
    var html = '<div class="teach-hero">' +
      '<div class="teach-name"><h2>' + p.zh + '</h2><p>' + p.en + '</p></div>' +
      '<div class="teach-tagline">' + p.tagline + '</div>' +
      '<div class="variant-strip">' +
      variants.map(function (v, i) {
        return '<div class="mini"><canvas data-chart="v' + i + '"></canvas><span>变体 ' + (i + 1) + '</span></div>';
      }).join('') +
      '</div>' +
      '<div class="teach-note">三张图都成立，但每次的长相都不一样——要记的是结构关系，不是某一条线。</div>' +
      '<div class="teach-points">' +
      p.signs.slice(0, 3).map(function (s) { return '<div class="pt"><i>✓</i><span>' + s + '</span></div>'; }).join('') +
      '</div>' +
      '<div class="teach-extra"><b>成交量</b>：' + p.volume + '</div>' +
      '</div>';
    return {
      html: html,
      charts: variants.map(function (v, i) {
        return { key: 'v' + i, series: v, opt: { showLines: true, showPoints: i === 0, showLabels: i === 0, showVolume: false } };
      })
    };
  }

  function renderCandleTeach() {
    var html = '<div class="q-kicker">K 线入门</div>' +
      '<h2 class="q-title">一根 K 线，记着四个价格</h2>' +
      '<div class="teach-hero">' +
      '<div class="chart-card" style="padding:10px">' +
      '<svg viewBox="0 0 240 300" width="100%" height="270" role="img" aria-label="K 线结构示意图">' +
      '<line x1="120" y1="16" x2="120" y2="62" stroke="#7d899b" stroke-width="2.5"/>' +
      '<rect x="96" y="62" width="48" height="158" rx="5" fill="#e5484d"/>' +
      '<line x1="120" y1="220" x2="120" y2="276" stroke="#7d899b" stroke-width="2.5"/>' +
      '<text x="158" y="24" font-size="12" fill="#4a5768">最高价 High</text>' +
      '<text x="158" y="70" font-size="12" fill="#4a5768">收盘价 Close</text>' +
      '<text x="158" y="214" font-size="12" fill="#4a5768">开盘价 Open</text>' +
      '<text x="158" y="284" font-size="12" fill="#4a5768">最低价 Low</text>' +
      '<text x="14" y="146" font-size="12" fill="#4a5768">实体</text>' +
      '<line x1="44" y1="142" x2="92" y2="142" stroke="#c3ccda" stroke-width="1.5" stroke-dasharray="3 3"/>' +
      '<text x="14" y="30" font-size="12" fill="#4a5768">上影线</text>' +
      '<text x="14" y="264" font-size="12" fill="#4a5768">下影线</text>' +
      '</svg></div>' +
      '<div class="teach-points">' +
      '<div class="pt"><i>✓</i><span><b>实体</b>：开盘价和收盘价之间的部分。收盘高于开盘是阳线，低于开盘是阴线。</span></div>' +
      '<div class="pt"><i>✓</i><span><b>影线</b>：价格到过、但没能留住的地方。上影线长说明上方抛压重，下影线长说明下方承接强。</span></div>' +
      '<div class="pt"><i>✓</i><span>一堆 K 线连起来，才形成头肩顶、三角形这些「形态」——形态是多根 K 线的关系，不是单根。</span></div>' +
      '</div>' +
      '</div>';
    return { html: html };
  }

  function renderProbabilityTeach() {
    var html = '<div class="q-kicker">学习之前</div>' +
      '<h2 class="q-title">形态是概率，不是保证</h2>' +
      '<div class="teach-hero">' +
      '<div class="teach-points">' +
      '<div class="pt"><i>✓</i><span><b>形态描述的是多空力量的变化</b>，它提高某种结果的可能性，但不承诺结果。</span></div>' +
      '<div class="pt"><i>✓</i><span><b>同一个形态，位置不同、周期不同，含义也不同。</b>高位和低位的三角形，可靠性不一样。</span></div>' +
      '<div class="pt"><i>✓</i><span><b>一定要等确认。</b>突破/跌破 + 放量，才是形态给你的信号；提前猜方向是另一回事。</span></div>' +
      '<div class="pt"><i>✓</i><span><b>先学会认，再谈用。</b>这个道场只练识别和术语，不构成投资建议。</span></div>' +
      '</div>' +
      '<div class="teach-extra">接下来的每一课：先看三种不同的正确长相，再做识别、判断、配对和术语题。答错会自动进错题本。</div>' +
      '</div>';
    return { html: html };
  }

  /* ---------- 题型：单选 ---------- */

  function renderQuiz(step) {
    var opts = step.options.map(function (o, i) {
      return '<button class="option" data-i="' + i + '">' +
        '<span class="key">' + String.fromCharCode(65 + i) + '</span><span>' + o + '</span></button>';
    }).join('');
    var html = '<div class="q-kicker">' + (step.kicker || '看图识形态') + '</div>' +
      '<h2 class="q-title">' + step.q + (step.sub ? '<small>' + step.sub + '</small>' : '') + '</h2>' +
      (step.series ? '<div class="chart-card"><canvas data-chart="main" class="chart' + (step.tall ? ' tall' : '') + '"></canvas></div>' : '') +
      '<div class="options" id="options">' + opts + '</div>';

    return {
      html: html,
      charts: step.series ? [{ key: 'main', series: step.series, opt: { showLines: false, showVolume: true } }] : [],
      after: function () {
        $$('.option').forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (session.checked) return;
            session.selection = parseInt(btn.dataset.i, 10);
            $$('.option').forEach(function (b) { b.classList.toggle('is-selected', b === btn); });
            setMainEnabled(true);
          });
        });
        session.check = function () {
          var ok = session.selection === step.answer;
          $$('.option').forEach(function (b, i) {
            if (i === step.answer) b.classList.add('is-right');
            else if (i === session.selection) b.classList.add('is-wrong');
            b.classList.remove('is-selected');
            b.disabled = true;
          });
          return {
            ok: ok,
            title: ok ? '答对了！' : '正确答案：' + step.options[step.answer],
            detail: step.explain
          };
        };
      }
    };
  }

  function setMainEnabled(on) {
    var btn = $('#mainBtn');
    if (btn) btn.disabled = !on;
  }

  /* ---------- 题型：多选图 ---------- */

  function renderMulti(step) {
    var html = '<div class="q-kicker">选出成立的图示</div>' +
      '<h2 class="q-title">下面哪些是成立的「' + P.byId[step.pid].zh + '」？<small>选出全部正确的，通常有两张</small></h2>' +
      '<div class="pick-grid" id="pickGrid">';
    step.items.forEach(function (it, i) {
      html += '<button class="pick" data-i="' + i + '">' +
        '<span class="pick-key">' + CIRCLED[i] + '</span>' +
        '<canvas data-chart="p' + i + '"></canvas>' +
        '</button>';
    });
    html += '</div>';

    return {
      html: html,
      charts: step.items.map(function (it, i) {
        return { key: 'p' + i, series: it.series, opt: { showLines: true, showLabels: false, showVolume: false } };
      }),
      after: function () {
        var chosen = {};
        $$('.pick').forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (session.checked) return;
            var i = parseInt(btn.dataset.i, 10);
            chosen[i] = !chosen[i];
            btn.classList.toggle('is-selected', chosen[i]);
            session.selection = Object.keys(chosen).some(function (k) { return chosen[k]; }) ? 1 : null;
            setMainEnabled(session.selection !== null);
          });
        });
        session.check = function () {
          var validSet = [], selSet = [];
          step.items.forEach(function (it, i) {
            if (it.valid) validSet.push(i);
            if (chosen[i]) selSet.push(i);
          });
          var ok = selSet.length === validSet.length && selSet.every(function (i) { return validSet.indexOf(i) >= 0; });
          $$('.pick').forEach(function (b, i) {
            b.disabled = true;
            b.classList.remove('is-selected');
            if (step.items[i].valid) b.classList.add('is-right');
            else if (chosen[i]) b.classList.add('is-wrong');
          });
          var detail = '成立的是：' + validSet.map(function (i) { return CIRCLED[i]; }).join('、') + '。';
          step.items.forEach(function (it, i) {
            if (!it.valid) detail += ' ' + CIRCLED[i] + ' 不成立——' + it.reason;
          });
          return { ok: ok, title: ok ? '全部选对！' : '还差一点', detail: detail };
        };
      }
    };
  }

  /* ---------- 题型：看标注点 ---------- */

  function renderAnatomy(step) {
    var opts = step.options.map(function (o, i) {
      return '<button class="option" data-i="' + i + '">' +
        '<span class="key">' + o + '</span><span>图中标注的 ' + o + ' 位置</span></button>';
    }).join('');
    var html = '<div class="q-kicker">找位置</div>' +
      '<h2 class="q-title">' + step.question + '<small>对照图上标注的字母作答</small></h2>' +
      '<div class="chart-card"><canvas data-chart="main" class="chart tall"></canvas></div>' +
      '<div class="options" id="options">' + opts + '</div>';

    return {
      html: html,
      charts: [{ key: 'main', series: step.series, opt: { showLines: true, showVolume: true, letters: true, showPoints: true } }],
      after: function () {
        $$('.option').forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (session.checked) return;
            session.selection = parseInt(btn.dataset.i, 10);
            $$('.option').forEach(function (b) { b.classList.toggle('is-selected', b === btn); });
            setMainEnabled(true);
          });
        });
        session.check = function () {
          var ok = session.selection === step.answer;
          $$('.option').forEach(function (b, i) {
            if (i === step.answer) b.classList.add('is-right');
            else if (i === session.selection) b.classList.add('is-wrong');
            b.classList.remove('is-selected');
            b.disabled = true;
          });
          return {
            ok: ok,
            title: ok ? '找对了！' : '正确位置是 ' + step.options[step.answer],
            detail: step.explain
          };
        };
      }
    };
  }

  /* ---------- 题型：中英配对 ---------- */

  function renderMatch(step) {
    var lefts = step.pairs.map(function (p, i) {
      return '<button class="match-chip zh" data-i="' + i + '">' + p.zh + '</button>';
    }).join('');
    var rights = shuffle(step.pairs.map(function (p, i) { return { en: p.en, i: i }; })).map(function (x) {
      return '<button class="match-chip en" data-i="' + x.i + '">' + x.en + '</button>';
    }).join('');
    var html = '<div class="q-kicker">中文 ↔ English</div>' +
      '<h2 class="q-title">把中文名和英文术语配成对</h2>' +
      '<p class="match-hint">先点左边一个中文，再点右边对应的英文。配对正确会变绿。</p>' +
      '<div class="match-grid">' +
      '<div class="match-col" id="matchLeft">' + lefts + '</div>' +
      '<div class="match-col" id="matchRight">' + rights + '</div>' +
      '</div>';

    return {
      html: html,
      after: function () {
        var leftBtns = $$('.match-chip.zh');
        var rightBtns = $$('.match-chip.en');
        var active = -1;
        var done = 0;

        leftBtns.forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (session.checked || btn.classList.contains('is-done')) return;
            active = parseInt(btn.dataset.i, 10);
            leftBtns.forEach(function (b) {
              b.classList.toggle('is-active', b === btn && !b.classList.contains('is-done'));
            });
          });
        });

        rightBtns.forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (session.checked || btn.classList.contains('is-done')) return;
            if (active < 0) { showToast('先点左边一个中文术语'); return; }
            var ri = parseInt(btn.dataset.i, 10);
            var lb = null;
            leftBtns.forEach(function (b) { if (parseInt(b.dataset.i, 10) === active) lb = b; });

            if (ri === active) {
              btn.classList.add('is-done');
              if (lb) { lb.classList.add('is-done'); lb.classList.remove('is-active'); }
              active = -1;
              done++;
              sfxGood();
              if (done === step.pairs.length) {
                session.check = function () {
                  return { ok: true, title: '全部配对成功！', detail: step.explain };
                };
                runCheck(session.check());
              }
            } else {
              btn.classList.add('is-bad');
              if (lb) lb.classList.add('is-bad');
              setTimeout(function () {
                btn.classList.remove('is-bad');
                if (lb) lb.classList.remove('is-bad');
              }, 430);
              recordMistake(step.pid);
              loseHeart();
              sfxBad();
              if (session.hearts <= 0) {
                session.checked = true;
                session.total++;
                showFeedback({ ok: false, title: '❤️ 用完了', detail: '配对错得有点多。记住这几组中英文，再来一次会快很多。' });
                var mb = $('#mainBtn');
                if (mb) { mb.disabled = false; mb.textContent = '继续'; }
                leftBtns.forEach(function (b) { b.disabled = true; });
                rightBtns.forEach(function (b) { b.disabled = true; });
              }
            }
          });
        });
      }
    };
  }

  /* ================= 结算 ================= */

  function finishLesson() {
    if (!session) return;
    var s = session;
    var acc = s.total ? s.correct / s.total : 1;
    var xp = Math.min(30, 10 + s.correct + (acc === 1 ? 5 : 0));
    var rec = lessonRec(s.id);
    rec.plays = (rec.plays || 0) + 1;
    rec.best = Math.max(rec.best || 0, Math.round(acc * 100));
    rec.level = Math.min(3, (rec.level || 0) + 1);
    S.lessons[s.id] = rec;

    S.xp += xp;
    S.dayXp += xp;
    var t = todayStr();
    if (S.lastDay !== t) {
      S.streak = S.lastDay === yesterdayStr() ? S.streak + 1 : 1;
      S.lastDay = t;
    }
    if (s.id === '__review' && acc >= 0.8) {
      s.patternIds.forEach(function (id) { delete S.mistakes[id]; });
    }
    save();
    updateChips();
    sfxComplete();
    confetti();

    var title = lessonMeta(s.id).title;
    var accPct = Math.round(acc * 100);
    var medal = acc === 1 ? '🏆' : '🎉';
    var html = '<div class="result">' +
      '<div class="medal">' + medal + '</div>' +
      '<h2>' + (acc === 1 ? '完美通关！' : '这一课完成了！') + '</h2>' +
      '<p>' + title + ' · 正确率 ' + accPct + '%</p>' +
      '<div class="result-stats">' +
      '<div class="result-stat gold"><b>+' + xp + '</b><span>XP</span></div>' +
      '<div class="result-stat green"><b>' + s.correct + '/' + s.total + '</b><span>答对</span></div>' +
      '<div class="result-stat"><b>' + accPct + '%</b><span>正确率</span></div>' +
      '</div>' +
      '<div class="result-actions">' +
      '<button class="btn btn-primary" id="resContinue">继续</button>' +
      '<button class="btn btn-ghost" id="resAgain">再练一次</button>' +
      '<button class="btn btn-ghost" id="resLib">去图鉴看看</button>' +
      '</div></div>';

    var from = s.from;
    var lessonId = s.id;
    view.innerHTML = html;
    document.body.classList.add('in-lesson');

    $('#resContinue').addEventListener('click', function () {
      session = null;
      document.body.classList.remove('in-lesson');
      if (from) { route.tab = from.tab; route.detail = from.detail; }
      updateTabs();
      render();
      window.scrollTo(0, 0);
    });
    $('#resAgain').addEventListener('click', function () {
      startLesson(lessonId, from);
    });
    $('#resLib').addEventListener('click', function () { go('library'); });
  }

  function failScreen() {
    if (!session) return;
    var id = session.id;
    var from = session.from;
    document.body.classList.add('in-lesson');
    view.innerHTML = '<div class="result">' +
      '<div class="medal">🫠</div>' +
      '<h2>体力用完了</h2>' +
      '<p>这一课先到这儿。错的地方，正是要练的地方。</p>' +
      '<div class="result-actions" style="margin-top:26px">' +
      '<button class="btn btn-primary" id="retryLesson">再来一次</button>' +
      '<button class="btn btn-ghost" id="quitLesson">先退出</button>' +
      '</div></div>';
    $('#retryLesson').addEventListener('click', function () { startLesson(id, from); });
    $('#quitLesson').addEventListener('click', function () { exitLesson(); });
  }

  /* ================= 初始化 ================= */

  Chart.setPalette(S.settings.palette || 'cn');
  updateTabs();
  render();

  $$('.tab').forEach(function (b) {
    b.addEventListener('click', function () {
      if (session) { if (!window.confirm('退出当前这一课？进度不会保存。')) return; }
      go(b.dataset.tab);
    });
  });

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      $$('canvas[data-chart]').forEach(function (cv) { Chart.redraw(cv); });
    }, 160);
  });

  document.addEventListener('keydown', function (e) {
    if (!session || session.teachMode) {
      if (e.key === 'Enter' && session && session.teachMode) { nextStep(); }
      return;
    }
    if (e.key >= '1' && e.key <= '4') {
      var idx = parseInt(e.key, 10) - 1;
      var btns = $$('.option, .pick');
      if (btns[idx] && !btns[idx].disabled) btns[idx].click();
    }
    if (e.key === 'Enter') {
      var mb = document.getElementById('mainBtn');
      if (mb && !mb.disabled) mb.click();
    }
  });
})();
