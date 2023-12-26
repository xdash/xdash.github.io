---
title: 一个 SocialTV demo
author: XDash
type: post
date: 2011-11-01T09:53:52+00:00
url: /socialtv-demo.html
views:
  - 1405
categories:
  - Coding
  - Work++
tags:
  - socialtv
  - 代码
  - 作品

---
LBS 的 Check-in 概念逐渐开始烂大街，作为一个 TV potato + Mobile addicted + 分享爱好者，很自然想到将正在看的电视节目通过“签到”方式转发到微博，分享给朋友们，也即是所谓的SocialTV。实际上，此种模式国内外已有类似尝试（这两天  Techcrunch Disrupt 2011 上也有这么一家<a href="http://tech.163.com/11/1101/09/7HP0QMM1000938EN_9.html" target="_blank">渔玩</a>，不过专家们似乎普遍对市场前景不太看好）。

前两周用周末时间，使用 PHP + Sina App Engine + 微博开放平台做了个网页版的 SocialTV。主要功能就是通过连接微博账号，选择当前频道，系统自动给出当前时间档在播的节目，并可发布一则微博。目前仅是功能演示版，没有任何界面可言（不过针对 iPhone 屏幕还是做了个仿原生的 CSS 效果）。

试玩地址：<a href="http://socialtv.sinaapp.com" target="_blank">http://socialtv.sinaapp.com</a>

目前提供的频道除 CCTV 系外，都是我常看的各种地方卫视台。节目信息是从国内某电视节目预告网站抓取来的，做得比较粗略，可能偶尔有时候有部分节目读不出来，显示空白，还需优化。

原本打算再完善下放出来让大家玩的，现在看来工作繁忙，怕是没时间慢慢调整了，就先把功能演示 demo 丢出来了。代码比较简单，有兴趣的我可以分享出来或者丢到 Google Code 上。

顺便说一句，SAE 和微博开放平台提供的官方帮助和演示代码，真 TMD 渣。