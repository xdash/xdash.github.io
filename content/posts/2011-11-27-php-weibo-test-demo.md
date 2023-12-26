---
title: 一个开源的基于PHP/SAE的微博开放平台趣味测试应用DEMO
author: XDash
type: post
date: 2011-11-27T15:03:20+00:00
url: /php-weibo-test-demo.html
views:
  - 1825
wiziapp_processed:
  - 1
categories:
  - Coding
  - Work++
tags:
  - App
  - 下载
  - 代码
  - 作品
  - 免费
  - 奥特曼
  - 开源
  - 微博

---
[<img loading="lazy" decoding="async" class="size-full wp-image-5002 alignnone" title="ultramantest" src="http://www.fanbing.net/wp-content/uploads/2011/11/ultramantest1.jpg" alt="" width="500" height="294" />][1]

似乎毕业以来就没有时间再做拿得出手的个人开发作品，上次的 <a href="http://www.fanbing.net/socialtv-demo.html" target="_blank">Social TV Demo</a> 还停留在丑陋的技术演示程序阶段（尽管如此也帮助我认识了不少看好 Social TV 未来发展方向的朋友和创业团队，呵呵）。最近几周又抽空做了个小玩意儿。其实这个东西简单到完全只需要几个小时就能搞定的，但因为工作实在太忙，所以断断续续始终没能弄好。最后还是在旁听某个无料的分享会的时候顺手给搞定了。

这是一款基于 PHP 语言、Sina App Engine（SAE）部署、连接微博开放平台的趣味测试应用DEMO。最重要的是，它是开源的。也就是说，任何人都可以直接拿来改改（几乎无需修改任何代码，只需要改改测试结果的字段名和替换对应目录下的图片就可以了），就发布一个自己的微博测试。

由于我是日本特摄尤其是奥特曼系列的爱好者，因此测试的名字就是“测测你是哪个奥特曼”，主要玩法就是连接微博账号之后，根据用户昵称判断（用的是 MD5 加密后取头两位）自己对应的奥特曼身份。幼稚也好，脑残也罢，终归是奥迷向从小陪伴成长的英雄们的致敬。

体验地址：<a href="http://ultramantest.sinaapp.com" target="_blank">http://ultramantest.sinaapp.com</a>

<!--more-->做这个的另外两个想法，一是了解熟悉新浪微博开放平台的 OAuth 连接方式和对 API 的初步探索，或将为以后的产品策划服务（我绝对赞同当产品策划需要了解技术一说），二是想测试一下新浪微博这一平台链式反应的传播影响力（于是也在形式上选择了相对讨巧的测试类应用，此类应用在微博上屡见不鲜，且往往好友间传播能力较强）。对于后者，初步的测试结果是，发布后周末两天获得了7000+的用户数量，而这一切是由最初我邀请的20多位种子用户点燃的。

开源代码已经放在 Google Code 上：<a href="http://code.google.com/p/ultramantest-for-weibo/" target="_blank">http://code.google.com/p/ultramantest-for-weibo/</a>

下一篇日志将介绍代码的部署调试方法，涉及一些 SAE 和微博开放平台的基础知识，希望对朋友们有所帮助。

 [1]: http://www.fanbing.net/wp-content/uploads/2011/11/ultramantest1.jpg