---
title: 尚译（Someyi Translator），威武
author: XDash
type: post
date: 2010-04-25T08:19:09+00:00
url: /someyi-translator.html
views:
  - 2524
categories:
  - Geeky
  - Study Ability
tags:
  - Chrome
  - 学习
  - 插件
  - 英语

---
我惯用的浏览器是 Google Chrome，一大先天不足在于其采用 Webkit 内核，导致很多现有翻译软件（如金山快译、网易词典）无法完成划词翻译，阅读英文网页尤其麻烦。于是我在Twitter上求助。<a href="http://www.xtit.net/" target="_blank">鲜甜IT</a>博主给我推荐了一款小工具——<a href="http://comsome.com/someyi/" target="_blank">尚译</a>，甚至超出了我的预期。

使用方法很简单，无需安装插件（尽管<a href="http://www.fanbing.net/my-google-chrome-extensions-in-use.html" target="_blank">我也曾让Chrome插件满载</a>，但目前用的是Portable版），直接将以下按钮拖拽到Chrome/Firefox标签栏，或是将代码添加为新的bookmark（代码附于文末）。

<a title="尚译" onclick="alert('请用鼠标右键点击按钮，选择加入书签，或直接拖到书签栏');return false;" href="javascript:void((function(){if(window.Como&&window.Como.someyi){Como.someyi.open()}else{var a=document.createElement('script');a.setAttribute('type','text/javascript');var b=document.charset?document.charset:document.characterSet;var c=b.toLowerCase()=='gb2312'?'pack-gb2312.js':'pack-utf8.js';a.setAttribute('src','http://yi.comsome.com/'+c);document.getElementsByTagName('head').item(0).appendChild(a);Text.prototype.tagName='#text'}})())"><img decoding="async" title="尚译" src="http://comsome.com/someyi/images/demo1.png" alt="尚译" /><br /> </a>

使用时，点击 Chrome 标签栏的尚译翻译按钮，网页中会显示浮动的“译”翻译框。在网页中直接划词，“译”框里就会很快显示出对应的翻译内容。

<!--more-->

**中翻英演示（点击放大）：**

[<img loading="lazy" decoding="async" class="alignnone size-full wp-image-3468" style="border: 2px solid #eeeeee;" title="尚译" src="http://www.fanbing.net/wp-content/uploads/2010/04/2010-04-25_155719.gif" alt="尚译" width="433" height="89" srcset="http://xdash.one/wp-content/uploads/2010/04/2010-04-25_155719.gif 867w, http://xdash.one/wp-content/uploads/2010/04/2010-04-25_155719-500x102.gif 500w" sizes="(max-width: 433px) 100vw, 433px" />][1]

**英翻中演示：**

[<img loading="lazy" decoding="async" class="alignnone size-full wp-image-3472" style="border: 2px solid #eee;" title="尚译" src="http://www.fanbing.net/wp-content/uploads/2010/04/2010-04-25_160512.gif" alt="尚译" width="442" height="200" srcset="http://xdash.one/wp-content/uploads/2010/04/2010-04-25_160512.gif 632w, http://xdash.one/wp-content/uploads/2010/04/2010-04-25_160512-500x226.gif 500w" sizes="(max-width: 442px) 100vw, 442px" />][2]

**优点：**

  * Chrome 中也可无需借助第三方工具，直接完成翻译。平均速度在0.5秒以内。
  * 调用的是 Google Translate API，速度、质量有保障。
  * 支持整句翻译。
  * 翻译框可自由拖动，不用担心挡住网页内容。
  * 可随时暂停翻译（点击翻译框，会变成双竖线的“暂停”按钮状态），免打扰。

这玩意儿忒酷了。

**P.S：**将以下代码添加为新的bookmark：

javascript:void((function(){if(window.Como&&window.Como.someyi){Como.someyi.open()}else{var%20a=document.createElement(&#8216;script&#8217;);a.setAttribute(&#8216;type&#8217;,&#8217;text/javascript&#8217;);var%20b=document.charset?document.charset:document.characterSet;var%20c=b.toLowerCase()==&#8217;gb2312&#8242;?&#8217;pack-gb2312.js&#8217;:&#8217;pack-utf8.js&#8217;;a.setAttribute(&#8216;src&#8217;,&#8217;http://yi.comsome.com/&#8217;+c);document.getElementsByTagName(&#8216;head&#8217;).item(0).appendChild(a);Text.prototype.tagName=&#8217;#text&#8217;}})())

**P.S.2：**友情链接里新增英语学习推荐链接数枚，取用自便。

**P.S.3：**今天<a href="http://www.syncoo.com" target="_blank">同步控</a>更新的一款知识管理工具，我个人非常喜欢，在此顺便推荐。<a href="http://www.syncoo.com/wizknowledge-1988.htm" target="_blank">传送门</a>。

 [1]: http://www.fanbing.net/wp-content/uploads/2010/04/2010-04-25_155719.gif
 [2]: http://www.fanbing.net/wp-content/uploads/2010/04/2010-04-25_160512.gif