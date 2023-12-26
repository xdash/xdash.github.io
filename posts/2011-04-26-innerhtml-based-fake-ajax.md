---
title: InnerHTML 实现伪 AJax 效果
author: XDash
type: post
date: 2011-04-26T06:51:40+00:00
url: /innerhtml-based-fake-ajax.html
views:
  - 1569
categories:
  - UED / CSS+DIV
tags:
  - 代码
  - 创意
  - 前端
  - 技巧

---
最近在折腾毕设，希望给开发中的项目增加 Ajax 效果，通过异步加载和视觉反馈，以增强用户体验。

在了解了 Ajax 的原理（果然了解一件事物最好的方式是去了解其运作原理，最好是自己复刻一遍）之后，联想到此前玩 GreaseMonkey 时了解到的 InnerHTML 的用法，自作聪明地琢磨了一个**用 InnerHTML 实现 Ajax 效果的简单伪办法**。

事情是这样的。使用 Ajax，需要掌握 Javascript 编写技能，理解 XMLHttpRequest 对象，并且在与服务器的连接和响应确认上来回折腾。其实从功能实现层面来看，使用 Ajax 的目的无非在于：1）前台动态改变页面内容，以响应用户操作；2）后台处理数据，例如将某个值传递到数据库。

通过 InnerHTML ，稍加转换思路，完全可以另辟蹊径，通过以下淫荡技巧实现：

**1）前台动态改变页面内容。**这个对于 InnerHTML 而言再简单不过了。_tablerowObject.innerHTML=$str_ 语句就是用来改变页面中某个元素的内部代码。如 _document.getElementById(&#8220;div1&#8243;).innerHTML=&#8221;<strong>Hello World</strong>&#8221;_ 就是一个典型的实例。

**2）后台处理数据。**用 InnerHTML 同样可以实现，办法是 —— iframe！没错，用 InnerHTML 为页面新开一个 iframe（当然长宽调成0可使其隐藏而不显示在页面内），直接 src 到一个负责处理数据的带参数的页面，例如 do.php?action=add&message=aloha 。这个 do.php 负责接收参数并完成处理，比如将 aloha 这个字符串写进数据库。

以**编写一个简易版 Facebook 的 Like 按钮**举例。通过上述方法，编写的思路是：

  * 1）前台用 InnerHTML 将 X people like 中的 X 加 1 （此处 X 可能需事先从数据库读取）；
  * 2）InnerHTML 开个 iframe （地址形如 do.php?statue=12345&action=likeadd）；
  * 3）编写 do.php，获取参数，最终将数据库中编号为 12345 的这条状态的 like 数量 +1 。

此方法的适用场合：系统架构不复杂，传递的参数不多，对安全性和稳定性的要求不高，以及懒得写 Ajax（比如糊弄毕设这档子事儿） &#8230;