---
title: 基于 Python + 第三方自动化工具，为 Instapaper 开发一键翻译功能
author: XDash
type: post
date: 2020-08-27T09:23:37+00:00
url: /diy-translate-feature-for-instapaper.html
categories:
  - Geeky
tags:
  - geek
  - Instapaper
  - Python

---
我将 Inoreader 作为日常信息过滤的管道，经其筛选后的待读文章流到 Instapaper。

因有阅读国外文献的需求，考察下来认为现有的解决方案（iOS 系统捷径 / 翻译类 APP / 通过 Chromium 内核浏览器打开用彩云小译插件等 ），既不方便，也不原生，更不灵活。所以决定自己简单定制开发。

一个晚上实现。工具准备：Python + IFTTT + Google Drive。

以下是思路：

1、在 Instapaper 专门新建文件夹「To Translate」。

2、日常阅读时，将想翻译的英文文章，随手移到「To Translate」。

3、在 IFTTT 设置一个新的 Applet：IF 我的 Instapaper 的「To Translate」文件夹下新增文章，THEN 将这篇文章上传到我的 Google Drive 的指定文件夹「Translate Slave/」下。

4、这个 Google Drive 的 「Translate Slave/」文件夹同步到 Mac 本地。

5、Mac 本地跑一个 Python 脚本，不断轮询上述「Translate Slave/」文件夹，一旦发现新增的文章（会是 html 格式的网页），则开始执行我的整套翻译动作，如：

  * 基于 goose3 获取这个网页的正文内容
  * 基于 deepL 完成翻译
  * 其它任何我想实现的效果，例如对照翻译、生成摘要、生成 Tags 等

6、 将上述翻译结果，通过 Python 发送电子邮件到我的 Instapaper 邮箱（一个 小众 feature，收到符合格式的邮件，会自动添加到 Instapaper 待读列表）。

于是，当我在浏览待读列表时，只需要将想翻译的文章，丢到「To Translate」，稍待一会儿，它的翻译版，就将出现在待读列表的顶部了。

配合 Instapaper 的中文朗读功能，简直不要太赞。