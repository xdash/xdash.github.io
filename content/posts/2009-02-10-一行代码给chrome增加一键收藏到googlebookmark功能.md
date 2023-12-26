---
title: 一行代码给Chrome增加一键收藏到GoogleBookmark功能
author: XDash
type: post
date: 2009-02-10T12:25:52+00:00
draft: true
private: true
url: /一行代码给chrome增加一键收藏到googlebookmark功能.html
aktt_notify_twitter:
  - no
views:
  - 350
categories:
  - Web 2.0

---
谁说谷歌<strike>精灵球</strike>浏览器Chrome不能装插件的，通过书签也能很方便地曲线救国，其强大未必逊色在IE浏览器下安装Digg插件，而且简单的超乎想象。  
<img decoding="async" alt="你拍攝的 BM。" src="http://farm4.static.flickr.com/3380/3269388902_99e04a9d66.jpg?v=0" />  
**新建一个书签，名称任意，网址部分输入以下内容：  
** <span style="color: rgb(255, 0, 0); ">（由于博客显示问题我特意将其断行，请各位使用时将所有断行删除，即整段作为一行输入）</span>  
javascript:%28function%28%29%7Bvar%20a%3Dwindow%2Cb%3Ddocument%2Cc%3  
DencodeURIComponent%2Cd%3Da.open%28%22http://www.google.com/bookmarks/mark?op=edit&output=popup&bkmk=%22%2Bc%28b.location%29%2B%22&title=%22%2Bc%28b.title%  
29%2C%22bkmk_popup%22%2C%22left=%22%2B%28%28a.screenX%7C%7Ca.screenLeft%  
29%2B10%29%2B%22%2Ctop=%22%2B%28%28a.screenY%7C%7Ca.screenTop%29%2B10%  
29%2B%22%2Cheight=420px%2Cwidth=550px%2Cresizable=1%2CalwaysRaised=1%22%29%  
3Ba.setTimeout%28function%28%29%7Bd.focus%28%29%7D%2C300%29%7D%29%28%29%3B  
完成！以后再撞见自己喜欢的网页，点击这个按钮，即会跳出GoogleBookmark的收藏填写表单了（当然需要登陆Google账号）。  
<img decoding="async" alt="你拍攝的 bookmark。" src="http://farm4.static.flickr.com/3005/3268611695_93e692630b.jpg?v=0" />