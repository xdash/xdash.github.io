---
title: 开源微博应用《测测你是哪个奥特曼》for SAE 配置全教程攻略
author: XDash
type: post
date: 2011-11-29T12:04:37+00:00
url: /how-to-deploy-ultramantest-for-gae.html
views:
  - 1969
categories:
  - Coding
  - Geeky
  - Work++
tags:
  - PHP
  - SAE
  - 作品
  - 开源
  - 教程

---
这篇文章将详细介绍如何利用新浪微博开放平台和新浪的 Sina App Engine 服务调试部署<a href="http://www.fanbing.net/php-weibo-test-demo.html" target="_blank">我写的《测测你是哪个奥特曼》</a>源码。目的是帮助首次接触的同学学习掌握 SAE 的玩法（这个服务真的很渣，我在摸索中碰壁许多，也是我撰文分享的初衷之一）。或者您也可以当做是零起点在新浪微博上搞一个测试类应用的傻瓜入门教程。

演示地址：<a href="http://ultramantest.sinaapp.com" target="_blank">http://ultramantest.sinaapp.com</a>

本应用通过 PHP 写成，但实际上您不需要任何 PHP 基础，直接修改我在源码中的相关参数，并替换一些图片，就可以部署上线。

**一、申请开通相关服务账号**

首先您需要申请注册 SAE 的账号和微博开放平台的账号（有微博账号的同学可以更快地登录绑定）：

SAE：<a href="http://sae.sina.com.cn/" target="_blank">http://sae.sina.com.cn/</a>

微博开放平台：<a href="http://open.weibo.com/" target="_blank">http://open.weibo.com/</a>

**二、在 SAE 上创建新应用**

SAE 允许每个普通用户创建最多 10 个应用，每个应用将获得形如 yourdomain.sinaapp.com 的二级域名（先到先得，抢啊同志们 — —）。

<!--more-->1、登录 SAE，点击“创建新应用”：

[<img loading="lazy" decoding="async" class="size-full wp-image-5016 alignnone" title="2011-11-29_182750" src="http://www.fanbing.net/wp-content/uploads/2011/11/2011-11-29_182750.jpg" alt="" width="500" height="199" />][1]

2、填写应用的二级域名（同时也将作为唯一 AppID 用于识别，如填写 ultramantest）、应用名称（通过审核后将显示在微博来源中，如“来自iPhone”）：

[<img loading="lazy" decoding="async" class="size-full wp-image-5019 alignnone" title="2011-11-29_182934" src="http://www.fanbing.net/wp-content/uploads/2011/11/2011-11-29_182934.jpg" alt="" width="478" height="372" />][2]

创建成功后就获得了一个 SAE 上的应用地址，你可以将其理解为一个虚拟主机空间，以后文件被上传到这里，并可在 Web 上被访问。

**三、在新浪微博开放平台上创建应用**

1、登录新浪微博开放平台，在“我的应用”页面点击右侧的“创建应用”：

**[<img loading="lazy" decoding="async" class="size-full wp-image-5035 alignnone" title="2011-11-29_190940" src="http://www.fanbing.net/wp-content/uploads/2011/11/2011-11-29_190940.jpg" alt="" width="500" height="259" />][3]**

2、在弹出的浮动层里，选择要创建的应用类型为“其他”：

**[<img loading="lazy" decoding="async" class="size-full wp-image-5038 alignnone" title="2011-11-29_191112" src="http://www.fanbing.net/wp-content/uploads/2011/11/2011-11-29_1911121.jpg" alt="" width="500" height="203" />][4]**

**3、填写应用信息。除应用地址需要填写我们在上述 SAE 创建的应用地址（如 ultramantest.sinaapp.com）外，其他随意。**

**[<img loading="lazy" decoding="async" class="alignnone size-full wp-image-5040" title="2011-11-29_191343" src="http://www.fanbing.net/wp-content/uploads/2011/11/2011-11-29_191343.jpg" alt="" width="500" height="400" />][5]**

4.创建成功后，进入应用详情页面，在“汇总信息”中能看到系统分配给该应用的 App Key 和 App Secret （也就是图中我遮挡掉的部分，这两个信息很重要，请慎重保管）。将这两个信息记录下来，下文中将会用到。

[<img loading="lazy" decoding="async" class="alignnone size-full wp-image-5041" title="2011-11-29_191632" src="http://www.fanbing.net/wp-content/uploads/2011/11/2011-11-29_191632.jpg" alt="" width="500" height="299" />][6]

**四、获取 Ultramantest 源代码**

在 Ultramantest（《测测你是哪个奥特曼》的项目名称）的 Google Code 主页上下载获取最新版的源代码：<a href="http://code.google.com/p/ultramantest-for-weibo/" target="_blank">http://code.google.com/p/ultramantest-for-weibo/</a>

