---
title: 写了个艾宾浩斯遗忘曲线记单词 on Sina App Engine
author: XDash
type: post
date: 2011-02-26T12:45:26+00:00
url: /ebbinghaus-sae-app.html
views:
  - 3633
wiziapp_processed:
  - 1
categories:
  - Product
  - Work++
tags:
  - App
  - Develop
  - SAE
  - Work++

---
为了充分利用看电影和玩游戏的尿点潜移默化背单词，写了这个简单的小工具，运行在 Sina App Engine 上。可用新浪微博账号登录，走的是 OAuth 验证通道，因此除我之外其它感兴趣（且不嫌弃）的朋友也能放心使用。暂名 Memorize。

<p style="text-align: center;">
  <a href="http://www.fanbing.net/wp-content/uploads/2011/02/2011-02-26_201151.png"><img loading="lazy" decoding="async" class="size-full wp-image-4871 alignnone" title="2011-02-26_201151" src="http://www.fanbing.net/wp-content/uploads/2011/02/2011-02-26_201151.png" alt="" width="328" height="334" srcset="http://xdash.one/wp-content/uploads/2011/02/2011-02-26_201151.png 520w, http://xdash.one/wp-content/uploads/2011/02/2011-02-26_201151-392x400.png 392w" sizes="(max-width: 328px) 100vw, 328px" /></a>
</p>

**工具地址：**<a href="http://memorize.sinaapp.com/" target="_blank">http://memorize.sinaapp.com/</a>

**基本原理：**

  * 根据<a href="http://baike.baidu.com/view/931396.htm" target="_blank">艾宾浩斯遗忘曲线</a>原理，显示当天用户应当复习的单词列表。
  * 目前的设定是在（首次添加单词后的）第 1、2、4、7、15、30、90、180 天复习。经过八轮滚动，让短期记忆固化为长期记忆。
  * 至于遵循艾宾浩斯遗忘曲线是否真能提高记忆效率，此前我也未尝试，恰好借此工具验证。

<!--more-->

**使用方法：**

1、使用微博账号登录，OAuth 授权：

<p style="text-align: center;">
  <a href="http://www.fanbing.net/wp-content/uploads/2011/02/2011-02-26_202252.png"><img loading="lazy" decoding="async" class="size-full wp-image-4880 alignnone" title="2011-02-26_202252" src="http://www.fanbing.net/wp-content/uploads/2011/02/2011-02-26_202252.png" alt="" width="365" height="114" srcset="http://xdash.one/wp-content/uploads/2011/02/2011-02-26_202252.png 521w, http://xdash.one/wp-content/uploads/2011/02/2011-02-26_202252-500x156.png 500w" sizes="(max-width: 365px) 100vw, 365px" /></a>
</p>

<p style="text-align: left;">
  2、点击右上角的 “+ Add Items” 链接添加单词（Item）和说明（Description），一次最多五个。其实除了单词，其它需要记忆的短词条（专业术语、公式等）也适用此工具。
</p>

<p style="text-align: center;">
  <a href="http://www.fanbing.net/wp-content/uploads/2011/02/2011-02-26_202625.png"><img loading="lazy" decoding="async" class="size-full wp-image-4881 alignnone" title="2011-02-26_202625" src="http://www.fanbing.net/wp-content/uploads/2011/02/2011-02-26_202625.png" alt="" width="365" height="450" srcset="http://xdash.one/wp-content/uploads/2011/02/2011-02-26_202625.png 521w, http://xdash.one/wp-content/uploads/2011/02/2011-02-26_202625-324x400.png 324w" sizes="(max-width: 365px) 100vw, 365px" /></a>
</p>

<p style="text-align: left;">
  3、然后首页显示的就是当日计划中应当复习的词条（如最上方的那张图）。没有加翻页，一屏呈现。
</p>

<p style="text-align: left;">
  <strong>其它说明：</strong>
</p>

  * 网上现成的艾宾浩斯工具，多是桌面程序或Excel表格形式，个别在线应用广告多、注册烦、体验差。索性自己写了。今后想怎么扩展就怎么扩展。
  * 页面 UI 直接抄袭了 ReadItLaterList.com 的 CSS，够简洁。我 Ctrl+C/V 我自豪。
  * 本来已经写好的同步到微博模块，因为周末官方更新API，暂时不可用。不过这个功能除了打扰外，真的重要吗？索性撤掉了。
  * 不管技术支持，只管自己好用。
  * 感谢 @Lightory、@StevenWang 等童鞋的帮助。