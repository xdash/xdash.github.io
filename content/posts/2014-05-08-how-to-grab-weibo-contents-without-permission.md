---
title: Growth Hacker 奇技淫巧一则：零授权，抓取新浪微博任何用户的微博内容
author: XDash
type: post
date: 2014-05-08T10:05:41+00:00
url: /how-to-grab-weibo-contents-without-permission.html
categories:
  - Coding
tags:
  - growth hacker
  - hack

---
有时或基于以下凡此种种需求，我们会想要去抓取新浪微博的内容：

  * 产品冷启动，导入外部数据，而非从头积累；
  * 通过大数据+语义分析获取用户兴趣行为偏好，提供智能推荐；
  * 监控微博舆情，对特定关键词或是用户行为进行响应；etc

想必新浪深知微博内容本身是最其有价值的资产，一旦被竞争对手大批量抓取导入，则辛苦建立起的门槛将瞬间化作他人之嫁衣，因此做了非常繁复的安全保护，包括强制登录跳转认证、跨域检测、cookie 植入、禁止账号密码登录而启用 OAuth2.0 等等。

近期个人有一些抓取需求，在查询大量过时的网络资料测试无果后，决定另辟蹊径完成这一目标，并最终测试成功。在此分享出来。（这篇文章将提供解决问题的方法思路，但不会给出具体代码。伸手党请移步百度或 Github。）

**你需要准备：**一个个人微博账号，我们将透过它去访问其他用户页面，从而抓取。除此之外，别无所求。  
<!--more-->

**解题思路：**

1.最初我从微博 Web 版入手，发现即使是浏览器中可正常查看的内容，若直接通过 PHP 的 curl 或者 file\_get\_contents 读取，也无法直接取得，而是读取到一串 js 代码，作用是跨域判断+cookie判断+header跳转。料想要模拟的请求和一重重越过的限制定会很多。

2.转换思路，既然微博的 Web 版限制很多，那就从移动版下手（移动网页 weibo.cn，而非指移动 App）。移动版碍于手机机能的限制，身份验证要求会降低很多。经过实验，微博移动版的展示规则是：加V用户、微博广场，可直接访问其页面；普通用户，则必须登录才能看到。而判定当前登录用户身份的标识，则应该是手机浏览器本身存储的 cookie 与服务端的某个 session 比对。

3.由于我需要获取普通用户的微博内容，因此还要想办法继续绕。你当然可以每次直接模拟用户登录，但相对繁琐，我希望能一劳永逸。既然移动版的身份判定很大程度上依赖手机浏览器 cookie，而一般浏览器 cookie 不那么容易取，且某些土鳖机型连 cookie 都无法记录（号称 1.3 亿月活跃用户的上市公司一定会照顾穷苦大众的），那么微博一定提供了其他退而求其次的解决方法。于是我注意到了登陆框下的「记住登录状态，需支持并打开手机的cookie功能。」选项。

[<img loading="lazy" decoding="async" src="http://www.fanbing.net/wp-content/uploads/2014/05/Screen-Shot-2014-05-08-at-5.47.19-PM--379x400.png" alt="Screen Shot 2014-05-08 at 5.47.19 PM" width="379" height="400" class="aligncenter size-medium wp-image-5393" srcset="http://xdash.one/wp-content/uploads/2014/05/Screen-Shot-2014-05-08-at-5.47.19-PM--379x400.png 379w, http://xdash.one/wp-content/uploads/2014/05/Screen-Shot-2014-05-08-at-5.47.19-PM-.png 403w" sizes="(max-width: 379px) 100vw, 379px" />][1]

See？默认是勾上的，也即是说微博团队主观上是希望用户勾上这个，从而借助 cookie 判断来提高登录安全性的。

我遂果断取消勾选该选项，输入任何一个自己的微博账号密码，点击登录。