该主页同时提供了 Zip 压缩打包版本和独立代码文件（感谢 <a href="http://weibo.com/n/橙子Infinity" target="_blank">@橙子Infinity</a> 的协助）。

下载解压后的目录结构及各个文件对应的作用如下（可以跳过阅读以下信息，继续按照第四步指示进行）：

  * ../config.yaml &#8211; SAE 所需的应用信息文件
  * ../config.php &#8211; 一些应用自身需要的参数配置
  * ../weibooauth.php &#8211; 微博开放平台官方 SDK，其中渣浪官方提供的有问题，我已经自行修正，您可直接使用
  * ../index.php &#8211; 应用主页，对本应用进行自我介绍，并提示用户进行新浪微博授权
  * ../callback.php &#8211; 回调文件，指定通过微博 OAuth 验证后返回的页面（这里是到 ready.php）
  * ../ready.php &#8211; OAuth 验证成功后所返回的页面，提示用户可以开始测试
  * ../test.php &#8211; 完成测试并显示测试结果，同时提示用户转发到自己微博中
  * ../postweibo.php &#8211; 发布一条测试结果的微博
  * ../suc.php &#8211; 用户转发成功，整个流程结束（此时页面会引导用户进入开发者——也就是我 @XDash——的微博，或返回自己微博）
  * ../pics/ &#8211; 整个文件夹里是显示测试结果所需的所有角色的图片，在此处是 32 张奥特曼的图片
  * ../landing.png &#8211; index.php 主页中显示的应用自我介绍图
  * ../connect.jpg &#8211; index.php 主页面中提示用户用新浪微博账号授权登录的图
  * ../intro.jpg &#8211; ready.php 页面显示的引导用户开始测试的图
  * ../go.png &#8211; ready.php 中引导用户开始测试的点击按钮（我给他命名为“立刻变身”）
  * ../testbg.jpg &#8211; test.php 测试结果页面背景图，用来烘托气氛
  * ../sinabt.gif &#8211; test.php 测试结果页面中的“发布到微博”按钮
  * ../suc.jpg &#8211; suc.php 发布微博成功后的“发布成功”提示图
  * ../author.jpg &#8211; suc.php 发布微博成功后“查看作者微博”按钮
  * ../back.jpg &#8211; suc.php 发布微博成功后“返回我的微博”按钮

**五、修改 Ultramantest 源代码**

**0、准备工作：**

1）在本地建立一个目录，用于存放 Ultramantest 项目代码，如 D:\codes\Ultramantest。

2）在 D:\codes\Ultramantest 下，创建 1\ 子目录，也就是整个路径变成 D:\codes\Ultramantest\1\。将刚才解压出来的那些文件都丢进去。

[  Q：为什么要创建 1\ 目录？A：这是 SAE 规定的进行版本管理的一种方式，不需要理解，just do it。]

**1、修改应用项目信息 config.yaml 文件**

用文本编辑工具打开 config.yaml。把其中 Name 字段的值改成你在创建 SAE 应用时的 AppID，也就是那个二级域名的前缀部分。

其他地方不需要改动，用我配置好的就可以。

**2、修改代码公共配置文件 config.php****（非常重要）**

打开 config.php，在 22 行和 23 行的标注位置填入刚才第三步中申请的新浪微博开放平台的 APP Key 和 App Secret 的值。

其余部分是注释性质的应用开发者信息，您可以自行修改，当然您要保留我的也不反对，嘿嘿。

**3、修改测试内容（非常重要）**

这一步是整个过程最主要的部分，将我这个《测测你是哪个奥特曼》的应用改成你想要测试的内容。我先讲下我的实现原理：

  * 1）用户登录授权之后，获取用户的昵称；
  * 2）简单地用 MD5 加密的方法对用户昵称进行加密，并取加密结果的前两位；
  * 3）根据第2）步获得的结果进行 if 判断，并返回对应的结果ID。

由于 MD5 采用16进制字符，加密结果的前两位共有 16&#215;16=256 种组合，理论上可以让微博上的用户最多获得 256 种不同的测试结果。由于没有这么多奥特曼（囧），我这里将每 4 种归为一个结果，因此共有 256/4=64 种结果。这个数量一般的测试够用了。但做到最后我发现还是没有这么多奥特曼，于是我干脆同一个奥特曼对应两种结果（比如初代对应的是 1 和33，杰克奥特曼对应 2 和 34，继续囧）。

  * 4）对应变量结果，输出微博信息，提示转发。

因此，您需要做的是：

**1）修改 62 行到 381 行的所有测试 64 个测试结果的文案，改成你需要的。比如你可以改成海贼王测试，火影忍者测试等。**

