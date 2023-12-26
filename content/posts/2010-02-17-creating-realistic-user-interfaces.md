---
title: Creating Realistic User Interfaces
author: XDash
type: post
date: 2010-02-17T10:52:34+00:00
url: /creating-realistic-user-interfaces.html
views:
  - 1598
categories:
  - Design / Vision
tags:
  - apple
  - design
  - ui

---
[<img loading="lazy" decoding="async" class="alignnone size-full wp-image-2850" title="finalcutserver" src="http://www.fanbing.net/wp-content/uploads/2010/02/finalcutserver.png" alt="finalcutserver" width="500" height="202" />][1]

一直对绘制高度仿真的UI原理很好奇，网上也只有按部就班的、使用何种工具调节何种参数的傻瓜式教程，直到我发现这篇<a href="http://flyosity.com/tutorial/crafting-subtle-realistic-user-interfaces.php" target="_blank">《Crafting Subtle & Realistic User Interfaces》</a>。它算是比较系统地剖析了如何生成高度 subtle realistic 的UI。

其中最生动的对比演示技巧，就是这个噪点的运用。在普通的纯色上运用1.2%的噪点，能够使材质更加仿真，有了流行的亚光质感。

<!--more-->

[<img loading="lazy" decoding="async" class="alignnone size-full wp-image-2849" title="noise" src="http://www.fanbing.net/wp-content/uploads/2010/02/noise.png" alt="noise" width="500" height="283" />][2]

**文末作者总结的几个技巧：**

  * 精致。避免模糊的线条和边缘处理。
  * 运用不透明（opacity）。如半透明黑白线条、发光、阴影等。现实世界没有什么是完全纯色的。
  * 使用参考线。
  * 不断尝试层样式（Layer Styles）。白色内发光使形状更流行。用混合选项增加生气和饱和度。
  * 慎用投影。一般而言，根据情况使用1-3px投影，0-3px距离。
  * 将复杂的PNG或GIF图形转换成智能对象（ Smart Object），再行调节，可保留色彩混合模式。
  * 在界面元素中使用样式时，要么都在上方（黑色1px投影），要么都在内部嵌入（白色1px投影）。
  * 现实世界物体很少有完美的直角。设计中要适当运用圆角。
  * 现实世界的一切物体都有阴影（除非你要绘制吸血鬼）。如果你绘制的物体有深度或置于其他物体上，最好加上投影。

现在再去阅读网上那些教授制作苹果风格UI的教程，就更游刃有余了。

 [1]: http://www.fanbing.net/wp-content/uploads/2010/02/finalcutserver.png
 [2]: http://www.fanbing.net/wp-content/uploads/2010/02/noise.png