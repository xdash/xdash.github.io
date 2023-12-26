---
title: 在 Google App Engine 上部署 Project Babel （V2EX）
author: XDash
type: post
date: 2010-12-06T15:40:56+00:00
url: /project-babel-on-gae.html
views:
  - 2512
categories:
  - Geeky
  - Web 2.0
tags:
  - GAE
  - Google
  - Project Babel
  - V2EX

---
**#Update：appspot.com 域名已经被墙，目前正常情况下无法访问该论坛。**

前一阵子学习 Python，由于调试本地环境总是出错，一气之下干脆拿 <a href="http://appengine.google.com" target="_blank">Google App Engine</a> 作为线上环境，折腾中竟发现了 GAE 的诸多优势和方便之处。

近期工作繁忙，疏于维护<a href="http://www.syncoo.com" target="_blank">同步控</a>，打算用 <a href="http://www.livid.cn/" target="_blank">Livid</a> 的 <a href="http://code.google.com/p/project-babel/" target="_blank"><strong>Project Babel</strong></a> （也就是 <a href="http://www.v2ex.com/" target="_blank">V2EX</a> 的开源版，运行于 GAE 之上）搭建一个互动社区，供网友进行更广泛的交流，同时也减小更新的压力。

在此大致记录下部署的重点步骤，供参考：

  * **1、**获取并本地安装 <a href="http://code.google.com/appengine/downloads.html" target="_blank">Google App Engine 的 SDK</a>（我的是 for Windows），及 <a href="http://www.python.org/" target="_blank">Python</a>（推荐 2.6，官网被墙奸，请走便道）。
  * **2、**申请注册 Google App Engine，添加 APP（免费用户最多可添加10个APP，每个获得域名 yourname.appspot.com）。
  * **3、**<a href="http://code.google.com/p/project-babel/" target="_blank">获取最新版 Project Babel</a>，本地解压后是一些有组织有纪律的文件夹及文件。记事本打开根目录的 app.yaml，将 application 字段修改为与 2 中的 APP 名称相同。
  * **4、**运行 Google App Engine Launcher，在设置中指定 GAE SDK 文件夹和本地 Python 可执行文件目录，绑定环境。
  * **5、**在 Google App Engine Launcher 中，Add 一个 existing project，指向你在 3 中获得的 Project Babel 的根目录，启动之。
  * **6、**在命令行执行以下指令：**{GAE目录\appcfg.py} update {Project Babel 的根目录地址}** （例如我是执行：&#8221;E:\GAE\appcfg.py&#8221; update &#8220;F:\Test Project\babel-2.4.0-RC1\v2ex&#8221;）

系统开始自动复制上传（首次会邀请输入 GAE 账号密码），并每隔几秒检测服务是否已经部署就绪。最终，部署完成，cmd 里返回成功信息。这样 Project Babel 就上了你的 GAE 了。

当然，后续还有一些步骤，就是定制和优化界面，去掉不需要的广告，挂上你的 logo 等。这些在 Project Babel 文件夹下手动修改 CSS 和 html 以及资源文件可以实现。

**效果演示：**<a href="http://syncbbs.appspot.com" target="_blank">http://syncbbs.appspot.com</a>