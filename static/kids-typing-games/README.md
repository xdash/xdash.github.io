# 宝宝键盘乐园 · kids-typing-games

给 3 岁宝宝玩的键盘小游戏集合。每个游戏是独立单页 HTML，共享 `style.css` 与 `common.js`，零依赖、零外链、零构建，`static/` 原样发布到 GitHub Pages。

线上：https://xdash.me/kids-typing-games/

## 游戏一览

| 目录 | 游戏 | 玩法 |
| --- | --- | --- |
| `letter-balloons/` | 🎈 字母气球 | 按气球上字母，戳破 |
| `number-bubbles/` | 🔢 数字积木 | 按积木上数字，戳破 |
| `keyboard-piano/` | 🎹 键盘小钢琴 | 按键弹音符 |
| `letter-train/` | 🚂 字母小火车 | 按提示字母挂车厢 |
| `space-typing/` | 🕷️ 蜘蛛小英雄 | 按星星字母发射蛛丝 |
| `fireworks/` | 🎆 键盘烟花秀 | 任意键放一朵烟花 |
| `block-tower/` | 🏗️ 积木高楼 | 任意键叠一层，满 12 层倒塌 |
| `blow-candles/` | 🕯️ 吹蜡烛 | 按住键吹灭三根蜡烛 |
| `peekaboo-windows/` | 🐣 躲猫猫小窗户 | 任意键开一扇窗，动物探出头 |
| `feed-bear/` | 🐻 喂小熊吃饭 | 任意键喂一口，十口吃饱 |
| `bubble-wrap/` | 🫧 泡泡纸 | 任意键戳泡泡 |
| `car-ride/` | 🚗 小车兜风 | 按住键开车，松手滑行 |
| `key-paint/` | 🌈 键盘画笔 | 任意键画一笔，可存 PNG |
| `animal-call/` | 🐘 动物点名 | A-Z 认识 26 只动物 |
| `drum-kit/` | 🥁 小鼓手 | 键盘分四区当鼓，带节拍 |

## 共享运行时 `common.js`

只在 `2026-11-12` 之后新增的游戏使用；老 5 个游戏仍各自内联音频代码，未改动。

```html
<script src="../common.js"></script>
```

- `Kid.onKey(fn, { throttle, allowRepeat })`：统一按键入口，过滤 Cmd/Ctrl/Alt、可选忽略长按重复、可选限速
- `Kid.tone(freq, dur, opts)` / `Kid.noise(dur, opts)`：WebAudio 合成；首次按键（用户手势）解锁，全部经压缩器限幅，防爆音
- `Kid.speak(text)`：中文语音；静音时一并停用
- `Kid.keyPos(e)`：按键 → 归一化屏幕坐标（键盘四行映射），让「按哪儿、屏幕哪儿有反应」有直觉
- `Kid.mountChrome(extra)`：注入「🏠 回家」与「🔊/🔇」；`extra` 传 `[{label, onClick}]` 追加按钮
- `Kid.name()` / `Kid.praise()` / `Kid.confetti()`：小名、随机夸奖、撒花
- localStorage：`kids_typing_name`（小名，大厅家长设置可改）、`kids_muted`（静音）

## 新增游戏约定

1. 建 `<slug>/index.html`，`<link rel="stylesheet" href="../style.css">` + `<script src="../common.js">`
2. 第一行先 `Kid.mountChrome()`，按钮不用自己写
3. 任何键都要有反应（含数字键、空格、方向键）；不做失败态、不做倒计时、不需要「开始」按钮
4. 物理/动画按真实时间积分（`dt`），不按帧数，慢设备上才不会变成慢动作
5. 在大厅 `index.html` 里加一张 `.card`，写完用本地服务在 iPad 上试

## 本地预览

```bash
cd Sites/xdash-blog
python3 -m http.server 8000 --directory static
# http://localhost:8000/kids-typing-games/
```
