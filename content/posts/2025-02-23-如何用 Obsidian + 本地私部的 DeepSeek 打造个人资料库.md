---
title: 如何用 Obsidian + DeepSeek 打造本地个人资料库
author:
  - XDash
type: post
date: 2025-02-23T00:08:00+08:00
url: /how-to-build-local-personal-dataset-using-obsidian-and-deepseek
categories:
  - Geeky
  - AI
tags:
  - AI
  - gadget
---
1. （作为前置准备，确保你本地已经部署了 DeepSeek。我是用 Ollama 的方式跑在丐版 Mac Mini M4 上，最常用 14b 模型。）
2. 打开 Obsidian，去社区插件（Community plugins）安装 Copilot 并启用它。
3. 进入社区插件->Copilot 页面（标题是 「Copilot Settings」，会带版本号，截图时是 v2.8.6），顶上切换到 「Models」选项卡，再点击右下角的「+ Ade Custom Model」，会弹出「Add Custom Chat Model」界面。如下图：

![[截屏2025-02-23 23.32.50.png]]

4. 「Model Name」填「DeepSeek-R1」；「Display Name」是屏显名称，随便写；「Provider」选「Ollama」；「Base URL」就是你现在运行的本地部署服务器地址，我的是「http://127.0.0.1:11434/」；「API Key」留空即可；剩下「Reasoning」、「Vision」、「Websearch」如字面，需要就勾上。
5. 上述填写完成后，点击「Verify」验证，如都正确则验证成功，可「Add Model」完成 DeepSeek 的模型添加。此时刚添加的模型出现在了模型列表最下方。
![[截屏2025-02-23 23.32.35.png]]

6. 回到 Copilot 的插件设置页面。在「Default Chat Model」和「Embedding Model」里，都把你刚才添加的模型选中。

![[截屏2025-02-23 23.44.02.png]]

7. 至此模型添加完成。回到 Obsidian，你可以到 Copilot 里去索引（index valuts）整个笔记库、去提问、去各种折腾 DeepSeek 了。