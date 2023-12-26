---
title: IT菜鸟魔都育成计划（五）：BUG的一生
author: XDash
type: post
date: 2010-07-08T17:59:59+00:00
url: /growing-in-shanghai-5.html
views:
  - 1611
categories:
  - // .Network
  - Diary
  - Product
tags:
  - BUG
  - IT菜鸟魔都育成计划
  - SNDA
  - 日记

---
最近在做产品BUG的测试。BUG者，程序漏洞是也。测试BUG是一项集天马行空与严谨细致两个极端于一身的工作，与广告行业颇有几分相似。

在这样一个多人协作的团队里，测试BUG需要依靠健全的管理流程。除了商议、沟通外，一个重要的依托平台是PMS（Project Management System，项目管理系统）。这个透露一下没关系，我们团队使用的PMS是免费开源软件<a href="http://www.zentaoms.com/" target="_blank">禅道（ZenTaoPMS）</a>，PHP+MySQL，<a href="http://demo.zentaoms.com/" target="_blank">这里</a>可以在线体验该软件DEMO。

“BUG的一生”这个说法，很明显来自英文，放在英文语境下生动有趣，而这样的中英混杂之后，则显得不伦不类，因此我更倾向于将其翻译为“BUG的生命周期”。

在团队写作中，BUG的生命周期，大致就是从被发现，到被确认或否认，再到修改或放弃，最终验证通过，close掉的过程。具体状态流转，在<a href="http://book.douban.com/subject/4723970/" target="_blank">《人人都是产品经理》</a>的148页有一张流程图，与我们在 ZenTaoPMS 中进行的过程完全一致。这也体现项目管理的标准化。

[<img loading="lazy" decoding="async" class="alignnone size-full wp-image-4064" style="border: 2px solid #eee;" title="bug statue" src="http://www.fanbing.net/wp-content/uploads/2010/07/medium.jpg" alt="" width="441" height="494" srcset="http://xdash.one/wp-content/uploads/2010/07/medium.jpg 441w, http://xdash.one/wp-content/uploads/2010/07/medium-357x400.jpg 357w" sizes="(max-width: 441px) 100vw, 441px" />][1]

（BUG状态流转图。图片来源：本书作者<a href="http://iamsujie.com/9000/9085/" target="_blank">苏杰的博客</a>）

<!--more-->关于BUG级别定义标准，原本想手工输入，发现作者博客依然有现成表格，故转贴于此，作为日常工作的参照。希望今后除虫时，能将精力花在重要级高的问题上，而将鸡毛蒜皮的问题，权重调低。

[<img loading="lazy" decoding="async" class="alignnone size-full wp-image-4065" title="BUG级别定义标准" src="http://www.fanbing.net/wp-content/uploads/2010/07/4039067925_4b14225c92_o.png" alt="" width="498" height="342" srcset="http://xdash.one/wp-content/uploads/2010/07/4039067925_4b14225c92_o.png 623w, http://xdash.one/wp-content/uploads/2010/07/4039067925_4b14225c92_o-500x343.png 500w" sizes="(max-width: 498px) 100vw, 498px" />][2]

（BUG级别定义标准，点击放大。同样来自<a href="http://iamsujie.com/3000/3015/" target="_blank">苏杰的博客</a>）

两天抓了近20个虫，最基本的和表现层的都差不多查验过。接下来就要深入底层、逻辑层，速度可能会放缓下来。抓虫的过程是艰辛甚至恶心的。最后产品能通过亿万用户的考验，是此刻不竭的驱动力。希望到时候能呈现相对完美的作品。

前两天看了一篇讲如何做产品测试的文章，说，如果你要测试一款搜索引擎产品，那么就需要不断地进行搜索，至少测试200个关键词。看来，这还是个体力活。

 [1]: http://www.fanbing.net/wp-content/uploads/2010/07/medium.jpg
 [2]: http://www.fanbing.net/wp-content/uploads/2010/07/4039067925_4b14225c92_o.png