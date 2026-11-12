/* 宝宝键盘乐园 · 共享运行时
   约定：零依赖、零外链，所有游戏 <script src="../common.js"></script> 后使用 window.Kid
   - 音频：首次按键（用户手势）解锁 AudioContext，所有声音经压缩器限幅，防爆音
   - 静音：localStorage kids_muted，静音同时停语音
   - 小名：localStorage kids_typing_name（大厅家长设置可改）
   - 按钮：mountChrome() 注入「回家」与静音，各游戏不再自己写 */
window.Kid = (function () {
  var NAME_KEY = 'kids_typing_name';
  var MUTE_KEY = 'kids_muted';
  var DEFAULT_NAME = '辉哥';
  var PRAISE = ['太棒了', '真棒', '好厉害', '你真聪明', '好棒呀', '哇塞'];

  var ctx = null, master = null, muted = false;
  try { muted = localStorage.getItem(MUTE_KEY) === '1'; } catch (e) {}

  function audio() {
    if (ctx) { if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} } return ctx; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch (e) { return null; }
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.knee.value = 24;
    comp.ratio.value = 8;
    comp.attack.value = 0.003;
    comp.release.value = 0.25;
    master = ctx.createGain();
    master.gain.value = 0.85;
    master.connect(comp);
    comp.connect(ctx.destination);
    return ctx;
  }

  function out() { return audio() ? master : null; }

  // 一个音：freq 起频，opts.to 滑到的频率，opts.vol 峰值（默认 .22），opts.delay 秒
  function tone(freq, dur, opts) {
    if (muted) return;
    var c = audio(); if (!c) return;
    opts = opts || {};
    var t = c.currentTime + (opts.delay || 0);
    var o = c.createOscillator(), g = c.createGain();
    o.type = opts.type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    if (opts.to) o.frequency.exponentialRampToValueAtTime(Math.max(20, opts.to), t + dur);
    var v = Math.min(opts.vol || 0.22, 0.4);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + (opts.attack || 0.008));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(out());
    o.start(t); o.stop(t + dur + 0.05);
  }

  // 噪声（爆破/风声/沙锤）：opts.filter 'highpass'|'lowpass'，opts.freq 截止频率
  function noise(dur, opts) {
    if (muted) return;
    var c = audio(); if (!c) return;
    opts = opts || {};
    var t = c.currentTime + (opts.delay || 0);
    var len = Math.max(1, Math.floor(c.sampleRate * dur));
    var buf = c.createBuffer(1, len, c.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, opts.decay || 2);
    var s = c.createBufferSource(); s.buffer = buf;
    var f = c.createBiquadFilter();
    f.type = opts.filter || 'lowpass';
    f.frequency.setValueAtTime(opts.freq || 1800, t);
    if (opts.to) f.frequency.exponentialRampToValueAtTime(Math.max(60, opts.to), t + dur);
    var g = c.createGain();
    g.gain.setValueAtTime(Math.min(opts.vol || 0.3, 0.45), t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f); f.connect(g); g.connect(out());
    s.start(t); s.stop(t + dur + 0.02);
  }

  function speak(text, opts) {
    if (muted) return;
    try {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = (opts && opts.rate) || 0.8;
      u.pitch = (opts && opts.pitch) || 1.25;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  function name() {
    try { return localStorage.getItem(NAME_KEY) || DEFAULT_NAME; } catch (e) { return DEFAULT_NAME; }
  }
  function setName(n) {
    try { localStorage.setItem(NAME_KEY, n || DEFAULT_NAME); } catch (e) {}
  }
  function praise() { return PRAISE[Math.floor(Math.random() * PRAISE.length)]; }

  function isMuted() { return muted; }
  function setMuted(v) {
    muted = !!v;
    try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch (e) {}
    if (muted) { try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {} }
    else { audio(); }
    return muted;
  }

  // 顶部条：回家 + 静音（+ 可选额外按钮），不动 body 其他布局
  function mountChrome(extra) {
    var hud = document.createElement('div');
    hud.className = 'hud';
    var home = document.createElement('button');
    home.className = 'btn';
    home.textContent = '\uD83C\uDFE0 \u56DE\u5BB6';
    home.onclick = function () { location.href = '../'; };
    var mute = document.createElement('button');
    mute.className = 'btn';
    mute.style.marginLeft = 'auto';
    function paint() { mute.textContent = muted ? '\uD83D\uDD07 \u5B89\u9759' : '\uD83D\uDD0A \u58F0\u97F3'; }
    paint();
    mute.onclick = function () { setMuted(!muted); paint(); };
    hud.appendChild(home);
    hud.appendChild(mute);
    (extra || []).forEach(function (b) {
      var btn = document.createElement('button');
      btn.className = 'btn';
      btn.textContent = b.label;
      btn.onclick = b.onClick;
      hud.appendChild(btn);
    });
    document.body.appendChild(hud);
    return { hud: hud, home: home, mute: mute };
  }

  // 键盘几何：把按键映射到屏幕上的归一化坐标，让「哪个键 → 屏幕上哪个位置」有直觉
  var GEOM = {};
  (function () {
    var rows = [
      ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal'],
      ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight'],
      ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote'],
      ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash']
    ];
    for (var r = 0; r < rows.length; r++) {
      for (var i = 0; i < rows[r].length; i++) {
        GEOM[rows[r][i]] = { x: (i + 0.5 + r * 0.35) / (rows[r].length + 1), y: r / 3 };
      }
    }
    GEOM.Space = { x: 0.5, y: 1.05 };
    GEOM.ArrowLeft = { x: 0.28, y: 1.15 };
    GEOM.ArrowDown = { x: 0.42, y: 1.15 };
    GEOM.ArrowUp = { x: 0.56, y: 1.15 };
    GEOM.ArrowRight = { x: 0.7, y: 1.15 };
  })();

  function keyPos(e, fallback) {
    var g = GEOM[e.code];
    var r = Math.random;
    if (!g) return { x: 0.12 + r() * 0.76, y: 0.2 + r() * 0.6 };
    return { x: Math.min(0.98, Math.max(0.02, g.x + (r() - 0.5) * 0.05)), y: Math.min(1, Math.max(0, g.y)) };
  }

  // 统一按键入口：过滤组合键、可选忽略长按重复、可选限速（防宝宝连拍把画布打爆）
  function onKey(handler, opts) {
    opts = opts || {};
    var last = 0;
    var fn = function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (opts.allowRepeat === false && e.repeat) return;
      var now = performance.now();
      if (opts.throttle && now - last < opts.throttle) return;
      last = now;
      if (opts.preventDefault !== false) e.preventDefault();
      handler(e);
    };
    window.addEventListener('keydown', fn);
    return fn;
  }

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  // 撒花：在容器里生成一批彩色纸屑（DOM），自动清理
  function confetti(container, count, origin) {
    count = count || 26;
    var ox = origin && origin.x != null ? origin.x : 50;
    var oy = origin && origin.y != null ? origin.y : 40;
    var COLORS = ['#ff6b6b', '#ffb45e', '#ffe14d', '#8be58b', '#6fc3ff', '#c98bff', '#ff9ad5'];
    for (var i = 0; i < count; i++) {
      var p = el('i', 'k-confetti');
      p.style.background = pick(COLORS);
      p.style.left = ox + (Math.random() * 20 - 10) + '%';
      p.style.top = oy + '%';
      p.style.setProperty('--dx', (Math.random() * 2 - 1) * 46 + 'vw');
      p.style.setProperty('--dy', (30 + Math.random() * 55) + 'vh');
      p.style.setProperty('--rot', (Math.random() * 900 - 450) + 'deg');
      p.style.setProperty('--dur', (0.9 + Math.random() * 0.9) + 's');
      container.appendChild(p);
      (function (node) {
        setTimeout(function () { node.parentNode && node.parentNode.removeChild(node); }, 2000);
      })(p);
    }
  }

  // 撒花的样式与动画集中注入，游戏文件里不用重复写
  var style = document.createElement('style');
  style.textContent =
    '.k-confetti{position:fixed;width:10px;height:14px;border-radius:3px;z-index:80;pointer-events:none;' +
    'animation:kConfetti var(--dur,1.2s) cubic-bezier(.2,.6,.4,1) forwards}' +
    '@keyframes kConfetti{0%{transform:translate(0,0) rotate(0);opacity:1}' +
    '100%{transform:translate(var(--dx),var(--dy)) rotate(var(--rot));opacity:0}}';
  document.head.appendChild(style);

  return {
    audio: audio, tone: tone, noise: noise, speak: speak,
    name: name, setName: setName, praise: praise,
    isMuted: isMuted, setMuted: setMuted,
    mountChrome: mountChrome, onKey: onKey, keyPos: keyPos,
    bus: out,
    rand: rand, pick: pick, clamp: clamp, el: el, confetti: confetti,
    PRAISE: PRAISE
  };
})();
