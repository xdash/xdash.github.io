---
title: 'PJBlog3动态模式下智能keyword&description标签达成！'
author: XDash
type: post
date: 2009-01-13T08:23:35+00:00
draft: true
private: true
url: /pjblog3动态模式下智能keyworddescription标签达成！.html
aktt_notify_twitter:
  - no
views:
  - 51
categories:
  - Blog Media

---
<img decoding="async" src="attachments/month_0901/12009113162314.jpg" border="0" alt="" />  
**Up&#100;ated 2009/2/12 此插件已经发布@ http://xdash.cn/article.asp?id=234**  
　　PJBlog动态模式由于调用同一个header.asp文件，造成

<meta />
标签下的keyword/description两个属性都是静态的，而不会随着日志内容的不同而产生不同的关键词和描述，很不利于SEO。一般不了解代码的用户甚至不知道自己的PJBlog默认的关键词和描述是PJBlog3,PuterJam这些原作者的信息。
  
　　同一个域名下多个页面相同的关键词描述，这个是很要命的，搜索引擎没准以为是同一个页面而不予收录。这方面WP的All in One SEO Pack插件就解决得很好。PJ没有这样的插件，更没有这样的插件底层。所以只能修改代码了。今天下午花了半个小时搞定。  
　　**主要思路**是让日志页面文件article.asp调用我自己写的header\_article.asp而不是默认的article.asp。header\_article.asp在输出meta keyword/description标签前根据request到的日志id，读取数据库，返回该id日志的Tag和content。再通过函数把Tag给序列化成&#8221;keyword1,keyword2,keyword3&#8243;的格式输出做keyword，content取前250字符去头尾去空格作为description。  
　　如果有人需要我可以给出源文件。很简单的东西。  
　　OK。现在每一篇日志终于有不同的关键词和描述了。搜索引擎的小蜘蛛们你们尽情地爬吧！  
</meta>