4.值得注意的情况出现了：登录时的验证网页走的是 newlogin.sina.cn，而非勾选状态下会走的 login.sina.cn。说明此种情况下，登录验证的确是进行了特殊的处理，从而让没有开启 cookie 功能的手机也能被判定为登录。

查看跳转页面的源代码，发现有如下一行：

    如果没有自动跳转,请<a href="http://weibo.cn/?s2w=login&amp;gsid=4uwc8bfa1vnw8ivzI9gUd706F3W&amp;vt=4">点击这里</a>
    

注意这个 gsid 参数，料想它就是判定本地用户身份的标识，于是整个提取出来（为了我的账号安全，我对这个案例中的 gsid 做了修改，你们直接照搬是无法成功的，还是自己跑一遍登录流程吧）。

[<img loading="lazy" decoding="async" src="http://www.fanbing.net/wp-content/uploads/2014/05/Screen-Shot-2014-05-08-at-5.56.30-PM-.png" alt="Screen Shot 2014-05-08 at 5.56.30 PM" width="402" height="272" class="aligncenter size-full wp-image-5398" />][2]

5.最精彩的情况来了。为了验证我们能不能凭这一串 gsid 伪造登录后的身份，我开启 Chrome 的隐身模式，随便找了一个正常情况下必须登录才能看到页面的非加V用户，然后在地址栏后面加上了 gsid 参数，URL 整个变成：

    http://weibo.cn/u/1665167973?vt=4&st=7fe6&gsid=4uwc8bfa1vnw8ivzI9gUd706F3W
    

（当然这里的 gsid 我也做了改动，只是作为演示，实际 gsid 还请自行获得）

直接回车！擦，虽然此前没有执行过登录动作，但是已经以登录后的的身份在看他的页面内容了哟。这样，我就可以直接凭借上述固定 URL 去爬去用户的内容。

[<img loading="lazy" decoding="async" src="http://www.fanbing.net/wp-content/uploads/2014/05/Screen-Shot-2014-05-08-at-6.01.28-PM--385x400.png" alt="Screen Shot 2014-05-08 at 6.01.28 PM" width="385" height="400" class="aligncenter size-medium wp-image-5400" srcset="http://xdash.one/wp-content/uploads/2014/05/Screen-Shot-2014-05-08-at-6.01.28-PM--385x400.png 385w, http://xdash.one/wp-content/uploads/2014/05/Screen-Shot-2014-05-08-at-6.01.28-PM-.png 401w" sizes="(max-width: 385px) 100vw, 385px" />][3]

(上图中的「我们都关注XDash」，你就可以知道当前是登录状态，取到了用户身份的。事实上的确如此。)

背后原理应该是，以 GET 方式在 URL 中发送了本地登录后的身份标识，微博服务器比对这串标识来判定对应的登录用户身份，然后返回到本地，本地于是就以这个用户身份登录，堂而皇之地获取数据了。（大一的时候我曾参与过一个基于 ASP 的校园社区的开发，阅读了帝国 CMS 的代码，那时候对于手机用户的身份认证就是这么原始哒。）

现在想要的尽收眼底了，接下来&#8230;Hulk,smash!

[<img loading="lazy" decoding="async" src="http://www.fanbing.net/wp-content/uploads/2014/05/hulksmash.jpg" alt="hulksmash" width="500" height="270" class="aligncenter size-full wp-image-5391" />][4]

微博手机版，阿喀琉斯的脚后跟。

 [1]: http://www.fanbing.net/wp-content/uploads/2014/05/Screen-Shot-2014-05-08-at-5.47.19-PM-.png
 [2]: http://www.fanbing.net/wp-content/uploads/2014/05/Screen-Shot-2014-05-08-at-5.56.30-PM-.png
 [3]: http://www.fanbing.net/wp-content/uploads/2014/05/Screen-Shot-2014-05-08-at-6.01.28-PM-.png
 [4]: http://www.fanbing.net/wp-content/uploads/2014/05/hulksmash.jpg