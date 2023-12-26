---
title: 解决WordPress评论回复的邮件通知问题
author: XDash
type: post
date: 2009-03-27T09:46:47+00:00
url: /comment-to-email-solved.html
aktt_notify_twitter:
  - no
views:
  - 3228
categories:
  - Blog Media
tags:
  - comment
  - plugin
  - wordpress
  - 回复
  - 插件
  - 评论
  - 邮件

---
前两天发文<a href="http://www.fanbing.net/blog/comment-to-replies-problem.html" target="_blank">《WP使用求助：关于评论回复的邮件通知功能》</a>，就我的WordPress博客**无法正常发送通知邮件**问题，请求大家的应援。经过几天的折腾，今天下午终于在<a href="http://www.dreamix.cn/" target="_blank">Dreamix</a>童鞋的帮助下，成功解决了这个问题。

之前猜测导致此问题的原因，很可能包括：插件安装配置错误/服务器不支持邮件发送/插件冲突/WordPress文件不完整/使用的邮箱不支持或屏蔽邮件/SMTP参数设置错误等。经过一一排查，均无斩获。

为此，Dreamix特别推荐我安装了<a href="http://coffee2code.com/wp-plugins/configure-smtp/" target="_blank"><strong>Configure SMTP</strong></a>这个插件（我曾尝试安装<a href="http://www.callum-macdonald.com/code/wp-mail-smtp/" target="_blank">WP-Mail-SMTP</a>插件试图达到修改默认SMTP的效果，依然没能成功。Configure SMTP也是实现类似功能的），并且特别为我在他的服务器上开通了SMTP邮件发送的测试账号。

<!--more-->在后台启用Configure SMTP，按照Dreamix给我的服务器账号密码进行发送测试，居然成功！

为了推广验证其他邮件提供商的服务器，我又尝试了自己的QQ邮箱和GMail。结果是，**QQ邮箱可以，GMail失败**（二者都已经开启了SMTP功能）。目前我的博客评论回复邮件的发件地址使用的都是我的QQ邮箱。欢迎大家帮助测试。

**【我的插件设置参数】**

<img decoding="async" src="http://farm4.static.flickr.com/3571/3388868687_0f2752271b.jpg" alt="" /> 

**【感谢名单】**

<a href="http://www.dreamix.cn/" target="_blank"><strong>Dreamix</strong></a> &#8211; 帮助解决本问题的最大功劳当仁不让归属于他～此外他旗下的<a href="http://www.saimoe.org/" target="_blank">saimoe站</a>也是萌属性很强烈的怨念聚集地，值得一顶～

<a href="http://moon-blog.cn/" target="_blank"><strong>爱月</strong></a> &#8211; 介绍了Dreamix给我认识～间接立下汗马功劳哇。

<a href="http://www.lightory.net/" target="_blank"><strong>LiGht</strong></a> &#8211; 为了这个问题我已经在网生代的<a href="http://www.weborn.org/jump-reader-2-896/" target="_blank">这篇文章</a>制造了数条噪音评论，罪过罪过&#8230;

<a href="http://www.plidezus.net" target="_blank"><strong>Plidezus</strong></a> &#8211; 帮助测试邮件发送，虽然未果。

另外还有<a href="http://wjd.name" target="_blank"><strong>WJD</strong></a>童鞋的关注、空间提供商**太湖数据**的优质服务。

**【附SMTP扫盲小知识】**

SMTP(Simple Mail Transfer Protocol)，即简单邮件传输协议,它是一组用于由源地址到目的地址传送邮件的规则,由它来控制信件的中转方式。SMTP协议属于TCP/IP协议族,它帮助每台计算机在发送或中转信件时找到下一个目的地。通过SMTP协议所指定的服务器,我们就可以把E－mail寄到收信人的服务器上了,整个过程只要几分钟。SMTP服务器则是遵循SMTP协议的发送邮件服务器，用来发送或中转你发出的电子邮件。