---
title: Airbnb是如何通过Growth Hack逐步成长起来的？
author: XDash
type: post
date: 2014-09-12T14:09:48+00:00
url: /how-airbnb-bloom-via-growth-hack.html
categories:
  - Blog Media
  - Work++
tags:
  - growth hacker
  - works

---
// 本文为我正在写作中的新书的案例章节之一，在此放出供大伙儿试读参考。欢迎各位不吝赐教，帮助我更好地把握这本书的内容。

2007年，住在美国旧金山的两位设计师——Brian Chesky与Joe Gebbia正在为他们付不起房租而困扰。为了赚点外块，他们计划将阁楼出租出去。传统的做法是在Craigslist网站发帖子。“但我们不想这么干，因为在Craigslist发千篇一律的帖子会显得冷冰冰的，于是我们打算自己动手建一个网站。”

当时城里正好举办一个设计展，周边的旅馆都被订满了。他们便很快搭建好了一个简易的网站，招徕开“家庭旅店”的生意。网站上包含地板上摆放的三张空气床垫的照片，以及供应家庭自制早餐服务的承诺。很快他们获得了3个租客，每位支付了80美金。一周后，他们开始陆续收到世界各地人们的电子邮件，询问何时能在世界其他热门旅游目的地享受这样的服务，包括布宜诺斯艾利斯、伦敦、日本。

他们于是将这一做法复制到其他大型集会，如SXSW，并允许人们通过信用卡在线支付。在2008年民主党全国集会期间，奥巴马在科罗拉多州的丹佛发表十万人演说。当时全市只有三万余个旅馆房间，于是Airbnb适时地选择再度在公众面前高调曝光，一度获得了极高的流量和关注——尽管此后相当一段时间内又逐渐归于沉寂。

[<img loading="lazy" decoding="async" src="http://www.fanbing.net/wp-content/uploads/2014/09/airbnb_google_traffic-500x121.jpg" alt="airbnb_google_traffic" width="500" height="121" class="alignnone size-medium wp-image-5459" srcset="http://xdash.one/wp-content/uploads/2014/09/airbnb_google_traffic-500x121.jpg 500w, http://xdash.one/wp-content/uploads/2014/09/airbnb_google_traffic.jpg 582w" sizes="(max-width: 500px) 100vw, 500px" />][1]

七年之后，当年的Aired & Breakfast已经成为了享誉全球的Airbnb。其夜间租住的房间预定量甚至一举超过了酒店巨头希尔顿。截止2014年春，Airbnb拥有全球超过1000万用户、55万间房间，以及100亿美金的估值。

<!--more-->

### 早期的资金募集

2008年项目创立之初，几位创始人需要想办法获取启动资金。起初他们试图靠自己做边缘业务来养团队，就买来大量的盒装麦片，并重新设计了两种总统选举主题的包装盒——奥巴马款和麦凯恩款。他们在秋季展会上以每盒40美元的价格销售这两款麦片，最终卖出500多盒，为他们的项目筹集了约3万美金。

但这些钱对于他们而言仍然不够。选举的结果最终尘埃落定后，他们还不得不设法处理掉所有麦凯恩款包装盒的剩余尾货。这让几位创始人焦头烂额，一度陷入低谷。这次不算成功的试水淋漓尽致地反映了小公司早期为了生存而不得不努力尝试任何可能性。

次年春天，他们终于得以与硅谷创业教父Paul Graham共进晚餐。尽管Graham坦承“我觉得这个点子简直太疯狂了……怎么会有人想到做这么一件事？”但Airbed & Breakfast还是得以加入了由Graham一手创建的创业孵化器——Y Combinator的2009年冬季班，且获得了2万美元的投资。拿到钱后，项目正式改名为Airbnb，很快又获得了另一笔60万美元的种子基金。

尽管融资成功，市场上依然有投资人看不懂他们的商业模式，或是对两位创始人同属设计师背景不为看好。

### 从现有平台挖掘新用户

当时该领域最大的竞争对手Craigslist拥有Airbnb羡艳的海量用户基数。尽管Airbnb一直试图靠塑造差异化的产品形态来将自己与竞争对手区隔起来，但一个不可否认的事实是：对于订客房这样的供需平台服务而言，用户数的多少是人们选择的最重要因素，因为供方会选择潜在消费者最多的平台发布信息，而消费者也会挑货品足够充足的市场来比价下单。

意识到这点后，Airbnb将Craigslist的用户群视作了一块肥肉，试图从中分一杯羹。于是他们推出了一项功能：允许用户在Airbnb发布信息的同时，方便地将信息内容拷贝一份发布到Craigslist上——尽管Craigslist并没有提供这样的现成接口。

