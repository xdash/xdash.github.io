---
title: 批量备份人人网照片到 Google Photos
author: XDash
type: post
date: 2021-01-19T13:27:22+00:00
url: /batch-backup-renren-gallery-to-google-photos.html
categories:
  - Diary
tags:
  - backup
  - google photos

---
记录下如何批量备份人人网照片（脑残青春不堪回首的黑历史）到 Google Photos / 自建 NAS：

1、Chrome 安装「人人网一键备份」扩展：https://chrome.google.com/webstore/detail/efddmnffdanhlbgmmblkpfbllampcijp

2、激活扩展，根据提示登录人人网，一键开始检测状态/日志/照片+下载打包成压缩包。

（上述步骤前，建议先手动点开几个相册，翻几页， 把被 frozen 的照片数据文件加载到 production 的服务器，否则有大概率缺漏照片）

3、上述状态打包到本地的照片，创建/修改时间都不是当年相册的时间（而是现在执行备份操作的系统时间）。 Mac 命令行批量修改创建时间的办法是：

touch -mt 201001151500 /Users/xdash/Downloads/人人网相册/照片/_  
_ 

4、最后直接拽到网页版 Google Photos 完成上传（可以直接拽一堆文件夹，自动上传文件夹里的照片），照片即被归入正确的 timeline。