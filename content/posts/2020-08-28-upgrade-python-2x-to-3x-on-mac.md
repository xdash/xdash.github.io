---
title: 快速将 Mac 自带 Python 版本环境从 2.X 修改到 3.7
author: XDash
type: post
date: 2020-08-28T06:35:43+00:00
url: /upgrade-python-2x-to-3x-on-mac.html
categories:
  - Geeky
tags:
  - mac
  - Python

---
拿出一台闲置的 MacBook Air 作为个人项目的生产环境服务器。这台 2015 年的古董，自带 Python 2.7，在额外安装上 Python 3.7 后，产生紊乱，例如：pip3 install 的目标路径仍然指向 Python 2.7 的路径。

找了一圈，试过之后最省事的方法是：virtualenv：

1、在 Mac 上安装&nbsp;virtualenv：sudo pip install virtualenv

2、找到 python3的路径：which python3，发现藏在 /usr/bin/python3 下。

3、执行&nbsp;virtualenv 命令，修改 pip 的安装路径到 python3上：

  * sudo virtualenv -p /usr/bin/python3 py3env
  * source py3env/bin/activate

4、环境修改之后，查看变量修改是否成功：pip3 -V，看到结果： 后面出现了 python3 的路径，说明修改成功。

5、正常用 pip3 安装 python3 包即可。