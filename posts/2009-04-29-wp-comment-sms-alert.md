---
title: 给WordPress增加留言评论的短信提醒功能
author: XDash
type: post
date: 2009-04-28T17:25:17+00:00
url: /wp-comment-sms-alert.html
aktt_notify_twitter:
  - no
views:
  - 1761
categories:
  - Blog Media
tags:
  - 139
  - comment
  - plugin
  - wordpress
  - 插件
  - 短信

---
<img decoding="async" src="http://farm4.static.flickr.com/3652/3483890292_d9b4733df2.jpg?v=0" alt="你拍攝的 139mail。" />

对于玩博客有一阵子的我而言，现如今PV、IP这些数据已经构不成让我关注的对象，而我真正在乎的是各位的留言评论，无论是鼓励的赞扬的，还是吐槽的吹水的。基本上只要不是spammer捣乱，任何文字都欢迎。我也相信大部分进阶blogger也跟我一样，将访问者的留言看得很重，以至于费尽心思调整细节，以求获得更多留言评论反馈，譬如<a href="http://www.fanbing.net/blog/comment-to-email-solved.html" target="_blank">使用留言评论邮件通知插件</a>。

今天在<a href="http://philna.com/" target="_blank">philna博客</a>上看到一篇<a href="http://philna.com/2009/04/comment-sms-alert-2" target="_blank">折腾WP使之支持评论短信提醒的文章</a>，经过个人测试，好用靠谱。在此隆重分享。

基本原理很简单，通过申请注册<a href="http://mail.139.com/" target="_blank">中国移动的139邮箱</a>，开启新邮件短信提醒功能。然后在博客中加入代码，即可实现新评论通知发送到邮箱，继而同时使用手机接收短信。

注册139邮箱的方法这里就不讲了，短信验证，注册登陆即可。有一点需要注意，在设置短息提醒的“邮件到达通知”时，请设置为**“长短信”**。这样收到短信时就会包括邮件的标题、内容（也就是评论内容），否则只有标题。

<!--more-->接下来就是倒腾WP本身，也很简单。找到你

**当前皮肤的function.php**（后台外观&#8211;>编辑&#8211;>function.php），在php语言标示符，也就是首尾的<?php 和 /?php> 之间，直接加入如下代码（记得**将邮件地址改为您的139邮箱**）：

 

**&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;   HERE WE GO 的分割线 代码开始 请复制以下  &#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;**

**  
** 

add\_action(&#8216;comment\_post&#8217;, create\_function(&#8216;$cmid&#8217;, &#8216;return philna\_comment\_send\_mail($cmid);&#8217;));

function philna\_comment\_send_mail($cmid){

/*

这个是从官方找到的get_commentdata的用法:

get\_commentdata( $comment\_ID, $no\_cache = 0, $include\_unapproved = false )

*/

$commentdata = get_commentdata($cmid,1,true);

$comment\_author=$commentdata[&#8216;comment\_author&#8217;];

$commentcontent=$commentdata[&#8216;comment_content&#8217;];

$post\_id=$commentdata[&#8216;comment\_post_ID&#8217;];

$post=get\_post($post\_id);

$post\_title=$post->post\_title;

$message=$comment\_author.&#8217; 在日志: <em>&#8217;.$post\_title.&#8217;  </em><strong>说 :</strong>  &#8216;.$commentcontent;

$blogname = get_option(&#8216;blogname&#8217;);

$charset = get\_option(&#8216;blog\_charset&#8217;);

$mail_headers  = &#8220;From: $blogname \n&#8221; ;

$mail_headers .= &#8220;MIME-Version: 1.0\n&#8221;;

$mail_headers .= &#8220;Content-Type: text/html;charset=\&#8221;$charset\&#8221;\n&#8221;;

$to=&#8217;你的手机号@139.com&#8217;;

$subject=&#8217;博客评论提醒 来自:&#8217;.$comment_author;

@wp\_mail($to, $subject,$message,$mail\_headers);

}

 

**&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;   HERE WE GO 的分割线 代码完毕 打完收工  &#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;**

 

一切OK之后，如果不出意外，你的博客已经与你的139邮箱实现联动，任何留言意见都会即可通过短信收到提醒（至少我进行到这一步之后试验了一次就立刻听见手机开始骚动了&#8230;）。

另外原文中还有关于**给多个用户提醒**、**spam不提醒**、**只针对指定留言者提醒**的扩展方式，在此不再赘述，直接去原地址看好了，写的很清楚。

最后就此WP扩展发表一些个人的看法：

  * 1.此扩展适合我等在意网站用户反馈信息的博主使用。如果您对此不是非常在意，或者您的博客人气爆棚会形成短信轰炸的地步，不推荐使用此扩展。
  * 2.可设置短信提醒时间，譬如8:00～22:00。在此时间段之外的新邮件，一律不发送短信通知。
  * 3.借此扩展能够更好更直观地把握博客访问者的集中时间段，大家一般都在哪个点来你博客晃荡。
  * 4.为使用此扩展需专门注册139邮箱。但鉴于中国移动的强势推广策略和市场地位基础，使用139邮箱是迟早的事情。此外邮箱支持使用自定义用户名@139.com的地址，从而隐去了手机号码外露的危险性。也就是一个邮箱对应两个账号。加之个人感觉139邮箱的使用体验尚可，符合国人习惯，定制功能较强，因此注册一个未尝不可（如果您不是对ChinaMobile非常反感的话）。
  * 5.利用139邮箱的短信通知功能，还能实现其他不少好玩用法。例如通过邮件订阅的网站更新、每月精华等，可以在第一时间通过手机阅读。如果您发现其他什么新玩法，欢迎留言告诉我～
  * 6.如果您只是将此邮箱作为接收短信用，请确保邮箱地址的安全（不要在不必要的场合留下此邮箱地址），否则可能造成手机信骚扰频繁和信息过载严重，影响正常工作生活。此外也建议使用自定义用户名@139.com而不是手机号@139.com。除非你真得闲到蛋疼或者打电话不要钱。
  * 7.正在探索一种方式，能在收到此短信通知后，通过短信回复的方式同步回复到博客的对应评论下方。139邮箱的<a href="http://mail.139.com/m4center/pushEmail.html" target="_blank">PushEmail</a>方式可能性比较小，如果用微博客结合API的话，几率应该会大很多吧&#8230;