// 知乎数据（自动生成，请勿手动编辑）
// 最后更新: 2026-08-31T10:45:00+00:00

export const zhihuSnapshotUpdatedAt = "2026-08-31T10:45:00+00:00";

export interface ZhihuContent {
  type: 'answer' | 'article' | 'pin' | 'video' | 'question';
  title: string;
  url: string;
  summary: string;
  likeCount: number;
  commentCount: number;
  favoriteCount: number;
  createdAt: number | string;
  [key: string]: unknown;
}

export interface ZhihuStats {
  answerCount: number;
  articleCount: number;
  pinCount: number;
  videoCount: number;
  questionCount: number;
  totalLikes: number;
  totalComments: number;
  totalFavorites: number;
  totals: number;
}

export const zhihuContents: ZhihuContent[] = [
  {
    "type": "answer",
    "title": "收到了西北工业大学课题组的回信，我是否应该放弃科研，专注工程开发？",
    "url": "https://www.zhihu.com/answer/2077757686435861565",
    "summary": "这个回信的人一点礼貌都没有，不用跟他多掰扯了。",
    "likeCount": 1,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1788156035
  },
  {
    "type": "answer",
    "title": "当我们发现毕生追求的知识在AI面前毫无价值时，如何重建存在的意义？",
    "url": "https://www.zhihu.com/answer/2077570840271632365",
    "summary": "AI固然强大。但AI再强大也只是一个人类发明出来帮助人类改造世界的工具而已。 个人的感受是任何东西都替代不了的。 功利点的东西也是需要人和工具合作的。",
    "likeCount": 1,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1788111487
  },
  {
    "type": "pin",
    "title": "AI的能力确实是比世界上任何一个人都强的。如此强大的发动机需要懂得驾驭。",
    "url": "https://www.zhihu.com/pin/2077178385885929822",
    "summary": "AI的能力确实是比世界上任何一个人都强的。如此强大的发动机需要懂得驾驭。",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1788017919
  },
  {
    "type": "answer",
    "title": "光学工程（光学设计）博士已经有很多项目的情况下还有必要实习吗？",
    "url": "https://www.zhihu.com/answer/2076833210240087440",
    "summary": "个人觉得有会比没有好",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1787935623
  },
  {
    "type": "answer",
    "title": "对于一个理科生物类专业的，想学物理光学这本书，去学工程光学里的物理光学好，还是物理光学好？",
    "url": "https://www.zhihu.com/answer/1955682103816590858",
    "summary": "看你对什么方向更感兴趣吧，工程光学大部分都在讨论成像，就是各种镜头，各种镜头的组合，各种光学系统，怎么样描述、设计、评判这些镜头组合成的光学系统的优劣等等。物理光学对镜头讨论没那么多，但是对于光的本质，光的性质，我们怎么样描述以及运用讨论的比较多，内容更广泛，相对来讲更加深入一些（根本性质的深，而不是内容的深）。 看你啦",
    "likeCount": 1,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1759050948
  },
  {
    "type": "answer",
    "title": "光学中水平偏振光和垂直偏振光与o光和e光是一个东西吗？",
    "url": "https://www.zhihu.com/answer/1952395766413899739",
    "summary": "相对而言的，一束偏振光总可以分解为水平偏振光和垂直偏振光的叠加。在晶体中为了描述上的方便，就沿着o光和e光方向分解了。 当然o光和e光实质上是双折射晶体的一对本征解。但是理解到这里就可以解决问题了。可以重合，但不是一个东西。 分解是方法，是数学工具。 o光、e光是光在晶体中传播的规律，是物理特性。",
    "likeCount": 7,
    "commentCount": 1,
    "favoriteCount": 4,
    "createdAt": 1758267424
  },
  {
    "type": "pin",
    "title": "[图片] 有口皆碑 徽章佩戴留念，期待在知乎继续前行，探索无尽可能。",
    "url": "https://www.zhihu.com/pin/1948188285152232982",
    "summary": "[图片] 有口皆碑 徽章佩戴留念，期待在知乎继续前行，探索无尽可能。",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1757264282
  },
  {
    "type": "article",
    "title": "分享一个离线更新Arduino的ESP32库的方法",
    "url": "https://zhuanlan.zhihu.com/p/1911352839244092570",
    "summary": "我们首先进入库的github网站： espressif/arduino-esp32: Arduino core for the ESP32 在网站中找到最新的发行版本 [图片] 点击后就变成了这个页面 [图片] 拉到最下面找到JSON文件 [图片] 打开后的JSON文件长这个样子 [图片] 简单分析一下结构 [图片] Arduino中ESP32包的所有信息都在package里面，前面交代了基本信息，platforms里面是ESP32库所有版本的信息，tools是所有工具的所有版本，platforms里用到的所有的工具库的下载链接都可以在tools里面找到。我们进行更…",
    "likeCount": 32,
    "commentCount": 2,
    "favoriteCount": 9,
    "createdAt": 1748485339
  },
  {
    "type": "pin",
    "title": "[图片]",
    "url": "https://www.zhihu.com/pin/1863222461182664704",
    "summary": "[图片]",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1737006851
  },
  {
    "type": "pin",
    "title": "写的很好，受教了 如何从一个空有上进心的人，变成行动上的巨人？",
    "url": "https://www.zhihu.com/pin/1851415597377794049",
    "summary": "写的很好，受教了 如何从一个空有上进心的人，变成行动上的巨人？",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1734191876
  },
  {
    "type": "answer",
    "title": "为什么可见光是量子，而无线电波、红外线、微波不是量子？",
    "url": "https://www.zhihu.com/answer/7462414957",
    "summary": "可见光，无线电波，红外线，微波都是电磁波。按照经典理论的解释都是由电偶极子内部的相对运动辐射出的，量子理论中波也有量子的性质。你的困惑可能在似乎光才有对应的光子，而波长较长的电磁波似乎不存在“无限电波子”、“红外线子”、“微波子”等概念，一方面是因为测量的时候更多的是测了他们波动性的性质，自然可以测到的是波动性。更有本质的是，因为他们波长较长，相对而言，粒子性表现的并没有光子那么突出。应用起来更…",
    "likeCount": 1,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1729133499
  },
  {
    "type": "answer",
    "title": "双缝衍射中，若缝间距为d,缝宽为a,并且有d = 2a，则在单缝衍射中央亮区中含有几个明条纹？",
    "url": "https://www.zhihu.com/answer/5459337368",
    "summary": "这个直接d/a记住公式就好啦，具体细节可以查看光学书上多缝干涉的内容",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1728909622
  },
  {
    "type": "answer",
    "title": "为什么孔径角而不是入镜光强度决定分辨率？",
    "url": "https://www.zhihu.com/answer/5458122469",
    "summary": "如果把“分辨率”看成看出细节的能力，这个问题应该就迎刃而解了。",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1728909439
  },
  {
    "type": "pin",
    "title": "[图片] 好奇宝宝 徽章佩戴留念，期待在知乎继续前行，探索无尽可能。",
    "url": "https://www.zhihu.com/pin/1828988236183244800",
    "summary": "[图片] 好奇宝宝 徽章佩戴留念，期待在知乎继续前行，探索无尽可能。",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1728844776
  },
  {
    "type": "question",
    "title": "为什么有很多人会选择高校呢？",
    "url": "https://www.zhihu.com/question/851145786",
    "summary": "在很多地方，一谈教职就开始聊待遇，聊工资等问题。可是如果更关注待遇这些东西，为什么不一开始就选择相对薪资更高的企业呢？",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1728794710
  },
  {
    "type": "answer",
    "title": "一个关于波动的细节问题（书上说的没看懂），为什么？",
    "url": "https://www.zhihu.com/answer/4840748363",
    "summary": "根据 [公式] 函数的性质，里面的可以整体上正负号随便变，所以你指的那两个是初相位为 [公式] ，而传播方向不同的两个波。即 [公式] [公式] 一般我们认为波是从源点处向空间的其他方位传播，自然对应了 [公式] 的那个表达式。",
    "likeCount": 1,
    "commentCount": 0,
    "favoriteCount": 1,
    "createdAt": 1728694267
  },
  {
    "type": "answer",
    "title": "一束光的频率和光强有直接关系吗？",
    "url": "https://www.zhihu.com/answer/4713648554",
    "summary": "可以从微观角度理解。 我们知道电流是单位时间内单位面积上通过电荷 i=nesv，载流子是电子时。当换成其他载流子，则变成i=nqsv。 光强类似。I=nsvhv（nu，频率，用手机不太好编辑）。 会有影响，其他量相同的情况下，频率越高光强越大。",
    "likeCount": 1,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1728566707
  },
  {
    "type": "answer",
    "title": "左旋光和右旋光的传播会互相影响吗？",
    "url": "https://www.zhihu.com/answer/4713197543",
    "summary": "在张晓光老师的光纤通信系统中的偏振光学中提到，左右旋光是可以在旋光物质中稳定传播（即不发生本质变化）的两种光的模式，在书中张老师把这种性质的光称作本征光。文中还分析了双折射现象中的o光和e光，它们可以在双折射晶体中稳定传播，这两种光同样是本征光。",
    "likeCount": 2,
    "commentCount": 0,
    "favoriteCount": 2,
    "createdAt": 1728566307
  },
  {
    "type": "answer",
    "title": "焦距上任意一点发出的光经凸透镜折射后都会成为平行光线吗？",
    "url": "https://www.zhihu.com/answer/4712807101",
    "summary": "理想光学系统中是这样的。在有像差的情况下，不同离轴距离的光线的“焦点”会不同，这些焦点分布在理想焦点附近。",
    "likeCount": 1,
    "commentCount": 0,
    "favoriteCount": 1,
    "createdAt": 1728566085
  },
  {
    "type": "pin",
    "title": "[图片] 有求必应 徽章佩戴留念，期待在知乎继续前行，探索无尽可能。",
    "url": "https://www.zhihu.com/pin/1816216758245285889",
    "summary": "[图片] 有求必应 徽章佩戴留念，期待在知乎继续前行，探索无尽可能。",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1725799818
  },
  {
    "type": "pin",
    "title": "[图片] 圆环挑战 2024 徽章佩戴留念，期待在知乎继续前行，探索无尽可能。",
    "url": "https://www.zhihu.com/pin/1815898422177320963",
    "summary": "[图片] 圆环挑战 2024 徽章佩戴留念，期待在知乎继续前行，探索无尽可能。",
    "likeCount": 1,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1725723921
  },
  {
    "type": "answer",
    "title": "为什么部分偏振光通过偏振片后的光强是非相干叠加？",
    "url": "https://www.zhihu.com/answer/3618934768",
    "summary": "干涉要满足三个条件：稳定的相位差，振动方向相同，频率相同 部分偏振光是在某些方向上光波振动占优势的自然光。可以分解为自然光和线性偏振光的叠加。 这样，通过偏振片，即使振动方向由偏振片调控了，但是其他两个条件还是满足不了，所以是非相干叠加",
    "likeCount": 2,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1725723516
  },
  {
    "type": "answer",
    "title": "有一个复振幅叠加的问题，有大佬能帮我解答下吗？",
    "url": "https://www.zhihu.com/answer/3618927427",
    "summary": "为了计算方便，通常采取e指数进行计算，当具体取值的时候，取其实部。 根据欧拉定理，e指数上面的式子就是你那个正常余弦表达式的东西。 只是为了计算方便，当cos表达式进行理解就行了",
    "likeCount": 1,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1725722885
  },
  {
    "type": "answer",
    "title": "光的干涉条件是什么？",
    "url": "https://www.zhihu.com/answer/3618924371",
    "summary": "三点： 频率相同 相位 差恒定振动方向一致",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1725722640
  },
  {
    "type": "answer",
    "title": "为什么傅里叶分析（不是数字图像处理，而是现实世界）中图像边缘是图像高频分量？",
    "url": "https://www.zhihu.com/answer/3615987725",
    "summary": "今天弄明白了，我写下来供各位学习参考。 傅里叶光学（或者信息光学）是以“物”和“像”作为对象进行分析的。物面就是系统的输入，像面就是系统的输出。主要研究光的空间信息。更多的关注光的“空间频率”而非“时间频率”。研究关注的是光的二维信息，即一个相对来说比较大的平面上光强的分布情况。而非在一维时间上光强的有无（类似于高电平1和低电平0）。影响光强变动的偏振信息、波长/频率信息这些细节部分更不是傅里叶光学…",
    "likeCount": 21,
    "commentCount": 1,
    "favoriteCount": 13,
    "createdAt": 1725463123
  },
  {
    "type": "question",
    "title": "为什么傅里叶分析（不是数字图像处理，而是现实世界）中图像边缘是图像高频分量？",
    "url": "https://www.zhihu.com/question/665465623",
    "summary": "在数字图像处理中，边缘部位灰度值急剧变化，所以会有丰富的高频分量，这是显而易见的。 但是为什么我看了很多傅里叶光学、信息光学、光学等等的书，都是在脱离了数字图像灰度背景下，还说的边缘部分是高频分量，这难道与那个空间频率定义式不会有冲突吗？ 一直没理清，谢谢大家的帮助！",
    "likeCount": 0,
    "commentCount": 3,
    "favoriteCount": 0,
    "createdAt": 1724769728
  },
  {
    "type": "pin",
    "title": "请问伴随矩阵在几何空间的意义是什么？",
    "url": "https://www.zhihu.com/pin/1754468179714433024",
    "summary": "请问伴随矩阵在几何空间的意义是什么？",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1711077810
  },
  {
    "type": "pin",
    "title": "[图片] 这是我与知乎共同成长的 4 年。在这段时光里，我从知友们的知识、经验与见解中感受到了无穷力量，也汲取到了面对生活的无限灵感。未来岁月，让我们继续心怀好奇与勇气，去探索更大的世界吧。 #与知乎一起走过的日子 #与知乎相遇的第 4 年",
    "url": "https://www.zhihu.com/pin/1743145501619503104",
    "summary": "[图片] 这是我与知乎共同成长的 4 年。在这段时光里，我从知友们的知识、经验与见解中感受到了无穷力量，也汲取到了面对生活的无限灵感。未来岁月，让我们继续心怀好奇与勇气，去探索更大的世界吧。 #与知乎一起走过的日子 #与知乎相遇的第 4 年",
    "likeCount": 2,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1708378273
  },
  {
    "type": "answer",
    "title": "如何理解「时间常数（time constant）」这个概念？",
    "url": "https://www.zhihu.com/answer/3275974368",
    "summary": "其他答案好像并没有说出究竟是什么才让时间常数 [公式] 与众不同的。（能度量时间的数有很多，为什么偏偏要用 [公式] 呢？）我们可以先从一个光线性吸收的例子开始。 假设有一束单色平行光沿x方向通过均匀介质。（如图所示） [图片] 设光的强度在经过厚度为 [公式] 的一层介质时，强度由 [公式] 减为 [公式] 。实验表明，在相当广阔的光强范围内， [公式] 正比于 [公式] 和 [公式] ，有： [公式] 式…",
    "likeCount": 7,
    "commentCount": 0,
    "favoriteCount": 12,
    "createdAt": 1699031198
  },
  {
    "type": "pin",
    "title": "又到11月了",
    "url": "https://www.zhihu.com/pin/1702850588524638208",
    "summary": "我就说时间怎么过得这么快呢。 很少用知乎记笔记，从大一就开始用wolai了，最近居然开始按块进行收费了，只好转战知乎了，今天回答了第一个问题，感觉回答得还不错，哈哈哈。虽然可能没人看 然而我还在感慨时间好快，好快，真的好快，大一、大二、大三…… #人生感悟",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1698771217
  },
  {
    "type": "article",
    "title": "时间常数的重要意义",
    "url": "https://zhuanlan.zhihu.com/p/664413120",
    "summary": "介绍时间常数之前，我们可以先从一个光线性吸收的例子开始。 假设有一束单色平行光沿x方向通过均匀介质（如图所示）。 [图片] 设光的强度在经过厚度为 [公式] 的一层介质时，强度由 [公式] 减为 [公式] 。实验表明，在相当广阔的光强范围内， [公式] 正比于 [公式] 和 [公式] ，有： [公式] 式中， [公式] 是个与光强无关的比例系数，称为该物质的吸收系数。为了求出光束穿过厚度为 [公式] 的介质后…",
    "likeCount": 5,
    "commentCount": 2,
    "favoriteCount": 5,
    "createdAt": 1698770586
  },
  {
    "type": "answer",
    "title": "为什么许多与时间相关的物理量用1/e这一临界点来定义？",
    "url": "https://www.zhihu.com/answer/3272021932",
    "summary": "上面的回答很好，但是好像有点不够具体。这个问题，我之前也困惑了很久。 我们不妨以光线性吸收的例子开始。 假设有一束单色平行光沿x方向通过均匀介质（如图所示）。 [图片] 设光的强度在经过厚度为 [公式] 的一层介质时，强度由 [公式] 减为 [公式] 。实验表明，在相当广阔的光强范围内， [公式] 正比于 [公式] 和 [公式] ，有： [公式] 式中， [公式] 是个与光强无关的比例系数，称为该物质的…",
    "likeCount": 6,
    "commentCount": 0,
    "favoriteCount": 13,
    "createdAt": 1698766398
  },
  {
    "type": "question",
    "title": "相干为什么这么重要？",
    "url": "https://www.zhihu.com/question/625926209",
    "summary": "相干光、相干波.....还有很多没接触到的相干的东西，相干为什么这么重要？光电专业大三，对问题似乎有答案，但是有些模模糊糊，想听听更加体系、更加专业、更加有趣的答案",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1697167389
  },
  {
    "type": "answer",
    "title": "你人生庆幸明白的道理是什么?",
    "url": "https://www.zhihu.com/answer/2859774663",
    "summary": "世界是自己的。",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1674643649
  },
  {
    "type": "pin",
    "title": "#11月你好# 我爱你",
    "url": "https://www.zhihu.com/pin/1570919503851892737",
    "summary": "#11月你好# 我爱你",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1667316395
  },
  {
    "type": "answer",
    "title": "108天高考了，想冲刺985，如何调整？",
    "url": "https://www.zhihu.com/answer/2740263483",
    "summary": "。。",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1667315765
  },
  {
    "type": "question",
    "title": "想问一下何亦清听起来什么感觉?",
    "url": "https://www.zhihu.com/question/563798894",
    "summary": "大概是个男生还是女生的名字，听起来什么感觉？",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1667242525
  },
  {
    "type": "question",
    "title": "108天高考了，想冲刺985，如何调整？",
    "url": "https://www.zhihu.com/question/444976820",
    "summary": "高三期末：数学140，英语118，语文101，物理84，化学86，生物86，想冲刺985，感觉上课没什么收获，有什么好建议吗",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1613610085
  },
  {
    "type": "pin",
    "title": "",
    "url": "https://www.zhihu.com/pin/1257297546676097024",
    "summary": "",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1592543094
  },
  {
    "type": "pin",
    "title": "",
    "url": "https://www.zhihu.com/pin/1246155807207071744",
    "summary": "",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1589886696
  },
  {
    "type": "pin",
    "title": "",
    "url": "https://www.zhihu.com/pin/1244989586758717440",
    "summary": "",
    "likeCount": 0,
    "commentCount": 0,
    "favoriteCount": 0,
    "createdAt": 1589608648
  }
];

export const zhihuStats: ZhihuStats = {
  "answerCount": 20,
  "articleCount": 2,
  "pinCount": 14,
  "videoCount": 0,
  "questionCount": 5,
  "totalLikes": 93,
  "totalComments": 9,
  "totalFavorites": 60,
  "totals": 41
};