据工程师Rishi Shah介绍，当时针对Craigslist的这一hack技巧其实并不怎么费事。由于当时Craigslist通过网址中的一串明文的参数结构来保存列表内容（而不是使用cookie），所以Airbnb写了个机器人去访问并解析网址，在其中加入特定的信息，再将修改后的网址转交给用户用于发布。

[<img loading="lazy" decoding="async" src="http://www.fanbing.net/wp-content/uploads/2014/09/airbnb_implementation_craigslist.jpg" alt="airbnb_implementation_craigslist" width="472" height="252" class="alignnone size-full wp-image-5460" />][2]

用户在Airbnb发布信息，随后会收到一封电子邮件，内容是告知用户：将该信息同时发布到Craigslist可以帮助每月增加高达约500美元的收入，您只需要点击这个链接，我们就可以为您完成。

于是用户往往会不假思索地点击链接，毕竟这没什么不好的，反倒是省了很多事。

接下来，Airbnb的机器人会自动执行一些动作，除了原封不动地拷贝内容之外，还需要做一些深加工，比如选择投递到Craigslist的哪个分类目录下，以及选择一个当前所在的地理位置。这项苦差事对工程师而言着实需要花费一番体力，因为要对被抓取对象给出的每一个目录选项，或是州县市及其对应的邮编做一一对应。此外机器人还需要对匿名邮件地址做屏蔽、绕过禁止HTML代码限制等。

工程师Chen回忆说：“这些工作很细碎，我甚至觉得一些非常聪明的技术达人也需要花不少时间来把它做到尽善尽美。传统的市场推广负责人应该根本想不到这个技巧，里面包含了太多的技术细节需要攻克。估计也只有被要求从Craigslist上获取用户的工程师才能想到了吧。”

这次成功的技术营销为Airbnb带来了几大回报：首先，更多来自Craigslist的回流撑起了Airbnb的人气，更多人加入注册，发布更多租出的信息；其次，原本习惯去Craigslist发布信息的用户，开始变成Airbnb的用户，因为现在只要在一处发布就能同时出现在两处；最后，原本的Airbnb用户的黏性更强了，因为他们确确实实在这里获得了更多的收入。

### “借花献佛”利用第三方邮件系统

Airbnb从Craigslist“挖墙脚”的另一个不太厚道的做法是，使用他们的Email通知系统给自己打广告。

Airbnb会检测发布到Craigslist的新招租信息，然后模拟成客户给屋主“留言”，推荐Airbnb的服务。通过Craigslist自动的Email通知系统，屋主也会收到这样一封邮件，信中告知说：我非常喜欢你发布的这则招租信息中的房间，你把它也发布在Airbnb上吧，这里可是每月有超过300万次的页面浏览量呢。

[<img loading="lazy" decoding="async" src="http://www.fanbing.net/wp-content/uploads/2014/09/airbnb_spam_email-500x270.jpg" alt="airbnb_spam_email" width="500" height="270" class="alignnone size-medium wp-image-5461" srcset="http://xdash.one/wp-content/uploads/2014/09/airbnb_spam_email-500x270.jpg 500w, http://xdash.one/wp-content/uploads/2014/09/airbnb_spam_email.jpg 800w" sizes="(max-width: 500px) 100vw, 500px" />][3]

虽然这一做法相比之前的技巧逊色很多，也的确从某种意义上构成了垃圾邮件，但不可否认的是在早期帮助Airbnb成长的更快，且几乎是零成本。

### 好卖相带来好收益

此前提到，Airbnb在雏形阶段曾成功吸引到3位前来旧金山参会的旅客，并在此后开始陆续收到来自世界各地的人们的住宿需求，提出他们想去的城市并建议Airbnb设点。可以说，Airbnb得以迅速发展成如此体量，是因为人们的确有这样强烈普遍的刚需，而Airbnb的服务满足了他们。

随着公司的发展，到2009年，Airbnb开始筹措乔迁新居。在寻找一手房源的过程中，他们发现那年夏天的成交情况其实并不十分可观。于是Gebbia和Chesky着手调研此事，他们四处飞行，总共在24家不同的家庭旅店订房体验，试图找出问题根源。

最后水落石出：许多在Airbnb上招租的人，并不懂得如何在发布内容时尽可能地展现出房间最好的一面。他们拙劣的拍摄技术和糟糕的文案组织，掩盖了房屋本身的优势，让远在世界另一头的人们隔着屏幕难以做出判断。“好吧，这事一点也不奇怪，没有人会为了不知道会买到的什么玩意儿而付钱。”Chesky说，“一般网站的做法是给用户群发邮件，教会他们如何去拍照，并给他们评估打分。”

