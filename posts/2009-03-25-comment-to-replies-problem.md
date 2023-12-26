---
title: WP求助：关于评论回复的邮件通知功能
author: XDash
type: post
date: 2009-03-25T07:29:20+00:00
url: /comment-to-replies-problem.html
aktt_notify_twitter:
  - no
views:
  - 4150
categories:
  - Blog Media
tags:
  - comment
  - wordpress
  - wp
  - 评论回复
  - 邮件通知

---
评论回复后使用邮件发送通知给评论者，这是我一直很看重的WordPress的插件功能，也是有效提升博客粘性的一种常规的技术手段。只可惜最近我在<a href="http://www.fanbing.net/blog" target="_blank">新博客</a>配置这个功能时始终不得要领，非常郁闷。现征求各位的帮助，希望找出病症，对症下药，完成本人一直以来使用WordPress的夙愿之一（我决心从PJBlog切换到WP很大程度上就是因为PJ缺乏类似功能的插件）。

**问题症状：**

****我的WordPress2.7无论是安装了<a href="http://blog.2i2j.com/plugins/wordpress-thread-comment" target="_blank">Thread Comment</a>插件，或是<a href="http://www.thinkagain.cn/archives/989.html" target="_blank">Mail to Commenter</a>(均保证后台已经完成必要设置，比如打开开关，或是添加了相应代码），在回复了评论之后，都收不到任何的邮件通知。

使用Mail to Commenter后台的测试工具进行邮件发送的测试，结果依然是有去无回，杳无音信。使用<a href="http://www.callum-macdonald.com/code/wp-mail-smtp/" target="_blank">WP-Mail-SMTP</a>插件修改默认发送配置，最终也是以失败告终。

分别使用过GMail和QQ邮箱进行测试。二者均已开启了SMTP/POP3。

**服务器探针检测结果<span style="font-weight: normal;">（虚拟主机服务商保证已经开启了发送邮件的功能。并且我在同服务器的他的博客上尝试进行评论回复，他的确能收到邮件通知） ：</span>**

****

<span style="font-weight: normal;">PHP运行方式</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">CGI-FCGI模式</span>

<span style="font-weight: normal;">PHP版本</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">5.2.8</span>

<span style="font-weight: normal;">脚本运行可占最大内存</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">memory_limit</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">128M</span>

<span style="font-weight: normal;">脚本上传文件大小限制</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">upload_max_filesize</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">POST方法提交限制</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">post_max_size</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">8M</span>

<span style="font-weight: normal;">脚本超时时间</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">max_execution_time</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">30秒</span>

<span style="font-weight: normal;">PHP版本</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">5.2.8</span>

<span style="font-weight: normal;">运行于安全模式</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">不支持×</span>

<span style="font-weight: normal;">ZEND支持</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">支持√ 版本 2.2.0</span>

<span style="font-weight: normal;">PHPINFO</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">支持√ </span>

<span style="font-weight: normal;">自动定义全局变量(register_globals)</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">不支持×</span>

<span style="font-weight: normal;">显示错误信息(display_errors)</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">支持√</span>

<span style="font-weight: normal;">SMTP支持(smtp)</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">支持√</span>

<span style="font-weight: normal;"><!--more-->XML解析函数库(XML)</span>

<span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">支持√</span>

<span style="font-weight: normal;">FTP文件传输函数库(FTP)</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">支持√</span>

<span style="font-weight: normal;">允许使用URL打开文件(allow_url_fopen)</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">支持√</span>

<span style="font-weight: normal;">动态链接库(enable_dl)</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">支持√</span>

<span style="font-weight: normal;">IMAP电子邮件系统函数库</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">不支持×</span>

<span style="font-weight: normal;">历法运算函数库</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">支持√</span>

<span style="font-weight: normal;">压缩文件函数库(Zlib)</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">支持√</span>

<span style="font-weight: normal;">Session支持</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">支持√</span>

<span style="font-weight: normal;">Socket支持</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">支持√</span>

<span style="font-weight: normal;">正则表达式函数库 PREL</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">支持√</span>

<span style="font-weight: normal;">图像函数库(GD)</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">支持√ | 版本 bundled (2.0.34 compatible)</span>

<span style="font-weight: normal;">Iconv编码转换 iconv Functions</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">支持√</span>

<span style="font-weight: normal;">加密处理(MCrypt)</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">支持√</span>

<span style="font-weight: normal;">哈稀计算(MHash)</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">支持√</span>

<span style="font-weight: normal;">高精度数学运算(BCMath)</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">支持√</span>

<span style="font-weight: normal;">MySQL数据库</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">支持√</span>

<span style="font-weight: normal;">PostgreSQL数据库</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">不支持×</span>

<span style="font-weight: normal;">ODBC数据库</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">不支持×</span>

<span style="font-weight: normal;">Oracle数据库</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">不支持×</span>

<span style="font-weight: normal;">Hyperwave数据库</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">不支持×</span>

**我目前安装的插件：**

<span style="font-weight: normal;">中文 Dashboard</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">3.0</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">Add to Any: Share/Save/Bookmark Button</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">.9.5.2</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">Akismet</span>

<span style="font-weight: normal;">All in One SEO Pack</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">1.4.7.3</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">Dagon Design Sitemap Generator</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">3.16</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">Dean&#8217;s Permalinks Migration</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">1.0</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">Google XML Sitemaps</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">3.1.2</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">Hello Dolly</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">1.5</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">HelloFlash</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">0.1</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">Lightbox 2</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">2.8.2</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">Mail To Commenter</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">1.3.4</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">NextGEN Gallery</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">1.1.0</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">Simple Tags</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">1.6.4</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">Simple Tags : Extended Tagging for WordPress 2.3, 2.5, 2.6 and 2.7 ! Autocompletion, Suggested Tags, Tag Cloud Widgets, Related Posts, Mass edit tags ! 作者为 Amaury BALMER.</span>

<span style="font-weight: normal;">Twitter Tools</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">1.6</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">WordPress Database Backup</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">2.2.2</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">WordPress Related Posts</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">1.0</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">Generate a related posts list via tags of WordPress 作者为 Denis.</span>

<span style="font-weight: normal;">WordPress Thread Comment</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">1.4.9.3</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">WP-Cumulus</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">1.20</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">WP-PageNavi</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">2.40</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">WP-PostRatings</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">1.31</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">WP-PostRatings Widget</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">1.31</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">WP-PostViews</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">1.40</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">WP-PostViews Widget</span><span><span style="font-weight: normal;"> </span></span><span style="font-weight: normal;">1.40</span><span><span style="font-weight: normal;"> </span></span>

<span style="font-weight: normal;">WP-RecentComments</span>

<span style="font-weight: normal;">这个让我郁闷不已百思不得其解的问题已将我折磨得近乎暴走。希望各位有识之士有才之人，发表一些对此问题的看法，任何意见建议都希望丢出来。XDash在这里感谢各位的帮助。</span>