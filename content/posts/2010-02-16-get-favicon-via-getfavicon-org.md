---
title: 借助 GetFavicon.org 轻松调用网站 favicon 图标
author: XDash
type: post
date: 2010-02-16T13:56:25+00:00
url: /get-favicon-via-getfavicon-org.html
views:
  - 1579
categories:
  - Coding
tags:
  - favicon
  - PHP
  - tool

---
最近在学习用 PHP 仿照 <a href="http://www.fanbing.net/read-it-later.html" target="_blank">Read It Later</a> 的界面和 <a href="http://delicious.com/xdash" target="_blank">Delicious</a> 的浏览器 bookmark 插件机制，写一个自己的网址收藏工具。期间涉及到一个细微的功能要求：获得被收藏网站的 favicon 图标。

**最直接的方法自然是直接从网站根目录下读取图标**，形如：

<a href="http://www.fanbing.net/favicon.ico" target="_blank">http://www.fanbing.net/favicon.ico</a>

网上流行的另一个 hack 是调用 Google 的网站缓存，这不失为借助外力的一种绝佳途径。

**调用 Google 缓存地址**，形如：

<a href="http://www.google.com/s2/favicons?domain=fanbing.net" target="_blank">http://www.google.com/s2/favicons?domain=fanbing.net</a>

好处是 powered by Google ，保证了调用速度足够快，不影响访客阅读体验。但要求限制也比较严格，不能带http://，只能是根目录。

然而在我的实际代码中，由于被收藏的网址并不一定是网站根目录，且网址可能的展现形式多样（含/不含http或https、含/不含www、是/不是网站根目录、是/不是子目录、是/不是子目录下的具体文件名、是/不是动态生成的地址、是/不是用bit.ly或goo.gl等服务生成的短地址等），因此仅仅基于被收藏网址的URL这一堆字符串，判断和处理起来异常繁琐。

为此我设法搜索到又一个（不完美）解决这一问题的外援， <a href="http://GetFavicon.org" target="_blank">GetFavicon.org</a> 。站如域名，就是用来快速获得某个网站图标的。

<!--more-->

**调用 GetFavicon.org 获得图标**，形如：

<a href="http://www.getfavicon.org/?url=www.fanbing.net/guestbook/favicon.png" target="_blank">http://www.getfavicon.org/?url=www.fanbing.net/guestbook/favicon.png</a>

采用 GetFavicon 最直接的好处就是，无需获得网站根目录地址。任何网站下属页面均可作为参数传入（上面的URL中，就是用我博客的留言本页面举例）。唯一的要求就是 **掐头 （不带http://）+ 加尾 （在传入的URL最后加上 /favicon.png）**。

借助 GetFaicon ，可以轻松实现很多目的，比如为 WordPress 的友情链接们添加上它们各自的图标。更多用法有待发掘。

但用此种方法，目前主要的遗憾是：**速度太慢**。比起 Google 缓存，如果一次批量调用图标过多，GetFavicon 甚至会慢到让你抓狂。好在目前这个书签工具是我自娱自乐自写自用，因此但用无妨。

如果您还知道其他更好用、调用速度更快的方法，欢迎与我分享。

**附：使用 GetFavicon 完成的书签工具初步页面演示**

[<img loading="lazy" decoding="async" class="alignnone size-full wp-image-2830" title="get favicon via GetFaicon.org demo" src="http://www.fanbing.net/wp-content/uploads/2010/02/demo.png" alt="get favicon via GetFaicon.org demo" width="499" height="464" srcset="http://xdash.one/wp-content/uploads/2010/02/demo.png 499w, http://xdash.one/wp-content/uploads/2010/02/demo-300x278.png 300w" sizes="(max-width: 499px) 100vw, 499px" />][1]

 [1]: http://www.fanbing.net/wp-content/uploads/2010/02/demo.png