但Airbnb采用了一种看似低效，实则奏效的方式。他们花5000美金租借了一部高档相机，挨家挨户免费为纽约的许多招租者的房屋拍摄照片。于是很快纽约的订房量上涨了两三倍，月底时Airbnb在当地的收入整整增加了一倍。这一做法很快被复制到了巴黎、伦敦、迈阿密等地。

2010年夏天，他们正式成立了专门的项目，为屋主提供拍摄服务。任何屋主都可以事先预约一位专业级的摄影师上门拍照。起初Airbnb签约了20位摄影师，这在当时又引发了一次流量井喷。

[<img loading="lazy" decoding="async" src="http://www.fanbing.net/wp-content/uploads/2014/09/aibnb_photograph_program-500x283.jpg" alt="aibnb_photograph_program" width="500" height="283" class="alignnone size-medium wp-image-5462" srcset="http://xdash.one/wp-content/uploads/2014/09/aibnb_photograph_program-500x283.jpg 500w, http://xdash.one/wp-content/uploads/2014/09/aibnb_photograph_program.jpg 548w" sizes="(max-width: 500px) 100vw, 500px" />][4]

虽然启动这个项目对创业公司而言费用不菲，但创始人深谙其带来的长远利益：受益于专业摄影师拍照的房屋相较同类能获得两到三倍的订单量，并且Airbnb随后也能从屋主那里额外得到每月约1025美金的分成，这绝对值回票价。到2012年，已经有2000余位自由摄影师受雇于Airbnb，在六大洲拍摄了超过13000间房屋。

在亲赴现场拍摄的过程中，Airbnb也得以从线下接触到典型用户，这为日后产品的发展打下了稳固基础。

### 打通社交关系链

Airbnb这一新兴模式的好处显而易见，人们往往可以便宜30%-80%的价格入住家庭旅店，而不必破费预订专业的酒店宾馆，并且还能与当地人交流结识，成为朋友。

但也有尖锐的媒体指出，如果这一模式成为主流，那么不法分子借机从事盗窃、抢劫、非法集会等犯罪活动也将得益于这一体系，这将会使世风日下，制造恐惧与堕落。如果的确存在这一隐忧，那么Airbnb也势必无法做大。

媒体的担忧不无道理，Airbnb若想继续成长，就必须面对用户之间的相互信任问题。于是在2011年夏天，Airbnb开放了社交网络连接功能，允许用户接入他们的Facebook账号。

当启用社交网络连接功能后，人们可以看到与房主之间的共同好友是谁，或是哪些人曾经租住了这间房。人们也可以根据屋主的地理位置、性别等参数进行搜索，找出感兴趣的房源。为了保护隐私，这项功能既可以设定为只对所有已登记自己社交网络的用户开放，也可以完全关闭。

当这一产品特性上线后，Chesky很快宣布，Airbnb上已有16,516,967对好友关系，并且持续猛增。在通过社交网络解决了最基本的人与人之间的信任问题后，人们得以轻松自在地事先考察屋主的背景资料，选择合适的入住对象。来自同一座城市、同一所大学、同一个街区的好友之间的联系与交易也更为紧密。

### 星 VS 心

2012年夏天，Airbnb重新设计了“心愿列表（Wish Lists）”功能。四个月后，45%的用户使用过该功能，累积创建了超过10万个心愿列表。

在此之前，心愿列表功能其实早已上线数年。但团队希望通过优化来探寻更多的可能性，看看是否还有提升的空间。在完成了一系列优化之外，团队特别尝试着将代表收藏功能的“星”形图标修改为一颗“心”。结果他们惊讶地发现，单凭这一个简单的小改动，就让用户的使用率提升了30%。

对此的一种解释是，这一改动使心愿列表从简单的功能价值过渡到了情感价值。人们不仅可以用它来标记自己中意的房间，以便在出行的之前对比和预定，还可以在雨霾风障的糟糕日子里或是焦头烂额的繁重工作外，在这里通过观看精美的照片，寻求片刻的宁静安详。这简直成了一种暂时逃离现实生活的手段。

### 拥抱移动

为了迎接移动互联网的趋势浪潮，Airbnb于2013年十月开始着手筹备专门的移动团队。

早在那年7月，Airbnb就已经允许屋主通过移动设备发布信息和上传照片。十月到来时，已经有约50%的用户在使用移动APP。这些人对客户需求的响应速度是非移动用户的3倍多，这意味着订单的成交率高出8倍。此后在对APP的改版中，又陆续加入和优化了其他功能，包括动态图片、地图定位、探索目的地等。

