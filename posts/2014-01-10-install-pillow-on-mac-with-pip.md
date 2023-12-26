---
title: Mac 下安装 Python 图像处理模块 Pillow
author: XDash
type: post
date: 2014-01-10T01:35:01+00:00
url: /install-pillow-on-mac-with-pip.html
wiziapp_processed:
  - 1
categories:
  - Coding

---
学习用 Python 写日常辅助小工具。参阅教程，原打算使用 PIL 库作为图片处理模块，但发现该库已停止维护两年，开源社区普遍推荐 fork 版的 <a href="https://github.com/python-imaging/Pillow" target="_blank">Pillow</a>。要说 Mac 虽自带 Python，但对安装 Python 的库却繁复折腾，捣鼓了半天，最后还是靠大神丢过来的 <a href="http://stackoverflow.com/questions/1213690/what-is-the-most-compatible-way-to-install-python-modules-on-a-mac" target="_blank">Quora 链接</a>顺藤摸瓜搞定了 Pillow。

记录分享如下：

**1、使用 pip 安装 Python 库。**pip 是 Python 的包管理工具，安装后就可以直接在命令行一站式地安装/管理各种库了（<a href="http://www.pip-installer.org/en/latest/index.html" target="_blank">pip 文档</a>）。

$ wget http://pypi.python.org/packages/source/p/pip/pip-0.7.2.tar.gz

$ tar xzf pip-0.7.2.tar.gz

$ cd pip-0.7.2

$ python setup.py install

**2、使用 pip 下载获取 Pillow**：

$ pip install pillow

3、安装过程中命令行出现错误提示：&#8221;error: command &#8216;clang&#8217; failed with exit status 1”。上网查阅，发现需要通过 Xcode 更新 Command Line Tool。于是打开 Xcode->Preferences->Downloads-Components选项卡。咦？竟然没了 Command Line Tools。再查，发现 Xcode 5 以上现在需要用命令行安装：

$ xcode-select —install

系统会弹出安装命令行工具的提示，点击安装即可。

此时再 pip install pillow，就安装成功了。

pip freeze 命令查看已经安装的 Python 包，Pillow 已经乖乖躺那儿了。