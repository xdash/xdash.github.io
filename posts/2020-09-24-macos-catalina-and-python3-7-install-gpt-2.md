---
title: macOS Catalina + Python3.7 安装 GPT-2
author: XDash
type: post
date: 2020-09-23T18:06:15+00:00
url: /macos-catalina-and-python3-7-install-gpt-2.html
categories:
  - Geeky
tags:
  - GPT-2
  - mac
  - NLP
  - Python

---
等 GPT-3 出正式版之前，先拿 GPT-2 玩耍。记录在 macOS Catalina 上安装 GPT-2 的过程。

  * pip3 install tensorflow==1.15
  * git clone https://github.com/openai/gpt-2.git
  * 进入 gpt-2 文件夹，pip3 install -r requirements.txt
  * python3 download_model.py 1558M（其它体量参数自小到大：124M、355M、774M）
  * 我用的是 Python3.7，运行报错「dictionary changed size during iteration」。这时候需要凭 sudo 身份，将错误日志里那个 linecache.py 的 48 行改成：「for mod in list(sys.modules.values()):」
  * 测试运行吧！python3 src/interactive\_conditional\_samples.py &#8211;top_k 40