---
title: 成功使用Recovery Flasher升级PSP版本
author: XDash
type: post
date: 2009-03-26T10:16:45+00:00
url: /use-recovery-flasher-to-update-psp.html
aktt_notify_twitter:
  - no
views:
  - 2045
categories:
  - Web 2.0
tags:
  - 1.50
  - 2.71
  - Flasher
  - PSP
  - Recovery
  - 刷机
  - 升级

---
<img decoding="async" src="http://farm4.static.flickr.com/3574/3387310942_24325a2d09.jpg?v=0" alt="你拍攝的 1021480。" />

[XDash][1]从同学那里霸来一台PSP（随之而来的还有一台NDSL&#8230;我得意的笑）。同学购入甚早，机型是PSP1000，固件版本是2.71。在科技日新月异不断推陈出新，PSP版本已经推出5.0+的今天（|||），这台机器诡异的2.71让同寝室里的W童鞋Orz了很久。

由于2.71版本**无法兼容新出的游戏，无法运行破解的游戏，并且缺少新版本某些NB的功能**，于是我俩昨晚奋战至凌晨，终于摸清楚了如何将这部老掉牙的半砖升级到较为高级的版本。也就是说，刷机成功。

最初的思路是直接在2.71的基础上挨个网上打patch，直至高版本。但2.71历史实在太过悠久，网络上可用的补丁已经快遗忘这个版本了。加之曾经的电玩航母站<a href="http://www.tgbus.com" target="_blank">电玩巴士(TGBUS)</a>已经于2月20日<a href="http://bbs.tiexue.net/post2_3385723_1.html" target="_blank">被万网停止了域名解析</a>（迫于工信部的压力），网上流传的大部分转载自TGBUS的补丁资源都无法下载，于是我们最终放弃了这个想法。

<!--more-->之后查阅资料，发现网上流传的2.71升级的步骤，绝大部分思路是，先降到1.50，然后再直接升上3+。尝试使用了其中一种downdater方法。此方法需要1/10的极度RP，才能达成最终“全屏红色”的刷机成功信号，并且据说也比较容易变砖。事实证明，虽然在此期间我一度RP爆发连续RESET出三把全屏红色，依然无法成功降级到1.50。

经过一番试炼，最终找到了成功升降小P等级的靠谱方法——**Recovery Flasher**这个神一般的刷机工具。

> 这个程序其实就是一个加强版的自制固件刷写程序。过去在OE时代（包括3.52M33时代），DA（M33）制作的自制固件都有自己的固件刷写程序，3.71之后才开始调用SONY的官方更新程序刷写自制固件。
> 
> Recovery flasher 就是这样一个和SONY完全不相干的自己写的固件刷写程序。这个程序参考了DA大神刷写IPL的代码，同时在神电加强版作者jas0nuk 的帮助下，强化了操作界面，用过神电的玩家用过这个软件后，会有似曾相识的感觉。

使用此工具成功将PSP由2.71降至1.50，此后由升为3.71(事后回想，如果当初知道其强大的作用，应该可以直接从2.71升至3.71，免去中间过程）。

**总结直接升级至3.71步骤大致如下：**

1.下载Recovery Flasher，解压缩，复制Recovery目录到记忆棒根目录\PSP\game\下。

2.下载SONY官方3.71固件，改名371.PBP，同样放在recovery目录下。（3.71官方固件下载：<a href="http://files.cngba.com/welsper/FW_Update/FW_371.rar" target="_blank">http://files.cngba.com/welsper/FW_Update/FW_371.rar</a>）

3.如果你的小P能进入XMB，可以在XMB/Game运行这个程序。如果是半砖，则按R键开机，进入恢复模式，选第三项【Run program at /PSP/GAME/RECOVERY/EBOOT.PBP】就能进入Main Menu。

4.在Recovery界面下第一项中，使用△键将版本选择为3.71。然后直接进入第二项，根据操作开始升级。

如果顺利的话会在底部的状态文字中看到系统正在解压缩和复制系统文件。根据提示按键和点选相应的菜单项即可。最终完成后电源灯会一阵狂闪，之后归于平静，自动关机。当你再次开机时&#8230;Aha!出现首次运行的系统设置选项！完成设置，去System Settings里查看版本信息，果然已经成功刷至预想的版本！

Recovery Flasher果然是神一般的工具！用后我和W童鞋大呼神奇，惊叹牛逼。这个工具能够有效降低刷机过程中的变砖风险，甚至还能让砖机起死回生，堪称PSP不安分用户居家旅行、刷机解砖之必备神器。

 [1]: http://www.fanbing.net/blog