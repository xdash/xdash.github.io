---
title: Mac 下使用 Python + Selenium 的几则避坑经验
author: XDash
type: post
date: 2020-06-05T16:57:53+00:00
url: /using-selenium-with-python-on-mac.html
categories:
  - Coding
  - Geeky
tags:
  - Python
  - Selenium

---
最近研究 Mac 下运用 Python + Selenium，记录遭遇的几例经典避坑。

**问题一：想自动控制的浏览器是 Safari，但问题是：Safari （版本号 13.1）默认仅会启动 Incognito(Private) Browsing 的独立新窗口（隐身模式），也就是不带任何浏览器的 cookies、缓存等用户预设信息，这极不方便伪造既有身份完成（诸如抓取仅限会员查看的资料等）动作。怎么办？**

解法：从官方到民间搜了一圈，Safari 没有其他设置方法（可能是苹果出于安全考量）或 hack 野路子，只能作罢。换用 Google Chrome，因其体态轻盈、设置丰富。（搁到我另一台服务器 Ubuntu 桌面版下自然就是 Chromium）

**问题二：我的 Google Chrome 自动升级到了 V85，但是 Mac + Python + Selenium 必备的文件 ChromeDriver（WebDriver for Chrome，https://sites.google.com/a/chromium.org/chromedriver/downloads）最新只支持到 V84，怎么办？**

解法：无他，卸载 Chrome V85，重装回随手找到的旧版 V81，于是原本报错的代码果然跑起来了。额外提示，这里千万记得将 Chrome 设置成「不要自动升级」，以免夜长梦多，方法是：关闭 Chrome，进入目录 /Library/Google/GoogleSoftwareUpdate ，删除该目录下的 GoogleSoftwareUpdate.bundle 即可。

**问题三： Chrome 自动执行开始，默认依然是打开类似隐身模式的独立窗口，我想要自动带上当前浏览器用户的身份信息，怎么做？**

解法：

<pre class="wp-block-code"><code># 需要先命令行下 pip install webdriver_manager.chrome
from webdriver_manager.chrome import ChromeDriverManager_
from selenium.webdriver.chrome.webdriver import Options
opts = webdriver.ChromeOptions()
user_profile = '/Users/YourName/Library/Application Support/Google/Chrome'
opts.add_argument('user-data-dir=' + user_profile)
dr = webdriver.Chrome(ChromeDriverManager().install(),options=opts)
dr.get(url)</code></pre>

#上述 user_profile 变量是你的个人资料路径，可以在 Chrome 地址栏输入「chrome://version/」查看到。

**2020/06/16 Update：**上述问题三中一开始错加了的 Default 已经去掉（即原写「/Users/YourName/Library/Application Support/Google/Chrome/Default」，应该仅「/Users/YourName/Library/Application Support/Google/Chrome」。）