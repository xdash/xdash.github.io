---
title: 从 WordPress 迁移到 Github Pages
author: XDash
type: post
date: 2023-12-26T15:21:55+00:00
url: /from-WordPress-to-Github-Pages.html
categories:
  - Diary
tags:
  - 写作
  - 创作

---
当前独立 Blog 方案：
- 从老的 WordPress 迁移出历史数据，文本和页面均导出 Markdown，但暂时考虑放弃恢复历史图片（反正时效性强 / 有黑历史 / 可能有如今不想呈现的隐私）。
- 本地 Markdown 草稿 + Hugo 渲染 + Github Actions 自动发布到 Github Pages。
- 后续将慢慢手动搬迁近两年发布在各种渠道的内容，到独立 Blog。

为何搬迁：

- 从「椒盐豆豉」这篇博文获得启发：https://blog.douchi.space/static-blog-half-year/#gsc.tab=0
- 遵循「Setup and Forget」原则，希望在博客这件事上减少折腾，提升动力。避免每年空间续费、时不时被动迁移 IP、需要打开浏览器写誊写博文等麻烦；以后可在任意设备 Markdown 写 + Git 提交 + Github Actions 完成 hugo 渲染生成。
- 静态，既加速读者访问，也让我自己不要动辄去想装插件、widget 的花活了。
- Github backed by Microsoft，稳定可靠。
- 简单，专注在输出，尤其是输出文字之美本身。
- 本地 repo 的草稿，可以直接在 Obsidian 方便地编辑；Obsidian 又是买了 Sync 同步的。所以可以移动状态下随时写，回到电脑前整理妥帖再 commit 发布。
- 没有阅读计数，不被商业裹挟，写自己想写的文，交自己想交的人。
- 部分回归初心，重拾 Geek 人格。

迁移期间参照过的资料 & 资源：

- WordPress 转换成 Hugo 格式：WordPress-to-Hugo-Exporter 插件 https://github.com/SchumacherFM/wordpress-to-hugo-exporter （ChatGPT4 告诉我的）
- Hugo Quick Start: https://gohugo.io/getting-started/quick-start/
- 当前选择的主题： https://themes.gohugo.io/themes/hugo-theme-hello-friend-ng/
- 所有官方主题库： https://themes.gohugo.io/