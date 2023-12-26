---
title: 使用 Alfred Workflow 制作日文单词翻译器
author: XDash
type: post
date: 2014-03-28T02:44:40+00:00
url: /alfred-workflow-programming-tutorial.html
wiziapp_push_message:
  - New Post Published
is_send_wiziapp_push:
  - 'true'
wiziapp_processed:
  - 1
categories:
  - Coding
tags:
  - alfred
  - programming
  - tutorial

---
[Alfred][1] 是  Mac 下一款强悍的系统增强工具，可以快速启动+搜索本地和网络任意内容。购买其付费版本的 Power Pack 还能启用 Workflow 功能，使用一门常用的脚本开发语言就能编写自己的工作流来实现各种有趣的插件。（[这里][2]有国人收集的很多现成的 Workflow 插件下载）

<img loading="lazy" decoding="async" style="margin-left: auto;margin-right: auto" title="Screen Shot 2014-03-27 at 6.47.15 PM .png" src="http://www.fanbing.net/wp-content/uploads/2014/03/Screen-Shot-2014-03-27-at-6.47.15-PM-.png" alt="Screen Shot 2014 03 27 at 6 47 15 PM" width="500" height="219" border="0" /> 

今天心血来潮花了17英镑购买了 license，搜刮了几个自己可能用到的脚本，顺便研究了下如何进行 Alfred 脚本编写。只需简单的 PHP 就能完成一个 workflow。

这里以编写一个 Alfred 里的日文单词翻译器为例，简单介绍下流程。

基本原理：获取用户在 Alfred 内输入的内容（日文单词） -> POST 到百度云提供的翻译 API 获取翻译结果 -> 解析结果 -> 调用 Alfred Workflow 的方法输出成 Alfred 格式。

完成之后的效果是这样的：

<img loading="lazy" decoding="async" style="margin-left: auto;margin-right: auto" title="Screen Shot 2014-03-27 at 7.07.24 PM .png" src="http://www.fanbing.net/wp-content/uploads/2014/03/Screen-Shot-2014-03-27-at-7.07.24-PM-.png" alt="Screen Shot 2014 03 27 at 7 07 24 PM" width="500" height="113" border="0" /> 

<!--more-->

### 开发实现流程：

**一、创建新的 Workflow**

点击左下角加号，选择“Blank Workflow”。

<img loading="lazy" decoding="async" style="margin-left: auto;margin-right: auto" title="Screen Shot 2014-03-27 at 6.44.47 PM .png" src="http://www.fanbing.net/wp-content/uploads/2014/03/Screen-Shot-2014-03-27-at-6.44.47-PM-.png" alt="Screen Shot 2014 03 27 at 6 44 47 PM" width="500" height="302" border="0" /> 

**二、填写 Workflow 信息**

随便写写即可。

<img loading="lazy" decoding="async" style="margin-left: auto;margin-right: auto" title="Screen Shot 2014-03-27 at 7.15.44 PM .png" src="http://www.fanbing.net/wp-content/uploads/2014/03/Screen-Shot-2014-03-27-at-7.15.44-PM-.png" alt="Screen Shot 2014 03 27 at 7 15 44 PM" width="500" height="369" border="0" /> 

**三、设置脚本参数**

点击空白 Workflow 右上角的加号按钮，Inputs -> Script Filter，弹出如下窗口。

<img loading="lazy" decoding="async" style="margin-left: auto;margin-right: auto" title="Screen Shot 2014-03-27 at 7.17.13 PM .png" src="http://www.fanbing.net/wp-content/uploads/2014/03/Screen-Shot-2014-03-27-at-7.17.13-PM-.png" alt="Screen Shot 2014 03 27 at 7 17 13 PM" width="500" height="434" border="0" /> 

  * Keyword：激活某个 Workflow 的关键词，输入之后加参数即可完成整套动作。勾选后面的“with space”并在下拉框选择“Argument Required”代表必须附带参数。（因为我们是查日文单词，如果压根不给出单词那还玩个球）
  * Place Hoder Title：输入关键词后出现的标题，告知用户现已启用的 Workflow。
  * Place Holder Subtext：附带字符串，随便说点什么。
  * “Please wait” Subtext：执行命令时（例如从网络获取数据时）显示的文字。
  * Language：因为我用PHP，所以选 /user/bin/php。
  * Escaping 不需改动。
  * 图标：随便选一个图拖拽到“Drop an icon above.”区域。我顺便将这个 icon 保存到了工程目录下，命名为 icon.png（下文脚本需要）。

**四、复制 PHP 库文件**

点击 Save 按钮上方的 Open workflow folder，将进入当前 Workflow 的本地工程目录。切换到上层，再进入其下的其他目录下复制一个 workflow.php 回来。（解析 PHP 脚本所需的库文件，默认在工程目录下不会有，所以需要从现有的其他工程目录里拷一个，如果找不到可以直接从[这里][3]取）

**五、Script 区域输入代码**

因为比较简单，所以直接上代码（你也可以从[这里][4]获取）：

    require('workflows.php');
    
    // Settings
    define('TRANS_QUERY_URL','http://openapi.baidu.com/public/2.0/bmt/translate?client_id=Vn8ockFtPxNM655RP4iVWixU&from=auto&to=auto&q=');
    
    // Main Phrase
    $wf = new Workflows();
    $query = "{query}";
    $json = json_decode($wf->request(TRANS_QUERY_URL.$query));
    
    // Fetch Result
    foreach ($json->trans_result as $translation):
    $result['src']  =   $translation->src;
    $result['dst']  =   $translation->dst;
    $wf->result(1, 'http://www.baidu.com',$result['dst'],$query,'icon.png','yes');
    endforeach;
    
    // Export Results
    echo $wf->toxml();
    

**六、设置动作**

点击 Save 保存上述脚本。

返回编辑区，点击右上角加号，选择“Actions->Open URL”，在弹出窗口的 “URL：”里填入“{query}”，保存。将编辑区出现的两个模块拖动连接。

至此整个过程完毕。

现在，激活 Alfred（我设置为双击 Command 键），输入“jp [日文单词]”，就能调用百度翻译的 API 查看到单词释义了。

另外我还做了个游戏王卡牌查询的 Alfred 脚本，[代码在此][5]。

[<img loading="lazy" decoding="async" src="http://www.fanbing.net/wp-content/uploads/2014/03/Screen-Shot-2014-03-27-at-4.36.02-PM--500x341.png" alt="游戏王卡牌查询 for Alfred" width="500" height="341" class="alignnone size-medium wp-image-5335" srcset="http://xdash.one/wp-content/uploads/2014/03/Screen-Shot-2014-03-27-at-4.36.02-PM--500x341.png 500w, http://xdash.one/wp-content/uploads/2014/03/Screen-Shot-2014-03-27-at-4.36.02-PM-.png 653w" sizes="(max-width: 500px) 100vw, 500px" />][6]

整体说来，Alfred Workflow 的编写跟微信公众平台开发比较类似，要做的无非就是输入什么、如何处理及输出什么，没有特别复杂高深的东西，主要还是看想象力。

 [1]: http://www.alfredapp.com/
 [2]: http://www.alfredworkflow.com/
 [3]: https://github.com/xdash/Alfred_Workflow/blob/master/workflows.php
 [4]: https://github.com/xdash/Alfred_Workflow/blob/master/JP2CN.php
 [5]: https://github.com/xdash/Alfred_Workflow/blob/master/YuGiOh%20Card%20Search.php
 [6]: http://www.fanbing.net/wp-content/uploads/2014/03/Screen-Shot-2014-03-27-at-4.36.02-PM-.png