---
title: Python + Dropbox 打造简易版 WebCam
author: XDash
type: post
date: 2012-03-25T18:09:06+00:00
url: /webcam-with-python-and-dropbox.html
views:
  - 3331
categories:
  - Coding
  - Geeky
tags:
  - diy
  - dropbox
  - geek
  - Python

---
最近一阵离职在家休息，终于有相对充裕的时间折腾研究一些感兴趣的东西，比如 Arduino，比如 Python，比如 HTML5，又比如我还领养了一只小仓鼠。

[<img loading="lazy" decoding="async" title="webcam_blog" src="http://www.fanbing.net/wp-content/uploads/2012/03/webcam_blog.jpg" alt="" width="500" height="287" />][1]

晚上折腾时发现了 VideoCapture 这个 Python 库，用于获取对视频设备的支持，能通过电脑摄像头捕获视频信号以及截图。联想到平时出门需要了解一下家中仓鼠的动态，于是灵机一动，打算巧借 Dropbox 的力量打造一个 Python 实现的 WebCam。

**原理：**利用 Python 调用 VideoCapture 获取摄像头拍到的图像，保存到 Dropbox 的 Public 文件夹下，通过 Dropbox 的自动同步更新这个外链的图片文件，从而实现远程监控的 WebCam 功能。

<!--more-->

<span style="font-weight: bold;">准备工作：</span>

  * 始终在线用于监控的带摄像头的电脑一台（USB 外接摄像头也可，我用的仅仅几十块钱）；
  * 在上述电脑上运行的 Python 环境；
  * 一个支持外链并且自动同步的网盘，比如 Dropbox，或是其他国内访问无阻的同类产品；
  * 一只被24小时置于摄像头监控范围内的小仓鼠，当然这个可以被任意替代。

**开搞：**

  * 1、本地配置好 Python，我用的是 2.5 （更新的版本可能与当下网络流行的库的兼容性较差），确保能 Hello World 成功。
  * 2、<a href="http://videocapture.sourceforge.net/" target="_blank">获取 VideoCapture 库</a>（解压后去 Python25 文件夹把相关文件复制到 Python 程序目录的对应文件夹下）。这是主角。
  * 3、另外两个配角也不能少：<a href="http://www.pythonware.com/products/pil/index.htm" target="_blank">PIL</a>（一个 Python 的图像库，用于保存图片）和 <a href="http://www.microsoft.com/directx/homeuser/downloads/default.asp" target="_blank">DirectX</a>（一般机器已经自带）。
  * 4、写代码！我研究仿效的代码来自<a href="http://blog.csdn.net/dyx1024/article/details/7249811" target="_blank">这个哥们的博文示例</a>，基本可以拿来直接用。但我还是稍微进行了修改，把原来那个无止境的 While True 循环做成了有条件终止的循环，把抓取频次改成了每 5 秒一次（SLEEP\_TIME\_LONG = 5）。
  * 5、把 cam.saveSnapshot 这句里定义的保存路径改为了我的 Dropbox 目录下外链目录 Public 的路径下的固定文件名 WebCam.jpg。

OK，这就算齐活儿了。运行程序，只见在 C:\Dropbox\Public\webcam\ 下生成了一张来自摄像头的截图，并且每隔 5 秒自动刷新。同时 Dropbox 也会第一时间将其同步到您的网络空间。于是通过形如 http://dl.dropbox.com/u/3876xxx/webcam/WebCam.jpg 的外链地址就可以访问你的摄像头图片了——这俨然就是一台低成本的 WebCam。

（再玩的深入点，什么发微博发推的都能加上，这样就等于给小仓鼠建立了个自动更新状态的个人主页 ^_^）

<p style="text-align: center;">
  <a href="http://www.fanbing.net/wp-content/uploads/2012/03/webcam.jpg"><img loading="lazy" decoding="async" class="alignnone size-full wp-image-5150" title="webcam" src="http://www.fanbing.net/wp-content/uploads/2012/03/webcam.jpg" alt="" width="500" height="375" /></a>
</p>

<p style="text-align: center;">
  （ ↑ 上图是自动拍摄到的画面之一，我承认这摄像头像素是比较杯具 TAT ）
</p>

 [1]: http://www.fanbing.net/wp-content/uploads/2012/03/webcam_blog.jpg