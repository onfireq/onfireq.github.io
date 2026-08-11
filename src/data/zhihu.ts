// 知乎数据（自动生成，请勿手动编辑）
// 最后更新: 2026-08-11 13:14:42

export interface ZhihuContent {
  type: 'answer' | 'article' | 'pin' | 'video' | 'question';
  title: string;
  url: string;
  summary: string;
  likeCount: number;
  commentCount: number;
  favoriteCount: number;
  createdAt: string;
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

export interface ZhihuFollowee {
  name: string;
  url: string;
  avatar: string;
  bio: string;
}

export interface ZhihuFavorite {
  title: string;
  url: string;
  summary: string;
  createdAt: string;
}

export const zhihuContents: ZhihuContent[] = [
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
  "answerCount": 17,
  "articleCount": 2,
  "pinCount": 13,
  "videoCount": 0,
  "questionCount": 5,
  "totalLikes": 91,
  "totalComments": 9,
  "totalFavorites": 60,
  "totals": 37
};

export const zhihuFollowees: ZhihuFollowee[] = [
  {
    "Fullname": "学习有了方法",
    "UrlToken": "xue-xi-you-liao-fang-fa",
    "Url": "https://www.zhihu.com/people/xue-xi-you-liao-fang-fa",
    "AvatarUrl": "https://pic3.zhimg.com/50/v2-82722706b0068507774c5036104df8a6_l.jpg?source=f36c2686",
    "Headline": "专注于学习方法的研究，去我公众号「学习有了方法」可领取免费课",
    "Gender": 2,
    "FollowerCount": 26168
  },
  {
    "Fullname": "Mcuzone野芯科技",
    "UrlToken": "mcuzone",
    "Url": "https://www.zhihu.com/people/mcuzone",
    "AvatarUrl": "https://pic4.zhimg.com/50/v2-c787c82eb42a52a15c7a4fbee92a1d03_l.jpg?source=f36c2686",
    "Headline": "Power up the MCU",
    "Gender": 1,
    "FollowerCount": 391
  },
  {
    "Fullname": "思维有了模型",
    "UrlToken": "lan-chuan-dong-41",
    "Url": "https://www.zhihu.com/people/lan-chuan-dong-41",
    "AvatarUrl": "https://pic3.zhimg.com/50/v2-c7b0b2d6d8258bfb6433b7eeb361ab8b_l.jpg?source=f36c2686",
    "Headline": "所有文章首发于公众号「思维有了模型」。",
    "Gender": 2,
    "FollowerCount": 267856
  },
  {
    "Fullname": "铁匠",
    "UrlToken": "jicongmin",
    "Url": "https://www.zhihu.com/people/jicongmin",
    "AvatarUrl": "https://pic3.zhimg.com/50/v2-4482dae6c0848b21799af82acbb6cf35_l.jpg?source=f36c2686",
    "Headline": "纳米新材料从业者&amp;化学科普爱好者",
    "Gender": 2,
    "FollowerCount": 10140
  },
  {
    "Fullname": "三脚猫Frank",
    "UrlToken": "noobFrank",
    "Url": "https://www.zhihu.com/people/noobFrank",
    "AvatarUrl": "https://pic1.zhimg.com/50/v2-63efd41b3ea1168b7415242a66b6c435_l.jpg?source=f36c2686",
    "Headline": "我是一只无知的三脚猫",
    "Gender": 2,
    "FollowerCount": 24699
  },
  {
    "Fullname": "你给的糖",
    "UrlToken": "yi-ni-99-5-39",
    "Url": "https://www.zhihu.com/people/yi-ni-99-5-39",
    "AvatarUrl": "https://pic4.zhimg.com/50/v2-96d7c09da560f856e31da287c487db26_l.jpg?source=f36c2686",
    "Headline": "",
    "Gender": 2,
    "FollowerCount": 1
  },
  {
    "Fullname": "任杰",
    "UrlToken": "ren-51-7",
    "Url": "https://www.zhihu.com/people/ren-51-7",
    "AvatarUrl": "https://pic4.zhimg.com/50/v2-69ccbb0197f1e03f53ca964caee78daf_l.jpg?source=f36c2686",
    "Headline": "量子多体物理",
    "Gender": 2,
    "FollowerCount": 10852
  },
  {
    "Fullname": "momo",
    "UrlToken": "ni-ming-qun-zhong-97",
    "Url": "https://www.zhihu.com/people/ni-ming-qun-zhong-97",
    "AvatarUrl": "https://pic3.zhimg.com/50/v2-2725466f8fa7a318167ee2a74ccbfe86_l.jpg?source=f36c2686",
    "Headline": "github.com/momostudy",
    "Gender": 1,
    "FollowerCount": 34998
  },
  {
    "Fullname": "落叶红不扫",
    "UrlToken": "qi-xing-deng-87",
    "Url": "https://www.zhihu.com/people/qi-xing-deng-87",
    "AvatarUrl": "https://pic1.zhimg.com/50/v2-b49623e26e68db9da40ba104ab61f4d2_l.jpg?source=f36c2686",
    "Headline": "|落叶红不扫&gt; ",
    "Gender": 1,
    "FollowerCount": 630
  },
  {
    "Fullname": "小枣君",
    "UrlToken": "xzclass",
    "Url": "https://www.zhihu.com/people/xzclass",
    "AvatarUrl": "https://pic4.zhimg.com/50/v2-7ac7e6b620ff93998cc4e0363745fd2b_l.jpg?source=f36c2686",
    "Headline": "公号：鲜枣课堂。擅长领域：通信知识科普，通信职涯劝退。",
    "Gender": 2,
    "FollowerCount": 162350
  },
  {
    "Fullname": "小样Oak",
    "UrlToken": "ou-di-dong-ge",
    "Url": "https://www.zhihu.com/people/ou-di-dong-ge",
    "AvatarUrl": "https://pic3.zhimg.com/50/v2-60f22952c3647c9a7ef9d557c321bd69_l.jpg?source=f36c2686",
    "Headline": "有些人能感受雨，而其他人只是被淋湿。",
    "Gender": 1,
    "FollowerCount": 734127
  },
  {
    "Fullname": "她整夜在写信",
    "UrlToken": "tazhengyezaixin",
    "Url": "https://www.zhihu.com/people/tazhengyezaixin",
    "AvatarUrl": "https://pic2.zhimg.com/50/v2-e1fa32691dab45c07b66d28bf63e59ce_l.jpg?source=f36c2686",
    "Headline": "",
    "Gender": 1,
    "FollowerCount": 238917
  },
  {
    "Fullname": "茶花路莫里亚蒂",
    "UrlToken": "cha-hua-lu-mo-li-ya-ti",
    "Url": "https://www.zhihu.com/people/cha-hua-lu-mo-li-ya-ti",
    "AvatarUrl": "https://pic2.zhimg.com/50/040224afb1d45eb0004b8791b481621b_l.jpg?source=f36c2686",
    "Headline": "雪山千古冷，独照峨眉峰",
    "Gender": 2,
    "FollowerCount": 63634
  },
  {
    "Fullname": "俞min家",
    "UrlToken": "yu-minjia",
    "Url": "https://www.zhihu.com/people/yu-minjia",
    "AvatarUrl": "https://pic2.zhimg.com/50/v2-354147e3d8aa7643b9ec2741b348f319_l.jpg?source=f36c2686",
    "Headline": "情感咨询  和分析解答 (pn8083)",
    "Gender": 1,
    "FollowerCount": 6766
  },
  {
    "Fullname": "二土电子",
    "UrlToken": "40-19-56-55-78",
    "Url": "https://www.zhihu.com/people/40-19-56-55-78",
    "AvatarUrl": "https://pic4.zhimg.com/50/v2-5d956f44a5ce6348fa466feb74958f76_l.jpg?source=f36c2686",
    "Headline": "CSDN嵌入式领域新星创作者，阿里云专家博主。",
    "Gender": 1,
    "FollowerCount": 139
  },
  {
    "Fullname": "路过",
    "UrlToken": "lu-guo-23-51",
    "Url": "https://www.zhihu.com/people/lu-guo-23-51",
    "AvatarUrl": "https://pic1.zhimg.com/50/v2-d0525c55ad4664a004de3850146adbb4_l.jpg?source=f36c2686",
    "Headline": "我只是一只声学攻城狮",
    "Gender": 2,
    "FollowerCount": 1988
  },
  {
    "Fullname": "PeiLingX",
    "UrlToken": "peiling0222",
    "Url": "https://www.zhihu.com/people/peiling0222",
    "AvatarUrl": "https://pic3.zhimg.com/50/v2-c07ef32c3a7d50dd2cb3a004c6d5020d_l.jpg?source=f36c2686",
    "Headline": "野生科普工作者兼乐子人",
    "Gender": 2,
    "FollowerCount": 94971
  },
  {
    "Fullname": "秋之白日梦",
    "UrlToken": "yang-yu-tong-82-67",
    "Url": "https://www.zhihu.com/people/yang-yu-tong-82-67",
    "AvatarUrl": "https://pic1.zhimg.com/50/v2-59b2587b77b4a8cafe849781bed68b89_l.jpg?source=f36c2686",
    "Headline": "喜欢孤独 别派人来找我",
    "Gender": 2,
    "FollowerCount": 472
  },
  {
    "Fullname": "费米科技",
    "UrlToken": "fei-mi-ke-ji",
    "Url": "https://www.zhihu.com/people/fei-mi-ke-ji",
    "AvatarUrl": "https://pic4.zhimg.com/50/v2-5e2ce73fe9fe6b5c3fa415f1c24e4397_l.jpg?source=f36c2686",
    "Headline": "材料学计算模拟专家",
    "Gender": 1,
    "FollowerCount": 2099
  },
  {
    "Fullname": "中科院物理所",
    "UrlToken": "zhong-ke-yuan-wu-li-suo",
    "Url": "https://www.zhihu.com/people/zhong-ke-yuan-wu-li-suo",
    "AvatarUrl": "https://pic3.zhimg.com/50/v2-87e5dec00e3714fae3696992ed465d52_l.jpg?source=f36c2686",
    "Headline": "没错，我就是那个物理所。",
    "Gender": 1,
    "FollowerCount": 972560
  },
  {
    "Fullname": "大族激光",
    "UrlToken": "da-zu-ji-guang-44",
    "Url": "https://www.zhihu.com/people/da-zu-ji-guang-44",
    "AvatarUrl": "https://pic1.zhimg.com/50/v2-d527b80b9565f49ec56f32dd9a13c4d1_l.jpg?source=f36c2686",
    "Headline": "",
    "Gender": 1,
    "FollowerCount": 831
  },
  {
    "Fullname": "老木匠",
    "UrlToken": "oldcarpenter",
    "Url": "https://www.zhihu.com/people/oldcarpenter",
    "AvatarUrl": "https://pic1.zhimg.com/50/v2-abed1a8c04700ba7d72b45195223e0ff_l.jpg?source=f36c2686",
    "Headline": "树木里寄宿着生命，树木正在对我倾诉。",
    "Gender": 2,
    "FollowerCount": 2144
  },
  {
    "Fullname": "Studytips",
    "UrlToken": "my-lucky-54",
    "Url": "https://www.zhihu.com/people/my-lucky-54",
    "AvatarUrl": "https://pic3.zhimg.com/50/v2-fb76fcc0cb42982d9376d8bff4da387b_l.jpg?source=f36c2686",
    "Headline": "世界TOP10大学学霸学习经验/方法.成为A PLAYER",
    "Gender": 1,
    "FollowerCount": 56229
  },
  {
    "Fullname": "YouTube精选字幕",
    "UrlToken": "sky001-57",
    "Url": "https://www.zhihu.com/people/sky001-57",
    "AvatarUrl": "https://pic4.zhimg.com/50/v2-63a5cf1feef1a9c8925d7f5914dea9ae_l.jpg?source=f36c2686",
    "Headline": "译制外文精品视频，每日分享英语视频",
    "Gender": 2,
    "FollowerCount": 609701
  }
];

export const zhihuFavorites: ZhihuFavorite[] = [
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/2028075277591277848",
    "CreatedAt": 1776310866,
    "FavTime": 1783087802,
    "LikeCount": 24,
    "CommentCount": 0,
    "FavoriteCount": 53,
    "Title": "Action Chunking 与 Generative Control：破解连续控制的指数级误差累积",
    "Summary": "摘要Moravec’s Paradox指出，人工智能系统在学习物理动作方面的难度，远高于符号推理领域。然而近期，人工智能驱动的机器人系统能力取得了跨越式提升，这一发展态势与数年前语言建模能力的早期突破颇为相似。本演讲将通过数学论证表明，若未做出特定关键算法设计选择，机器人学这类连续控制场景下的学习难度，较语言这类离散场景会呈指数级增加——这一结论也为莫拉维茨的观点提供了数学层面的佐证。在此基础上，我们将阐释现代…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "AI椰青",
      "UrlToken": "chang-mo-yan-57",
      "Url": "https://www.zhihu.com/people/chang-mo-yan-57",
      "Gender": 0,
      "Headline": "面向未来，学习过去"
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/2045245004566853103",
    "CreatedAt": 1780404407,
    "FavTime": 1781593099,
    "LikeCount": 4895,
    "CommentCount": 207,
    "FavoriteCount": 2271,
    "Title": "为什么有人读博士会抑郁？",
    "Summary": "谢邀，你是一名本科生，你平日的日常就是，白天去上课，如果没课就去图书馆做作业。 寝室室友太烦了，你打心底觉得大家只能一起玩，吵吵吹吹比，但没法在寝室安心学习。 为了和室友合群，显得自己不是那么孤僻，你也会和他们一起打打手游，节日一起吃饭，但也止步于此。 你也不知道为什么要学习，一切都只是源于从小的教育，毕竟你一路就是这么过来的。 你还记得高三那年，高考百天誓言的情形，这一切都是过去了。 你有时候会质…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "JokerRayL",
      "UrlToken": "allen-ray-1",
      "Url": "https://www.zhihu.com/people/allen-ray-1",
      "Gender": 2,
      "Headline": "领导最忠诚的狗"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/1974994324522565833",
    "CreatedAt": 1764781707,
    "FavTime": 1781232886,
    "LikeCount": 234,
    "CommentCount": 26,
    "FavoriteCount": 555,
    "Title": "随机轨迹优化方法入门:以MPPI为例",
    "Summary": "封面图片来自于原始MPPI论文 Information Theoretic Model Predictive Control: Theory and Applications to Autonomous Driving[1]，文章从信息论和自由能的角度推导了MPPI的更新公式，但自己一直没太看懂。近期看了Model Predictive Control via Probabilistic Inference: A Tutorial[2]，该文章的理论推导部分不涉及自由能、自然梯度、Feynman-Kac引理等更容易看懂，同时阐述了 [公式] 参数的影响等细节，学习记录一下。1. …",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "iridescence",
      "UrlToken": "1ridescence",
      "Url": "https://www.zhihu.com/people/1ridescence",
      "Gender": 2,
      "Headline": "focus"
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/2030667028579738719",
    "CreatedAt": 1776928747,
    "FavTime": 1778652299,
    "LikeCount": 1360,
    "CommentCount": 70,
    "FavoriteCount": 1213,
    "Title": "目前博士高年级在读，科研没成果，我要不要退学？",
    "Summary": "在学校里待久了的人，容易把自己看得过于珍贵。 三年读博没有成果，我逝去的时光完蛋了。可能要延期毕业，我的人生计划完蛋了。日复一日调着无意义的参数，我几年的精力完蛋了。够不到导师的期待，我的推荐信完蛋了。不敢选择性优化数据，我的科研理想完蛋了。回应不了父母和老师的目光，我在他们心中的样子完蛋了。看着身边的人论文一篇接一篇，我的自尊完蛋了。可是，你为什么不这么想呢？ 如果你不曾坐在这三年的冷板凳上，你…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "暨厥",
      "UrlToken": "13706051380",
      "Url": "https://www.zhihu.com/people/13706051380",
      "Gender": 0,
      "Headline": ""
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/2022307874802517337",
    "CreatedAt": 1774935770,
    "FavTime": 1775652328,
    "LikeCount": 248,
    "CommentCount": 5,
    "FavoriteCount": 850,
    "Title": "具身智能（运动控制方向）如何学习？",
    "Summary": "运动控制方向和操作任务有所不同，它更偏 RL 和动力学仿真，整条学习路径也比较线性： 先把仿真跑通，再搞懂 sim-to-real，最后上真机。 分三部分：入门仿真、算法实战、学术路线。 入门仿真先把仿真环境跑起来。 1、Isaac Lab NVIDIA 官方的具身智能 RL 训练平台，基于 Isaac Sim，GPU 并行训练速度快，内置了大量运动控制任务模板。运动控制方向的首选仿真环境。 链接： https://github.com/isaac-sim/IsaacLab [图片] 2、legged_gym ETH RSL 实验室的经…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "林博",
      "UrlToken": "momo-48-90-69",
      "Url": "https://www.zhihu.com/people/momo-48-90-69",
      "Gender": 2,
      "Headline": "具身智能，VLA，机器人，自动驾驶"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/1974235172674229147",
    "CreatedAt": 1763475574,
    "FavTime": 1775646219,
    "LikeCount": 173,
    "CommentCount": 5,
    "FavoriteCount": 247,
    "Title": "【VLA+RL】PI*0.6 解读（一）：blog篇",
    "Summary": "PI*0.6 的发布我认为算是一个关键节点,即把VLA任务的成功率达到了90%+，但是可能速度还没有提上来。后续的工作可能就是越来越多的任务实现，和越来越高的成功率，和越来越快的执行速度。 在半年前，大家的思路也都沿着 VLA+RL 方向去做了，比如最近的 RL100三段式训练方法，但是 RL100使用了是一个点云的简单policy 并不是 VLA。 Dyna 本人猜测也是用了类似的 offline RL 的思路。 这种思路范式在自动驾驶端到端的探索上两年前大…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "AIming",
      "UrlToken": "sherlock-holmes-97",
      "Url": "https://www.zhihu.com/people/sherlock-holmes-97",
      "Gender": 2,
      "Headline": "自动驾驶、具身智能、World Model、Physic AI"
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/1953813671940716392",
    "CreatedAt": 1758605479,
    "FavTime": 1774893819,
    "LikeCount": 849,
    "CommentCount": 26,
    "FavoriteCount": 1264,
    "Title": "对 PhD 一年级新生有什么建议？",
    "Summary": "以下建议来自导师（加拿大皇家学会院士、工程院院士，IEEE Fellow，人品性格能力等各方面都是人生楷模） （ 帮咱们波波哥翻译一波哈，经过适当整理，老板原句见参考）： 关于人生：永无极限，与天比高。 [1] 清晨属于早起者，人生亦然。 [2] 你应当引领，而不是随波逐流。[3] 心怀善意，积极向上；人生中不必有敌人。 [4] 做真实而踏实的研究，终将赢得属于你的荣耀。 [5] 自我满足最重要，只要你快乐，就做到最好。无需成为别人…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "ccc",
      "UrlToken": "ccc-5-11-14",
      "Url": "https://www.zhihu.com/people/ccc-5-11-14",
      "Gender": 2,
      "Headline": "电子工程博士生"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/2020174286892061902",
    "CreatedAt": 1774427171,
    "FavTime": 1774548614,
    "LikeCount": 178,
    "CommentCount": 19,
    "FavoriteCount": 233,
    "Title": "Fast-WAM 给 World Model 领域研究的几点思考",
    "Summary": "论文：Fast-WAM: Do World Action Models Need Test-time Future Imagination? 作者：Tianyuan Yuan, Zibin Dong, Yicheng Liu, Hang Zhao 机构：清华大学IIIS, Galaxea AI 链接：论文 | 项目主页 Fast-WAM 提出了一个尖锐的问题：World Action Model（WAM）在推理时真的需要\"想象未来\"吗？论文的答案是\"不需要\"——去掉推理时的视频生成，性能几乎无损，速度快4倍以上。 这个结论乍看非常有冲击力。但仔细审视之后，我认为论文的…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "盛见者",
      "UrlToken": "zhang-ming-hao-41",
      "Url": "https://www.zhihu.com/people/zhang-ming-hao-41",
      "Gender": 2,
      "Headline": "飞行器设计爱好者"
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/2007111432962061410",
    "CreatedAt": 1771312655,
    "FavTime": 1774457962,
    "LikeCount": 242,
    "CommentCount": 5,
    "FavoriteCount": 429,
    "Title": "VLA真的能走通吗?",
    "Summary": "1. 主流 VLA 架构以及为什么我们需要 action tokenizer不得不承认 physical intelligence 依旧是 VLA 实践灯塔之一，自从 [公式] 和配套 Knowledge Isolation 的架构提出，各大厂和实验室推出新 VLA 模型也大差不差延续了这一经典范式——VLM 拼接 Action Expert，KV cache 传递 perception 信息。 打断补充：最近 NVIDIA 的 DreamZero 和蚂蚁的 Lingbot-VA 都在从 video generation model 出发探索新的架构可能性，这些都非…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "董子斌",
      "UrlToken": "yi-zhi-lu-lu-zhu-59",
      "Url": "https://www.zhihu.com/people/yi-zhi-lu-lu-zhu-59",
      "Gender": 2,
      "Headline": "EmbodiedAI TJURLLab 硕士在读"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/2019841160064059225",
    "CreatedAt": 1774347717,
    "FavTime": 1774437330,
    "LikeCount": 95,
    "CommentCount": 1,
    "FavoriteCount": 157,
    "Title": "世界模型开始做减法？LeCun团队和清华团队给出两种思路",
    "Summary": "近期，围绕「世界模型」这一方向，有两项工作受到较多关注。 一篇是来自 Yann LeCun 团队的 LeWorldModel，尝试以更简洁的 JEPA 实现从像素端到端训练的世界模型，在降低训练复杂度的同时，验证了潜在空间中对物理结构的刻画能力。 [图片] 另一篇是清华大学团队的 Fast-WAM，则从应用角度出发，重新审视当前主流 World Action Model（WAM）的设计范式，探讨「是否真的需要在推理阶段显式生成未来」这一关键问题，并给出了一种更高效的替…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "机器之心",
      "UrlToken": "ji-qi-zhi-xin-65",
      "Url": "https://www.zhihu.com/people/ji-qi-zhi-xin-65",
      "Gender": 0,
      "Headline": "人工智能信息服务平台"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/1997427336115672160",
    "CreatedAt": 1769004149,
    "FavTime": 1774373820,
    "LikeCount": 11,
    "CommentCount": 0,
    "FavoriteCount": 35,
    "Title": "Flow-GRPO：通过在线强化学习训练流匹配模型",
    "Summary": "Flow-GRPO:Training Flow Matching Models via Online RL来自MMLab、清华大学、快手科技和上海人工智能实验室的研究人员开发了Flow-GRPO，这是一个将在线策略梯度强化学习整合到流匹配模型中的框架。该方法通过ODE到SDE的转换和去噪减少策略，解决了确定性和采样效率的挑战，显著提升了组合图像生成、视觉文本渲染和人类偏好对齐的能力，在SD3.5-M上实现了高达95%的GenEval准确率。 提出了 Flow-GRPO，这是首个将在线策略梯度强…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "搬砖袖子",
      "UrlToken": "bi-mo-39-23",
      "Url": "https://www.zhihu.com/people/bi-mo-39-23",
      "Gender": 2,
      "Headline": ""
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/1959616192768616030",
    "CreatedAt": 1759988908,
    "FavTime": 1774373788,
    "LikeCount": 58,
    "CommentCount": 2,
    "FavoriteCount": 117,
    "Title": "为什么flow matching模型都是以高斯分布作为源域的？",
    "Summary": "补充一篇同样不用Gaussian做源域的工作VITA。文章发表在ICLR 2026，通过非Gaussian源去除visual conditioning modules，提升机器人policy效率。文章发现这样的学习范式下，visual latents (source)学习出到了latent actions (target)的语义。 如下图，通过VITA学习到的source/target latent manfolds彼此接近，我们可以认为visual encoder默默的学习到了action-relevant visual features。一个意想不到的好处是，在两个相似manif…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "dcgao",
      "UrlToken": "dechengao",
      "Url": "https://www.zhihu.com/people/dechengao",
      "Gender": 0,
      "Headline": ""
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/1948704175769773570",
    "CreatedAt": 1757389399,
    "FavTime": 1774373744,
    "LikeCount": 33,
    "CommentCount": 0,
    "FavoriteCount": 67,
    "Title": "华盛顿大学核心突破！Flow Matching+一致性训练实现1步生成，机器人动作进入「高铁时代」",
    "Summary": "引言在机器人领域，如何高效生成精准、高维的动作一直是具身智能研究的核心挑战。现有方法要么推理效率低下，要么泛化能力不足。 为了解决这一难题，本研究提出了ManiFlow——一种基于流匹配（Flow Matching）与一致性训练（Consitstency Training）的全新策略，能够在仅1-2步推理中生成高质量动作，极大地提升了实时操控的可行性。此外，ManiFlow引入了DiT-X架构，通过自适应交叉注意力（Adaptive Cross-attention）和AdaLN-Zer…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "具身智能观察室",
      "UrlToken": "samuel-13-24",
      "Url": "https://www.zhihu.com/people/samuel-13-24",
      "Gender": 2,
      "Headline": "机器人、具身智能、AI大模型、强化学习等前沿技术以及行业资讯"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/2015050462794122357",
    "CreatedAt": 1773211613,
    "FavTime": 1774373419,
    "LikeCount": 192,
    "CommentCount": 2,
    "FavoriteCount": 375,
    "Title": "最优控制视角下的flow matching （不推公式版本，理解物理图像）",
    "Summary": "从更新的视角理解 Flow Matching：一些意识流思考最近在了解 Information-Geometric Optimization（IGO）之后，我再回头看 Flow Matching（FM），忽然觉得这个连续空间里的强大生成算法，也许可以从“更新”的角度重新理解。这里记录一些比较意识流的思考，希望能帮助初学者和相关研究者建立对 FM 更直观的物理图像。 最朴素的 Flow Matching 理解坦白说，我一直不算擅长 FM 的那套理论推导。每次看到连续性方程、概率路径、条件…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "dung defender",
      "UrlToken": "xiaoxin-89",
      "Url": "https://www.zhihu.com/people/xiaoxin-89",
      "Gender": 1,
      "Headline": "less is more"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/1966878096239068328",
    "CreatedAt": 1761721245,
    "FavTime": 1774373367,
    "LikeCount": 11,
    "CommentCount": 0,
    "FavoriteCount": 44,
    "Title": "中科院自动化所Flow Matching+强化微调！FPO算法让机器人“超越模仿”",
    "Summary": "作者：Lingshu 具身智能观察室 公众号：EmbodiedAI_2025引言在具身智能领域，Vision - Language - Action（VLA）模型凭借大规模演示展现出强泛化能力，但其性能提升仍受限于监督数据的质量与覆盖广度。强化学习（RL）为在线交互下VLA的优化提供了路径，然而流匹配（Flow Matching）架构下的传统策略梯度方法，因重要性采样（Importance Sampling）过程的不可解性（需显式计算策略比）面临计算可行困境。 对此，本研究提出Flow Po…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "具身智能观察室",
      "UrlToken": "samuel-13-24",
      "Url": "https://www.zhihu.com/people/samuel-13-24",
      "Gender": 2,
      "Headline": "机器人、具身智能、AI大模型、强化学习等前沿技术以及行业资讯"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/1960821155125494517",
    "CreatedAt": 1760276412,
    "FavTime": 1774373336,
    "LikeCount": 27,
    "CommentCount": 4,
    "FavoriteCount": 50,
    "Title": "Streaming Flow Policy：将动作轨迹视为流轨迹以简化流匹配策略，实现“边生成边执行”",
    "Summary": "论文链接： https://arxiv.org/abs/2505.21851 ， CoRL 2025 [图片] 扩散策略（Diffusion Policy）与流匹配策略（Flow-Matching Policy）使模仿学习能够学习复杂的动作轨迹。然而，这些方法计算开销较大，采样的中间动作轨迹会被丢弃，且在采样完成前无法在机器人上执行任何动作。 为简化这一过程，论文提出将动作轨迹视为流轨迹的方法。该算法不再从纯噪声开始，而是从上一个动作附近的窄高斯分布中采样。接着，通过流匹配（flow matching）学习得到…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "Wander熵",
      "UrlToken": "SpeechSilver",
      "Url": "https://www.zhihu.com/people/SpeechSilver",
      "Gender": 1,
      "Headline": "算法工程师 | 什么都想学学看"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/2003103750936625948",
    "CreatedAt": 1770357964,
    "FavTime": 1774373288,
    "LikeCount": 3,
    "CommentCount": 0,
    "FavoriteCount": 8,
    "Title": "加州大学团队推出了效率、成功率最优越的策略！4层网络，成功复现了复杂双臂操作",
    "Summary": "[图片] ICLR 2026 论文 VITA，刷新机器人策略效率、简洁性的新高度！VITA: VIsion-To-Action Flow Matching PolicyVITA由加州大学戴维斯、加州大学伯克利的研究人员提出，是目前效率、成功率最为优越的流匹配策略之一。最为震撼的是，VITA只使用4层简单MLP网络，便在实机试验当中成功实现了ALOHA复杂双臂操作。 VITA的核心设计极为优雅。与传统流/扩散策略从高斯分布开始采样不同，VITA策略以图像分布作为流策略的源，直接流入机器人的…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "具身智能之心",
      "UrlToken": "79-72-74-40",
      "Url": "https://www.zhihu.com/people/79-72-74-40",
      "Gender": 2,
      "Headline": "具身智能之心，迈向通用人工智能"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/1894689911824692369",
    "CreatedAt": 1744509471,
    "FavTime": 1774373279,
    "LikeCount": 25,
    "CommentCount": 1,
    "FavoriteCount": 81,
    "Title": "比扩散策略更高效的生成模型：流匹配的理论基础与Pytorch代码实现",
    "Summary": "扩散模型(Diffusion Models)和流匹配(Flow Matching)是用于生成高质量、连贯性强的高分辨率数据（如图像和机器人轨迹）的先进技术。在图像生成领域，扩散模型的代表性应用是Stable Diffusion，该技术已成功迁移至机器人学领域，形成了所谓的\"扩散策略\"(Diffusion Policy)。值得注意的是，扩散实际上是流匹配的特例，流匹配作为一种更具普适性的方法，已被Physical Intelligence团队应用于机器人轨迹生成，并在图像生成方面展现出…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "deephub",
      "UrlToken": "deephub",
      "Url": "https://www.zhihu.com/people/deephub",
      "Gender": 0,
      "Headline": "AI方向文章，看头像就知道，这里都是\"干\"货"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/1933619598223205987",
    "CreatedAt": 1753790863,
    "FavTime": 1774373208,
    "LikeCount": 33,
    "CommentCount": 1,
    "FavoriteCount": 55,
    "Title": "Flow Matching Policy Gradient",
    "Summary": "https://arxiv.org/abs/2507.21053 摘要基于流的生成模型（包括扩散模型）在高维空间的连续分布建模方面表现出色。在本文中，我们提出了流策略优化（Flow Policy Optimization, FPO），这是一种简单的在线强化学习算法，它将流匹配融入策略梯度框架。FPO将策略优化转化为最大化基于条件流匹配损失计算的优势加权比率，其方式与流行的PPO-clip框架兼容。它无需进行精确的似然计算，同时保留了基于流的模型的生成能力。与先前基于扩散的强化学…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "AI椰青",
      "UrlToken": "chang-mo-yan-57",
      "Url": "https://www.zhihu.com/people/chang-mo-yan-57",
      "Gender": 0,
      "Headline": "面向未来，学习过去"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/1963075673762555122",
    "CreatedAt": 1760827553,
    "FavTime": 1774372933,
    "LikeCount": 200,
    "CommentCount": 2,
    "FavoriteCount": 497,
    "Title": "Diffusion + RL 系列一 （DQL 及其后续发展）",
    "Summary": "本篇博客算是本人对于过去一年对于 Diffusion RL 的一些探索与经验性总结，后续估计不再深入地做此具体的方向（也不一定hhh），因此希望借此机会，对这一年的研究旅程做一个阶段性回顾。 对于 Diffusion 的部分笔者笔力有限，对基础的知识不打算展开，感兴趣的朋友可以看看 Diffusion Models 基础知识总结回顾 、 https://www.youtube.com/watch?v=wMmqCMwuM2Q 、 What are Diffusion Models? | Lil'Log ，都是我感觉非常好的博客和 video ；我们都知道…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "Zhennan",
      "UrlToken": "xiao-xing-yun-er-96",
      "Url": "https://www.zhihu.com/people/xiao-xing-yun-er-96",
      "Gender": 0,
      "Headline": ""
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/6223910015",
    "CreatedAt": 1731347634,
    "FavTime": 1774372828,
    "LikeCount": 631,
    "CommentCount": 23,
    "FavoriteCount": 1027,
    "Title": "扩散策略算法归纳整理（一）：优势与挑战",
    "Summary": "记得两年前刚投稿ICLR时，扩散策略（Diffusion Policy）还基本是一个纯理论的概念，全网只有寥寥两三篇arxiv，而现在它俨然已成为RL和具身领域的“显学”了。组里目前也在探索大规模扩散通用具身智能体的构建（RDT-1B）。最近闲了点，打算梳理一下近两年领域的理论进展，也算总结下自己研究的心路历程，做个宣传。 要回答的问题：扩散策略究竟“好”在哪？扩散模型引入RL，带来的本质挑战和核心难点（坑）是什么？总结Diffusion …",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "陈陈",
      "UrlToken": "chen-chen-81-37-96",
      "Url": "https://www.zhihu.com/people/chen-chen-81-37-96",
      "Gender": 2,
      "Headline": "TSAIL: 强化学习+生成模型 "
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/2013366696811963216",
    "CreatedAt": 1772804196,
    "FavTime": 1774372732,
    "LikeCount": 66,
    "CommentCount": 0,
    "FavoriteCount": 136,
    "Title": "🤖 Physical Intelligence (π) 研究全面总结：从 π0 到 MEM",
    "Summary": "一、公司简介与整体方向 Physical Intelligence 是当前硅谷最受关注的机器人 AI 公司之一。他们的使命很简单，也很宏大：让机器人像 ChatGPT 一样好用。 今天你开发一个 App，只需要调用 OpenAI 的 API 就能获得语言智能。但如果你想开发一个机器人应用，你得自己搭控制器、自己采集数据、自己训练模型——几乎要从零开始。Physical Intelligence 想改变这一点，他们要提供一个开箱即用的「物理智能层」（Physical Intelligence …",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "硅宝ai",
      "UrlToken": "xu-shao-25-93",
      "Url": "https://www.zhihu.com/people/xu-shao-25-93",
      "Gender": 2,
      "Headline": ""
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/2019180442578886855",
    "CreatedAt": 1774190132,
    "FavTime": 1774372108,
    "LikeCount": 6,
    "CommentCount": 2,
    "FavoriteCount": 2,
    "Title": "一路走来，你的人生感悟是什么？",
    "Summary": "写写自己，96年秋天出生，也马上是30岁的人，感觉这三十年如梦又是如此真实，26岁以前自己一直处在物质贫穷阶段，一岁开始就是留守儿童，爷爷奶奶带大，九岁开始住学校一周回家一次，还得走两三个小时山路才到家。后来有幸成为同村几个同龄小伙伴中唯一读了大学的，但是这没什么值得骄傲，因为在我这一代老师与农村家长并不觉得考上普通大学有什么喜悦。上大学打开了我一些新视野，同时我也感到自卑，尤其大学里谈恋爱的时候，我…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "一个外企人",
      "UrlToken": "9-26-73-9-28",
      "Url": "https://www.zhihu.com/people/9-26-73-9-28",
      "Gender": 1,
      "Headline": "本人太丰富，无法语言描述"
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/2002067273612035869",
    "CreatedAt": 1770110034,
    "FavTime": 1774348881,
    "LikeCount": 478,
    "CommentCount": 17,
    "FavoriteCount": 803,
    "Title": "怎么样才能想出一个work的idea？",
    "Summary": "很高兴我的一项工作中稿ICLR26（现在arxiv版本写得有点垃圾，后面会做一些大修改）： [图片] 这是我近几年非常非常满意的一个工作，可以说从各个角度都有许多典型的、在科研领域里有复盘价值的因素，包括怎么想到的这个idea、idea的缺陷、“故事”的重要性与是否需要SOTA、审稿人的喜好、研究领域等等，所以把这个工作和大家分享出来，希望能给大家带来一点有用的经验。 贝叶斯优化算法（BO）是一个相对小众的传统人工智能研究领域，不…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "谢子锴",
      "UrlToken": "xie-zi-kai-1",
      "Url": "https://www.zhihu.com/people/xie-zi-kai-1",
      "Gender": 0,
      "Headline": "PostDoc of Huashui"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/1969799804625350704",
    "CreatedAt": 1762423093,
    "FavTime": 1774288491,
    "LikeCount": 5,
    "CommentCount": 0,
    "FavoriteCount": 15,
    "Title": "【论文阅读】生成对抗网络（GANs）综述",
    "Summary": "【引言】生成对抗网络（GANs）是人工智能领域的一项重要突破，它采用 generator 和 discriminator 两个神经网络，在对抗框架下协同工作。generator 负责生成合成数据，discriminator 则评估数据的真实性。这种动态交互形成了一个极小极大博弈（minimax game），能够产出高质量的合成数据。自 2014 年Goodfellow 提出以来，GAN 已通过多种创新架构不断发展，包括原始 GAN（Vanilla GAN）、条件 GAN（Conditional GAN，cGAN）、深…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "Ethan Zeng",
      "UrlToken": "ceng-xiang-an-60",
      "Url": "https://www.zhihu.com/people/ceng-xiang-an-60",
      "Gender": 2,
      "Headline": "Control、RL都不懂"
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/2016091789505868059",
    "CreatedAt": 1773453739,
    "FavTime": 1774204152,
    "LikeCount": 4,
    "CommentCount": 0,
    "FavoriteCount": 9,
    "Title": "如何看待目前VLA的具身智能技术？",
    "Summary": "[图片]",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "哎嗨人生",
      "UrlToken": "gaows-75",
      "Url": "https://www.zhihu.com/people/gaows-75",
      "Gender": 0,
      "Headline": "知识库：gl-robotics.com"
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/66086464335",
    "CreatedAt": 1735370718,
    "FavTime": 1774203962,
    "LikeCount": 11,
    "CommentCount": 0,
    "FavoriteCount": 39,
    "Title": "现在端到端这么火的大背景下，对于规控领域学习传统规控算法还有意义吗?",
    "Summary": "本篇论文出发点：自动驾驶规划器通常由两个模块组成， 行为规划确定高层次的决策，例如变道、超车和让行，而轨迹规划则生成平滑的轨迹以实现这些高层次目标。基于端到端方法（例如模仿学习和强化学习）能直接从感知结果或原始传感器数据生成决策。然而，这些方法缺乏可靠性、可解释性以及安全性保证。 如：大多数运动预测模型在行为规划中仅被被动使用，这意味着预测模型通常为其他agent输出固定的结果，而忽略了自车未来行动的…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "Surprise",
      "UrlToken": "jun-guan-39",
      "Url": "https://www.zhihu.com/people/jun-guan-39",
      "Gender": 2,
      "Headline": "自动驾驶高级量产算法工程师"
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/2017705575237060144",
    "CreatedAt": 1773838496,
    "FavTime": 1774203844,
    "LikeCount": 139,
    "CommentCount": 10,
    "FavoriteCount": 414,
    "Title": "现在端到端这么火的大背景下，对于规控领域学习传统规控算法还有意义吗?",
    "Summary": "开源地址： https://github.com/my-al-ilqr/al-ilqr-starter [图片] 前言这个专题也更新了好久了，终于迎来了代码。光看论文，始终无法真正理解理论，只有代码才能反映出理论细节。理论部分在之前的《时空联合规划》专题里已经写完了，这次是代码实践部分。代码聚焦AL-iLQR 算法，帮助读者从零理解： 离散时间最优控制问题如何建模无约束 iLQR 如何工作增广拉格朗日如何处理约束AL-iLQR 外层 / iLQR 内层如何协同求解如何把论文中的求解流程落到可运行代码来看一…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "哎嗨人生",
      "UrlToken": "gaows-75",
      "Url": "https://www.zhihu.com/people/gaows-75",
      "Gender": 0,
      "Headline": "知识库：gl-robotics.com"
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/2001439677928998208",
    "CreatedAt": 1769960404,
    "FavTime": 1774115820,
    "LikeCount": 136,
    "CommentCount": 0,
    "FavoriteCount": 274,
    "Title": "把高飞老师组的路径规划相关论文都看完，能跟上领域前沿水平吗？",
    "Summary": "目前小型多旋翼无人机研究做的比较好的组，国内绝对是高飞教授。大部分文章我都看过了，目前除了做经典优化的路径规划，也开始侧重AI了。 还有中山大学的HI LAB，这个组我关注的不多。 国外的话就是eth uzh和epfl的几个相关实验室，他们组以前做mpc，现在的话，主要是弄基于学习的方法。他们开发的无人机系统甚至超越了人类冠军飞手。比如RPG实验室。 然后就是TU Delft的MAVLAB。他们也做固定翼无人机。他们也几乎都是AI的研究了…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "清风",
      "UrlToken": "31-45-76-43",
      "Url": "https://www.zhihu.com/people/31-45-76-43",
      "Gender": 0,
      "Headline": "UAV, Robotics, PhD Candidate "
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/2018049849342338275",
    "CreatedAt": 1773920577,
    "FavTime": 1773974962,
    "LikeCount": 59,
    "CommentCount": 4,
    "FavoriteCount": 115,
    "Title": "世界模型(World Models)是什么？",
    "Summary": "硕士入学以来我做的研究基本都在于把机器人操作的策略学习问题解耦为两阶段的问题：1.一个视觉规划模型（Visual Planner）根据输入的任务指令 [公式] 与观测图像 [公式] 生成未来机器人完成这个任务的观测图像序列 [公式] 。2.一个逆动力学模型（Inverse Dynamics Model）将这个观测序列 [公式] 转化为机器人的执行动作 [公式] 。最近跟同学聊天，被问道：“你这算是World Model的做法吗？”。我楞了一会： 怎么这么一说我的研究就…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "渺渺",
      "UrlToken": "zzz-40-18-17",
      "Url": "https://www.zhihu.com/people/zzz-40-18-17",
      "Gender": 0,
      "Headline": "好想成为人类啊。"
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/2505038604",
    "CreatedAt": 1653707851,
    "FavTime": 1773834968,
    "LikeCount": 103,
    "CommentCount": 17,
    "FavoriteCount": 213,
    "Title": "模型预测控制（MPC），找工作？",
    "Summary": "我们team是做自动驾驶的，MPC做得好的话不用太担心找不到工作，你如果这一个方向确实有很深的兴趣（而非仅仅为了找份工作混一下），可以来我这实习，或者加入我们。 另外给几个建议： 1、可以结合uncertainty做 ，特别是非Gaussian的uncertainty。 http://www.roboticsproceedings.org/rss16/p069.html 这个是我之前做的一个工作，结合了MPC和uncertainty，发表在RSS'20上了。2、考虑复杂而繁多的 hard constraints，同时想办法让优化过程不至于直接掉比较糟糕…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "邱迪聪",
      "UrlToken": "DavidQiu1993",
      "Url": "https://www.zhihu.com/people/DavidQiu1993",
      "Gender": 2,
      "Headline": "CMU | NASA | AGI | 机器人 | 自动驾驶"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/1986941988331864227",
    "CreatedAt": 1766504081,
    "FavTime": 1773834960,
    "LikeCount": 51,
    "CommentCount": 3,
    "FavoriteCount": 102,
    "Title": "SpaceX 算法：软着陆最优控制中的非凸控制边界与指向约束的无损凸化",
    "Summary": "Lossless Convexification of Nonconvex Control Bound and Pointing Constraints of the Soft Landing Optimal Control Problem http://www.larsblackmore.com/iee_tcst13.pdf [图片] 这篇论文的关键不是“凸包和原集合相等”——它们显然不等；而是： 先把二进制开关和推力下界大胆松弛，再用 Pontryagin 最大值原理证明：在非退化条件下，松弛问题的最优解会自动落回原集合的极点，而且几乎处处呈现“关闭或满推力、只选收益最大的 K 个执行器”的结构。 [图片] <戏剧> …",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "周舒畅",
      "UrlToken": "zhou-shu-chang-45",
      "Url": "https://www.zhihu.com/people/zhou-shu-chang-45",
      "Gender": 2,
      "Headline": "AI 研究员；小鹏、阶跃、旷视、Google"
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/2012640698172732092",
    "CreatedAt": 1772630935,
    "FavTime": 1773812753,
    "LikeCount": 1385,
    "CommentCount": 144,
    "FavoriteCount": 2722,
    "Title": "从哪里可以看出一个人能成大事？",
    "Summary": "能成大事的人，早期几乎看不出来。 不是因为他们藏得深，而是因为大多数人看人的维度，从一开始就错了。 大家习惯看颜值、看学历、看家境，看他说话是否自信，或者看他身上有没有那种所谓的“气场”。 其实这些外在的东西，和一个人最终能不能成事，关系远没你想的那么大。 真正决定一个人能走多远的，是几个藏在日常细节里、极容易被忽视的底层特质。 看懂了这几点，你看人的眼光，将会发生质的飞跃。 第一个特征：看他如何对待…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "启行舟客",
      "UrlToken": "kong-chen-71-73",
      "Url": "https://www.zhihu.com/people/kong-chen-71-73",
      "Gender": 2,
      "Headline": "觉者由心生律，修者以律制心。（公众号：启行舟客）"
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/1356307253",
    "CreatedAt": 1595492842,
    "FavTime": 1773469565,
    "LikeCount": 32,
    "CommentCount": 1,
    "FavoriteCount": 86,
    "Title": "有没有比较好的教材是从微分几何的观点讲最优控制的？",
    "Summary": "本人旁听过几何力学，我记得老师讲过这个领域现在仍在研究前沿，还有很多没解决的问题，在力学方面好像有三本教科书在探讨用几何方法做控制这个问题，其中一个是《Geometric Control of Mechanical Systems: Modeling, Analysis, and Design for Simple Mechanical Control Systems》 by Francesco Bullo and Andrew D. Lewis（ https://www.amazon.com/-/zh/Geometric-Control-Mechanical-Systems-Mathematics-ebook/dp/B07ZKTDN9X/ref=sr_1_1?__mk_zh_CN=%E4%BA%9A%E9%A9%AC%E9%80%8A%E7%BD%91%E7%AB%99&dchild=1&keywords=Geometric+Control+of+Mechanical+Systems&qid=1595491580&s=books&sr=1-1 ），还有一本是Nonholonomic Mechanics and Control（https://www.amazon.com/exec/obidos/ASIN/0387955356/melvinleokshomep ）…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "东海帆",
      "UrlToken": "dong-ivan",
      "Url": "https://www.zhihu.com/people/dong-ivan",
      "Gender": 2,
      "Headline": "一个人的想法可能愚蠢，但一群人的意见如天才般聪慧。"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/589129910",
    "CreatedAt": 1670154090,
    "FavTime": 1773469560,
    "LikeCount": 8,
    "CommentCount": 1,
    "FavoriteCount": 16,
    "Title": "从几何观点看控制理论",
    "Summary": "Control theory from the geometric viewpoint_withMarginNotes.pdf 前面极品文章介绍了微分几何，这次的笔记只要是为了补全积分的讨论。该讨论包括函子，时序指数，微分同胚映射的作用，流的可交换性以及variation formula 以及流相对于参数的导数等概念和基本性质。时序积分可以用于讨论ode 的解的问题。",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "斯多格",
      "UrlToken": "si-duo-ge-17-67",
      "Url": "https://www.zhihu.com/people/si-duo-ge-17-67",
      "Gender": 2,
      "Headline": "希望大家喜欢自动化"
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/445175088",
    "CreatedAt": 1531845115,
    "FavTime": 1773469555,
    "LikeCount": 58,
    "CommentCount": 16,
    "FavoriteCount": 193,
    "Title": "几何控制 Geometric Control 之美在于什么？",
    "Summary": "大家的回答已经很好了。 关于线性系统的 Geometric approach，也推荐两本（分别关于确定和随机）绝对大神的绝对经典书： Linear Multivariable Control: A Geometric Approach Linear Multivariable Control - A Geometric Approach | W.M. Wonham | Springer Linear Stochastic Systems: A Geometric Approach to Modeling, Estimation and Identification Linear Stochastic Systems - A Geometric Approach to Modeling, Esti…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "小心假设",
      "UrlToken": "jiashe",
      "Url": "https://www.zhihu.com/people/jiashe",
      "Gender": 2,
      "Headline": "“大胆想法”，请看我最近一年来的提问~"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/1916869712446488701",
    "CreatedAt": 1749801614,
    "FavTime": 1773469546,
    "LikeCount": 3,
    "CommentCount": 0,
    "FavoriteCount": 19,
    "Title": "【控制入门】05-几何跟踪方法Pure Pursuit/Stanley",
    "Summary": "几何路径跟踪(Geometric Path Tracking)算法是自动驾驶中比较流行的路径跟踪控制方法之一。这类方法利用车辆与参考路径之间的几何关系，得到路径跟踪问题的控制公式。通常，其利用“预瞄距离”(look ahead distance)来测量车辆前方的误差。最典型的几何路径跟踪控制方法是 Pure Pursuit和Stanley方法，下面分别对其进行介绍（我们只考虑横向前轮转角的控制）。前提基于车辆运动学模型-自行车模型+阿卡曼几何公式 [文章: 【控制入门】01-车辆运动学模型]",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "智驾工程笔记",
      "UrlToken": "xiao-yun-59-71",
      "Url": "https://www.zhihu.com/people/xiao-yun-59-71",
      "Gender": 0,
      "Headline": "自动驾驶算法工程师，分享智驾与AI 落地实操心得"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/38445764",
    "CreatedAt": 1529851989,
    "FavTime": 1773469539,
    "LikeCount": 25,
    "CommentCount": 17,
    "FavoriteCount": 41,
    "Title": "力学系统的几何控制1.1-构型空间",
    "Summary": "一个力学系统几何控制的系列，主要参考Frances Bullo的书。 [图片] [图片] [图片] [图片] [图片] [图片] [图片]",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "栖栖遑遑",
      "UrlToken": "tonny-wu-14",
      "Url": "https://www.zhihu.com/people/tonny-wu-14",
      "Gender": 2,
      "Headline": ""
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/662658208",
    "CreatedAt": 1697916150,
    "FavTime": 1773469537,
    "LikeCount": 19,
    "CommentCount": 0,
    "FavoriteCount": 27,
    "Title": "MagicDrive: 多样3D几何控制的街景生成",
    "Summary": "23年10月13日的论文“MagicDrive: Street View Generation With Diverse 3D Geometry Control“， 来自香港中文大学、香港科技大学和华为诺亚。 [图片] 扩散模型的最新进展显著增强了2-D控制下的数据合成。然而，街景生成中的精确 3D 控制对于 3D 感知任务至关重要，但仍然难以解释。具体来说，鸟瞰图（BEV）作为主要条件通常会给几何控制（例如高度）带来挑战，影响物体形状、遮挡模式和路面高程的表示，所有这些对于感知数据的合成至…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "黄浴",
      "UrlToken": "yuhuang2019",
      "Url": "https://www.zhihu.com/people/yuhuang2019",
      "Gender": 2,
      "Headline": "《自动驾驶系统开发》24-5，Springer英文版26-4"
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/86448013",
    "CreatedAt": 1455548179,
    "FavTime": 1773469533,
    "LikeCount": 46,
    "CommentCount": 8,
    "FavoriteCount": 63,
    "Title": "geometric control theory是什么？",
    "Summary": "几何控制理论～ 这要从线性系统说起，线性系统的研究大体上分为四种，除了常见的状态空间法，还有以Kalman为代表的代数理论，Wonham为代表的几何理论和多项式频域理论。其中几何理论观点的核心在于用子空间的性质描述系统的性质。 比如说系统的能控性用能控子空间V来描述，其中V为A的不变子空间，同时为B的象空间，且是最小的子空间，则V是系统的能控子空间，V的秩可作为能控性的度量。能观性的定义类似。 以上说的是线性系统，…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "小狐狸M",
      "UrlToken": "littlefoxxxx",
      "Url": "https://www.zhihu.com/people/littlefoxxxx",
      "Gender": 2,
      "Headline": "移动机器人 / 非线性控制 / 道德表演艺术家"
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/440370644",
    "CreatedAt": 1531364072,
    "FavTime": 1773469529,
    "LikeCount": 55,
    "CommentCount": 4,
    "FavoriteCount": 68,
    "Title": "几何控制 Geometric Control 之美在于什么？",
    "Summary": "所谓的Geometric control目前大概可以分成两类，一类是利用微分几何的概念去分析非线性方程/系统，比如基于李导数的反馈线性化，中心流形定理什么的。另一类是从几何的角度对系统进行研究，利用流形/李群对系统进行描述，利用流形上积分曲线的推演过程表征系统状态的变化过程。这使得获得的数学模型与传统基于局部坐标的微分方程组不一样，因此从系统分析，如可控可观，到控制器设计、状态估计、轨迹规划等等方面都和传统的方法…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "Tensor",
      "UrlToken": "tensors",
      "Url": "https://www.zhihu.com/people/tensors",
      "Gender": 2,
      "Headline": "Engineers write the history"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/664881766",
    "CreatedAt": 1699155574,
    "FavTime": 1773469526,
    "LikeCount": 74,
    "CommentCount": 4,
    "FavoriteCount": 350,
    "Title": "非线性系统控制相关资料",
    "Summary": "2026.4前来更新，现在对非线性系统控制有了更多的理解。同时也是想对知乎上的一些内容做一个综合，方便大家还有自己学习。但是同样的，这个也是长期更新的活，没法一次就到位。这个文章将会是长期施工状态。在这里还要再次感谢知乎上的诸多大佬，是你们的分享给后来的学习者们诸多的启发！ 大三古早内容：本人对控制理论还是有很强的兴趣的，今后还会不断完善本篇文章，主要用于自己学习参考，如果能帮到其他人那就更好了。 绪可…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "共青城双子星",
      "UrlToken": "gqcshuang-zi-xing",
      "Url": "https://www.zhihu.com/people/gqcshuang-zi-xing",
      "Gender": 2,
      "Headline": "生活在数上"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/552136239",
    "CreatedAt": 1660273770,
    "FavTime": 1773469524,
    "LikeCount": 18,
    "CommentCount": 5,
    "FavoriteCount": 56,
    "Title": "SE(3)空间中四旋翼的几何跟踪控制",
    "Summary": "摘要论文标题：Geometric Tracking Control of a Quadrotor UAV on SE(3) 论文作者：Taeyoung Lee, Melvin Leoky, and N. Harris McClamroch 论文发表：2010 IEEE CDC 研究问题：四旋翼的轨迹跟踪控制 研究内容：设计了非线性轨迹跟踪控制器，克服了欧拉角的奇异性问题，能实现高机动的轨迹跟踪控制。 四旋翼的动力学运动学模型 [公式]",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "HONY",
      "UrlToken": "hnuucaszihaojun",
      "Url": "https://www.zhihu.com/people/hnuucaszihaojun",
      "Gender": 2,
      "Headline": "人生如逆旅，我亦是行人！"
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/128909334628",
    "CreatedAt": 1742532206,
    "FavTime": 1773469521,
    "LikeCount": 412,
    "CommentCount": 44,
    "FavoriteCount": 766,
    "Title": "几何控制 Geometric Control 之美在于什么？",
    "Summary": "这个话题已经好久没人回答，但是真的太重要、实在有太多想聊的了。作为后来者，补充一下自己的浅薄看法 几何是更好的语言控制学科的发展是非常可惜的：人们在控制技术的实践上走得太远太匆忙，硬生生把控制做成了工具箱式的唯象学科，工程上走得太远就会不直观和晦涩，因为整个体系并没有基于良好的品味被构建，这导致大部分控制课堂变成了冗长历史课。在我看来，控制这个话题天生就是几何的，最简单的讲法也是通过几何，因为控…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "V777",
      "UrlToken": "weiqi-50-78",
      "Url": "https://www.zhihu.com/people/weiqi-50-78",
      "Gender": 2,
      "Headline": "液压机械臂智能搬砖"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/1892483929988114312",
    "CreatedAt": 1743983800,
    "FavTime": 1773469518,
    "LikeCount": 127,
    "CommentCount": 5,
    "FavoriteCount": 379,
    "Title": "几何控制理论",
    "Summary": "欧拉博士： 贝尔曼博士，今天我们将探讨几何控制这个话题，这是控制理论领域一个引人入胜的视角。在深入探讨之前，我们先明确一下，控制理论本质上是关于如何引导动态系统从一种状态过渡到另一种状态。它起源于经典力学，并已扩展到工程、机器人等领域的应用。现在，几何控制理论旨在利用微分几何的语言和工具来研究控制系统。你准备好讨论控制理论的几何方面了吗？ 贝尔曼博士： 当然，欧拉博士，我已经准备好了。您在数学方面…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "周舒畅",
      "UrlToken": "zhou-shu-chang-45",
      "Url": "https://www.zhihu.com/people/zhou-shu-chang-45",
      "Gender": 2,
      "Headline": "AI 研究员；小鹏、阶跃、旷视、Google"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/2002328291592401820",
    "CreatedAt": 1770365720,
    "FavTime": 1773469509,
    "LikeCount": 147,
    "CommentCount": 6,
    "FavoriteCount": 340,
    "Title": "2026年RL（强化学习）在Robotics（具身智能）中的新范式分析",
    "Summary": "前言2026年的具身智能 RL 正在从“单点算法突破”转向“可扩展、可验证、可对齐”的系统范式：云端世界模型、生成式策略后训练、真实机器人三段式闭环、以及 GPU 物理仿真规模化共同构成新主线。 总体趋势是：RL 从“从零学控制”逐步变成“面向大策略/大模型的后训练（post-training）与稳健性/对齐工具”，并与世界模型、扩散策略、真实机器人数据闭环、安全约束强耦合。下面结合相关趋势，简要分析其中相关议题，便于忙碌的“…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "gurubar",
      "UrlToken": "7-26-9-23-17",
      "Url": "https://www.zhihu.com/people/7-26-9-23-17",
      "Gender": 2,
      "Headline": "Robotics, Embodied AI learning"
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/1993478691863413655",
    "CreatedAt": 1768062357,
    "FavTime": 1773341507,
    "LikeCount": 370,
    "CommentCount": 21,
    "FavoriteCount": 697,
    "Title": "是否有介于预测控制（MPC）和强化学习（RL）之间的模型？",
    "Summary": "就题目这个话题，HJB朴素求解 - MPC - RL这三个节点之间，谱系其实是连续的，这里有的是东西可以做，要踏踏实实扩充思维、深入进去，发展真正有用的工具和思想，别被资本故事忽悠瘸了。 站在现在这个年代，我们必须重新审视YuChi Ho 99年说的“ 任何控制与决策问题本质上均可归结为优化问题 ”——这个前算力时代野心勃勃的宣言。不论是什么任务，Control终究还是Control。受限于篇幅，我尝试用稍微抽象一点方式把这个故事描述完…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "V777",
      "UrlToken": "weiqi-50-78",
      "Url": "https://www.zhihu.com/people/weiqi-50-78",
      "Gender": 2,
      "Headline": "液压机械臂智能搬砖"
    }
  },
  {
    "ContentType": "answer",
    "Url": "https://www.zhihu.com/answer/2010011086049521770",
    "CreatedAt": 1772003987,
    "FavTime": 1772893329,
    "LikeCount": 991,
    "CommentCount": 95,
    "FavoriteCount": 1423,
    "Title": "明明和很多女生感觉关系已经较亲密了，为什么在尝试和她们肢体接触后，都和我翻脸了呢？",
    "Summary": "女生心中对男人有好几层欲求度。 第一层: 人还不错，态度还行，整体来说也就那样吧，不是很动心，但也可以聊聊。不讨厌，硬要约我吧，也不是不能去。大概率跟他是不可能的，但最近心里很多事儿，想找个能聊天的。如果他能给我超预期的惊喜，也不是不能试着处一下，再说吧，我无所谓。 绝无可能牵手接吻，敢碰我死定了。 第二层: 我觉得他挺好的，我也看得出他喜欢我，各方面条件还可以，作为男朋友是合格的。我愿意给他一个机会…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "茶花路莫里亚蒂",
      "UrlToken": "cha-hua-lu-mo-li-ya-ti",
      "Url": "https://www.zhihu.com/people/cha-hua-lu-mo-li-ya-ti",
      "Gender": 2,
      "Headline": "雪山千古冷，独照峨眉峰"
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/1955672775965536626",
    "CreatedAt": 1759049275,
    "FavTime": 1772893279,
    "LikeCount": 146,
    "CommentCount": 7,
    "FavoriteCount": 417,
    "Title": "清华大学提出控制系统的状态熵理论，为系统智能性的定量化分析提供全新视角",
    "Summary": "控制系统作为现代工程与科学的核心技术之一，广泛应用于自动驾驶、机器人、航空航天、电力系统等多个领域。自上世纪60年代兴起的现代控制理论使用状态空间方程作为描述工具，对系统的可控性、可观性、稳定性等基本属性进行分析。其中，可控性描述了系统是否能在有限时间内从任意初始状态转移到目标状态；可观性则衡量系统内部状态是否能通过输出信号唯一重构；稳定性则确保系统在受到扰动后仍能保持在平衡状态附近。这些性质为控…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "风间琉璃",
      "UrlToken": "67-8-38-81",
      "Url": "https://www.zhihu.com/people/67-8-38-81",
      "Gender": 2,
      "Headline": ""
    }
  },
  {
    "ContentType": "article",
    "Url": "https://zhuanlan.zhihu.com/p/1987523416065073781",
    "CreatedAt": 1768781293,
    "FavTime": 1772893221,
    "LikeCount": 204,
    "CommentCount": 2,
    "FavoriteCount": 968,
    "Title": "GitHub上一些控制算法合集",
    "Summary": "很多时候，我们在网络上，可以看到很多关于控制理论的学习资源，主要是集中在书籍、教学网站、博客、视频资源、课件等等。但是很少有看到能够集中、系统地讲解一些常见的控制算法的代码实现。 有时候，我自己也在想，有没有一个网站或者合集，能够讲解各种控制算法的实现，比如说PID算法、LQR、MPC、自适应等等。做一个控制算法合集，基础实现即可，让我们能够简单清晰地看到这些算法的基本功能和区别。至于什么编程语言，暂时不…",
    "Favlists": [
      {
        "UrlToken": 689695215,
        "Title": "我的收藏",
        "Url": "https://www.zhihu.com/collection/689695215"
      }
    ],
    "Author": {
      "Name": "萧然",
      "UrlToken": "xiao-ran-63-64",
      "Url": "https://www.zhihu.com/people/xiao-ran-63-64",
      "Gender": 2,
      "Headline": "人生如旅，步履不停，在机器人世界里探索前行！"
    }
  }
];
