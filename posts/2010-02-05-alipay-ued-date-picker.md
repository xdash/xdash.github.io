---
title: 从时间拾取的细节看支付宝的用户体验设计
author: XDash
type: post
date: 2010-02-05T07:18:05+00:00
draft: true
url: /?p=2683
views:
  - 319
categories:
  - UED / CSS+DIV
tags:
  - alipay
  - ue
  - ued
  - 支付宝
  - 用户体验
  - 阿里巴巴

---
马云前脚刚在支付宝年会上痛批支付宝的用户体验 <a href="http://uicom.net/blog/?p=861" target="_blank">“烂，太烂，烂到极点”</a> ，后脚这支付宝就得了 <a href="http://www.williamlong.info/archives/2075.html" target="_blank">“谁是我们的‘零零壹——2009开放式网络评选”</a> 活动的 “最佳用户体验中文网站或应用” 奖第三名（坐镇前列的是谷歌和搜狗拼音输入法）。

我是一介穷书生，平时不必从事大宗进出口交易，也不开网店频繁接触电子支付，只是偶尔在当当上买书，在淘宝上搜古怪玩意儿，因此对支付宝并没有非常深入的应用和研究。但即便是偶尔的惊鸿几瞥，还是对支付宝的用户体验有话要说。

暂不论繁琐的证书安装、Tab键响应顺序这些问题。仅以前两天查询对账单明细举例。系统将我引导到这样一个选择查询时间段的页面：

[<img loading="lazy" decoding="async" class="alignnone size-full wp-image-2688" title="2010-02-05_143408" src="http://www.fanbing.net/wp-content/uploads/2010/02/2010-02-05_143408.png" alt="2010-02-05_143408" width="500" height="252" srcset="http://xdash.one/wp-content/uploads/2010/02/2010-02-05_143408.png 500w, http://xdash.one/wp-content/uploads/2010/02/2010-02-05_143408-300x151.png 300w" sizes="(max-width: 500px) 100vw, 500px" />][1]

**这个设计的麻烦之处在于：**

  * 需要用户将头脑中符合中文语言习惯的日期时间格式转化成一堆阿拉伯数字，并且还要考虑哪里该补入占位符“0”。
  * 我对日期并不敏感，甚至不知道今天几号，而我想查询的起始点是“上周三”而不是具体日期。
  * 我不确定在某个日期里我是否进行过交易，能否给我个提示？
  * 我输入的格式是否符合系统要求？会不会因为全角半角、空格、错输等原因影响继续操作？
  * 我讨厌输入，请让我继续用鼠标操作。
  * ETC

可以肯定的是，这样的设计方便了系统从数据库中读取匹配的数据，但**这是以数据库为中心的设计，而非以用户为中心**。体验上自然打了折扣。

<!--more-->

相比之下，同一天内我使用了 Google Adwords 设置投放广告的日期。GA给我的用户界面是这样的：

[<img loading="lazy" decoding="async" class="alignnone size-full wp-image-2693" title="2010-02-05_150359" src="http://www.fanbing.net/wp-content/uploads/2010/02/2010-02-05_150359.png" alt="2010-02-05_150359" width="343" height="286" srcset="http://xdash.one/wp-content/uploads/2010/02/2010-02-05_150359.png 343w, http://xdash.one/wp-content/uploads/2010/02/2010-02-05_150359-300x250.png 300w" sizes="(max-width: 343px) 100vw, 343px" />][2]

它采用了 Date-Picker 控件的形式，让我可以简单地通过鼠标点击选定日期，且对应了每日星期几。（顺便说一句，能不能像 WordPress 的 Calendar 这个 Widget 一样，在有重要操作的时期——比如发布日志——上加粗日期显示？）

再进一步，看看 Google Analytics 的时间拾取形式：

[<img loading="lazy" decoding="async" class="alignnone size-full wp-image-2695" title="2010-02-05_150750" src="http://www.fanbing.net/wp-content/uploads/2010/02/2010-02-05_150750.png" alt="2010-02-05_150750" width="463" height="200" srcset="http://xdash.one/wp-content/uploads/2010/02/2010-02-05_150750.png 643w, http://xdash.one/wp-content/uploads/2010/02/2010-02-05_150750-300x129.png 300w" sizes="(max-width: 463px) 100vw, 463px" />][3]

采用Flash设计，更加复杂，支持**“专家模式”**，可以点选时间段、切换到时间轴视图、与过往同期数据进行对比等。在提供基础功能（选择时间）的同时，加入了数据的对比、统计图功能。

这样的复杂的设计符合 Google Analytics 用户对数据分析、比对的需求，因此不但没有加重用户的认知负担，反倒让用户觉得贴心顺手。同样的复杂应用如果被加入Alipay的对账单查看，或许能帮助一部分有高级需求的用户，但对绝大多数用户而言，或许只会觉得更难上手。他们更需要的是 Google Adwords 的形式。

**综上所述：**

  * 以用户为中心，就是要尽可能摈弃“迁就机器”的设计，而从用户实际需要和操作方便出发，简化用户认知和操作。
  * 简单的设计不一定好，但好的设计要求尽可能简单，用减法来做设计。
  * 不同的用户群对同一设计有不同需要，或简单，或复杂，关键在于准确定位你的用户。
  * 马云说支付宝体验烂不是没有道理的。

 [1]: http://www.fanbing.net/wp-content/uploads/2010/02/2010-02-05_143408.png
 [2]: http://www.fanbing.net/wp-content/uploads/2010/02/2010-02-05_150359.png
 [3]: http://www.fanbing.net/wp-content/uploads/2010/02/2010-02-05_150750.png