### 用户推广计划

2013年年底，Airbnb计划重新启动他们的用户推广计划（referral program）。这一计划之前被认定为“未充分利用”且“实际成效不佳”。Airbnb的产品增长部门经理Gustaf觉得这样的东西实在不值得骄傲。

[<img loading="lazy" decoding="async" src="http://www.fanbing.net/wp-content/uploads/2014/09/aibnb_referral_program-500x281.jpg" alt="aibnb_referral_program" width="500" height="281" class="alignnone size-medium wp-image-5463" srcset="http://xdash.one/wp-content/uploads/2014/09/aibnb_referral_program-500x281.jpg 500w, http://xdash.one/wp-content/uploads/2014/09/aibnb_referral_program.jpg 638w" sizes="(max-width: 500px) 100vw, 500px" />][5]

为了全面改造用户推广计划，他们先是调研了此前的数据，认真研究每一个推介与被推介的用户的使用行为及<span class='wp_keywordlink'><a href="http://www.baidu.com" title="权重" rel="nofollow" target="_blank">留存</a></span>情况，尝试预测什么样的人会转化成真实的用户。同时他们与业界有过成功案例的公司进行交流，探讨好的执行包含了哪些要素。

通过A/B测试对比通过Email、Twitter、Facebook和外链带来的流量特征，他们对文案进行调整，以确保推介邀请看上去像是在“给朋友优惠”，而不是乱发小广告。他们发现在推介内容中加入发送者的照片能提升这种好友之间送礼的感受。

另外，他们也发现通过Gmail和Anroid手机API调用通讯录获得的联系人，往往有更高的转化率，或许因为这些人彼此之间的联系更为密切。

通过A/B测试，他们还有一个关于推介文案的结论：给用户展示“利他”的文案，比“利己”的更容易带来转化。如图所示，告诉用户“邀请好友可以获得25美元”的效果就不如“给你的好友赠送25美元的旅行经费”更打动人。

[<img loading="lazy" decoding="async" src="http://www.fanbing.net/wp-content/uploads/2014/09/aibnb_referral_program_abtesting-500x320.jpg" alt="aibnb_referral_program_abtesting" width="500" height="320" class="alignnone size-medium wp-image-5464" srcset="http://xdash.one/wp-content/uploads/2014/09/aibnb_referral_program_abtesting-500x320.jpg 500w, http://xdash.one/wp-content/uploads/2014/09/aibnb_referral_program_abtesting.jpg 800w" sizes="(max-width: 500px) 100vw, 500px" />][6]

经过3个月的封闭开发和3万行代码的沉淀，Airbnb全新的用户推荐系统于2014年1月份正式上线，效果取得了明显的提升，在某些地区使订单量提升了高达25%。同时，这些被推介来的用户，相较普通用户而言，通常有更高的留存率，并且也更愿意继续推介其他人加入。

### 可控性高速发展

Airbnb的发展经历，引发投资人与国际媒体的侧目。《财富》杂志曾在2012年撰文评论，“不管按照哪种衡量标准，房屋租赁网站Airbnb的发展速度都显得太快了些。短短4年间，这家公司已经新增了约500名员工，估值达到13亿美元，在全球各地都开设了办事处。不久前Airbnb又在旧金山开设了新的办事处，还需要再招募700名员工。但最令人印象深刻的是人们使用这一服务的盛况：每晚都有5万人住在通过Airbnb网站预订的房间里。”

偶然成为CEO的Chesky此前可能并未料想到，自己在罗德岛设计学院学习设计，日后却凭借超凡的产品体验和新颖的增长策略引发了商业模式变革的新潮流。

“我们即将迎来互联网新一轮的发展浪潮。似乎无可避免的是，人们将逐步从线上世界走进线下的真实世界。而我们就是要在现实世界里再现人们在Facebook上的活动。”

看来，Airbnb在连通线上与线下的业务上，还将继续越走越远。

 [1]: http://www.fanbing.net/wp-content/uploads/2014/09/airbnb_google_traffic.jpg
 [2]: http://www.fanbing.net/wp-content/uploads/2014/09/airbnb_implementation_craigslist.jpg
 [3]: http://www.fanbing.net/wp-content/uploads/2014/09/airbnb_spam_email.jpg
 [4]: http://www.fanbing.net/wp-content/uploads/2014/09/aibnb_photograph_program.jpg
 [5]: http://www.fanbing.net/wp-content/uploads/2014/09/aibnb_referral_program.jpg
 [6]: http://www.fanbing.net/wp-content/uploads/2014/09/aibnb_referral_program_abtesting.jpg