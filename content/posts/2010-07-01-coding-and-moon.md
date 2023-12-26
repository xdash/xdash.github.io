---
title: 低头编程，别忘了抬头赏月
author: XDash
type: post
date: 2010-06-30T17:43:55+00:00
url: /coding-and-moon.html
views:
  - 1524
categories:
  - Product
  - UED / CSS+DIV
tags:
  - ue
  - 产品设计
  - 技术
  - 用户体验
  - 设计

---
大致上，一款互联网产品的好坏，可以从其URL结构上窥见一斑。当一款新产品呈现在用户面前时，挑剔的业内人士会从各自视点予以剖析，设计师看界面，程序员看技术，工程师看架构。而好的产品，通常在URL上即给人以精心策划过的感觉。**设计师看得出美感，程序员看得出逻辑，工程师看得出层次。**皆大欢喜。

豆瓣读书上通常的条目URL形式是：<a href="http://book.douban.com/subject/4741216/" target="_blank">http://book.douban.com/subject/4741216/</a> ，子域名，主域名，条目，ID，分门别类一目了然（网上专门研究豆瓣URL的帖子 <a href="http://www.20ju.com/content/V139800.htm" target="_blank">1</a>、<a href="http://www.cnblogs.com/hhh/archive/2007/02/04/639249.aspx" target="_blank">2</a>）。<a href="http://jiepang.com" target="_blank">街旁</a>把主要页面都划归到 user 和 venue 二级分类下，上帝的归上帝，凯撒的归凯撒。<a href="http://readitlaterlist.com" target="_blank">ReadItLater</a> 的域名极尽简短之能事，login页面就一个l，恨不得省到姥姥家去。WordPress 也提供了自定义固定链接功能，按日期、按编号、按标题、按混合方式组织页面结构，供用户发挥个性、厘清组织，或是专门喂搜索引擎蜘蛛。

相比之下，虽然百度贴吧是百度一款较为成功的产品，但域名形式实在不敢恭维，明明是伪静态页面，却偏要弄成 <a href="http://tieba.baidu.com/f?kw=wow&fr=tb0_search&ie=utf-8" target="_blank">http://tieba.baidu.com/f?kw=wow&fr=tb0_search&ie=utf-8</a> 这样**高低起伏、中英混杂还带着参数符**的形式。人人网的一段视频分享的地址是这样的：<a href="http://share.renren.com/share/GetShare.do?id=2608517510&owner=243810774&ref=minifeed&sfet=110&fin=2" target="_blank">http://share.renren.com/share/GetShare.do?id=2608517510&owner=243810774&ref=minifeed&sfet=110&fin=2</a> 。经过测试，其中很多参数并不必要，仅保留id而删除后面的owner、ref、sfet、fin几个参数，并不影响用户观看视频，对页面呈现似乎也没有什么改变。

我在大一曾经参加过一个WAP手机论坛项目的创业社团，担任程序开发。当时在设计之初并未进行深度规划，只是走一步看一步，今天写个 reg.asp，明天增加了 display.asp，后天需要 user\_info.asp，大后天发现 display.asp 放到 bbs/ 子目录下比较好，reg.asp 改为 user\_reg.asp 更清晰，最后改得灰头土脸，繁琐异常。

<!--more-->结果，虽然用户在手机屏幕上用WAP访问时并不关注URL，但实际上，地址结构是非常混乱和冗长的，并且我怀疑单在传输URL这一项上，就无故浪费了用户许多字节的流量（当时手机上网还是很贵）。

因此，我想说的是：

1、一款产品是否有诚意，以及是否有可能取得日后成功，从它设计之初对URL的设计，就已能三岁看老。

2、好的URL形式，应该是层级少（三级以内）、简短易记（admin，而不必 administration）、形式统一（字母，或数字，而非二者结合）、内涵一目了然（userid，而不是usernum）。

3、**模块化**和**可扩展性**，必须列入产品设计之初的讨论范畴。

4、不要陷入技术 or 设计的二元思维。二者并不矛盾，并不是非得要会用Excel来画超级马力，或是向苹果家族产品看齐，才算融合了技术与设计的真髓。程序员应当有意识地在coding中培养艺术美感（最典型的例子莫过于代码中“留白”对日后解读时的帮助），设计师则需要适度锻炼逻辑思维。二者并不是迥然对立，只是术业专攻的侧重点不同，**应是阴阳互补，而非水火难容**。

5、产品的用户体验不仅仅是设计是否美观，元件摆放位置是否科学，也包括了是否采用适当的技术、是否有清晰的层次组织、是否有明确反馈、是否能返回满足需求的结果等。那些**将体验混同于界面的说法，纯属bullshit**。

6、技术宅们，低头编程，别忘了抬头赏月。