其中每一则的 $Name\_xx 变量是结果的名称，$Pic\_xx 是对应的图片（将会发到微博）；$Weibo\_xx 是对应发出微博的文案；$Point\_xx  是一个原始数值（将与 1193-1120 行生成的随机数加成，成为这个用户的一些没有意义的数据，比如战斗力、敏捷度、耐久度，范围一般在 50 ~ 100 之间），$Description_xx 暂时没有用上，懂开发的朋友可以用于补充其他信息。

这一步的工作量很大，且需要策划。（我在写程序到这一步的时候，发现完全成为了一个体力活儿 — —b）

如果您需要大于 64 个结果，可以修改 401 到 661 行，很简单的 if-else 语句。

**2）修改发布微博的文案**

1202-1204 定义是发布文案的语句，其中 1202 行是现实在 test.php 这个结果页面的文本框里供用户预览的，没有意义；1204 行是真真切切发布到微博的内容，可以仔细定义一下什么文案最有价值和吸引力。

**3）修改发布微博传链接的地址**

修改 postweibo.php 的 58 行，将 http://ultramantest.sinaapp.com 替换成您在第二步注册的二级域名。

**4）修改作者微博链接**

在 suc.php 的 32 行。

**5）其他修改，只要你爽**

如果您懂得设计、CSS，可以自行修改页面布局和素材图片。如果懂 PHP 代码则可以自行扩充这个应用。

**六、提交 SVN，大功告成**

根据微博开放平台的详细图文教程（地址：<a href="http://sae.sina.com.cn/?m=devcenter&catId=212" target="_blank">http://sae.sina.com.cn/?m=devcenter&catId=212</a>），下载一个 SVN 工具将演示路径 D:\codes\Ultramantest\1\ 下的文件上传到 SAE 空间。

全部提交成功后，输入您的 SAE 应用地址（如 <a href="http://ultramantest.sinaapp.com" target="_blank">ultramantest.sinaapp.com</a>）即可看到效果！下图是微博登陆后的 ready.php 页面：

[<img loading="lazy" decoding="async" class="alignnone size-full wp-image-5051" title="2011-11-29_194918" src="http://www.fanbing.net/wp-content/uploads/2011/11/2011-11-29_194918.jpg" alt="" width="500" height="331" />][7]

**七、通过新浪官方应用审核**

到 SAE 中根据要求提交应用审核信息，很快（我是当天下午提交第二天上午 10 点通过）就能通过新浪官方审核认证。这样通过你的应用发布到微博上的消息，将会带上“来自xxxx”的信息，而非默认的丑陋“来自未审核通过应用”。如下图：

[<img loading="lazy" decoding="async" class="alignnone size-full wp-image-5055" title="2011-11-29_195454" src="http://www.fanbing.net/wp-content/uploads/2011/11/2011-11-29_195454.jpg" alt="" width="499" height="281" />][8]

整个过程结束。接下来就是宣传和维护的事儿了。

**\# 其他补充**

  * 由于是简单的东西，我的代码也写得很随性洒脱，没有什么复杂语句或者结构，稍微懂点编程的朋友应该看懂都不难。
  * 由于正在跟奥特曼中国版权方接洽版权事宜，争取拿到官方授权并开发下一款应用，因此 <a href="http://ultramantest.sinaapp.com" target="_blank">http://ultramantest.sinaapp.com</a> 这个演示地址随时可能无法访问（但页面上会有文字提示）。但不妨碍您传到自己的 SAE 空间上个人学习使用。
  * 渣浪太渣了，开发总很多诡异问题查下来都是渣浪自己服务不周导致，鄙视一记。
  * 如果您有兴趣，欢迎在新浪微博关注我：<a href="http://weibo.com/xdash" target="_blank">http://weibo.com/xdash</a> 或访问个人主页 <a href="http://www.fanbing.net" target="_blank">http://www.fanbing.net</a>。

 [1]: http://www.fanbing.net/wp-content/uploads/2011/11/2011-11-29_182750.jpg
 [2]: http://www.fanbing.net/wp-content/uploads/2011/11/2011-11-29_182934.jpg
 [3]: http://www.fanbing.net/wp-content/uploads/2011/11/2011-11-29_190940.jpg
 [4]: http://www.fanbing.net/wp-content/uploads/2011/11/2011-11-29_1911121.jpg
 [5]: http://www.fanbing.net/wp-content/uploads/2011/11/2011-11-29_191343.jpg
 [6]: http://www.fanbing.net/wp-content/uploads/2011/11/2011-11-29_191632.jpg
 [7]: http://www.fanbing.net/wp-content/uploads/2011/11/2011-11-29_194918.jpg
 [8]: http://www.fanbing.net/wp-content/uploads/2011/11/2011-11-29_195454.jpg