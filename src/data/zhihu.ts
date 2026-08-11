// 知乎个人数据 - 从知乎开放平台 / zhihu-cli 手动导出
// 来源: https://developer.zhihu.com/hotlist 切换到"用户的创作"
// 或: & "$env:LOCALAPPDATA\ZhihuCLI\current\zhihu-cli.exe" me contents --type all --limit 50

export interface ZhihuContent {
  type: "answer" | "article" | "pin";
  title: string;
  url: string;
  summary: string;
  likeCount: number;
  commentCount: number;
  createdAt: number;
}

export const zhihuContents: ZhihuContent[] = [
  {
    type: "answer",
    title: "对于一个理科生物类专业的，想学物理光学这本书，去学工程光学里的物理光学好，还是物理光学好？",
    url: "https://www.zhihu.com/answer/1955682103816898677390",
    summary: "看你对什么方向更感兴趣吧，工程光学大部分都在讨论成像，就是各种镜头。",
    likeCount: 4,
    commentCount: 0,
    createdAt: 1759509498,
  },
  {
    type: "article",
    title: "分享一个高线更新Arduino的ESP32库的方法",
    url: "https://zhuanlan.zhihu.com/p/1911352839244092570",
    summary: "我们直接进入这个页面，点击最新最下面找到 JSON文件 拉下来打开后的 JSON文件长这个样子 简单分析一下结构 看到 packages里面是 ESP32库所有版本的信息 tools是所有工具的所有版本 platforms里面用到的所有工具库的下载链接都可以在 tools里面找到。",
    likeCount: 32,
    commentCount: 2,
    createdAt: 1748485339,
  },
  {
    type: "answer",
    title: "为什么有人读博士会抑郁？",
    url: "https://www.zhihu.com/answer/1952395766413899739",
    summary: "中科大光学工程硕士来答一波，光学中水半偏振光和垂直偏振光与o光和e光是一个东西吗？",
    likeCount: 7,
    commentCount: 1,
    createdAt: 1758267424,
  },
  {
    type: "pin",
    title: "为什么孔径角不是入瞳光锥决定分辨率?",
    url: "https://www.zhihu.com/pin/1828988236183244800",
    summary: "如果把分辨率看成细节的能力，这个细节应该迎刃而解了。",
    likeCount: 0,
    commentCount: 0,
    createdAt: 1728844776,
  },
  {
    type: "pin",
    title: "口腔溃疡快速缓解小妙招: 试试熊胆薄荷漱口水",
    url: "https://www.zhihu.com/pin/1948188285152232982",
    summary: "口腔溃疡是真痛，吃啥都不香，试试熊胆薄荷漱口水。",
    likeCount: 0,
    commentCount: 0,
    createdAt: 1757264282,
  },
  {
    type: "pin",
    title: "为什么很多内容农场乱编内容却没有被封？",
    url: "https://www.zhihu.com/pin/1851415597377794049",
    summary: "内容农场多如牛毛。",
    likeCount: 0,
    commentCount: 0,
    createdAt: 1734191876,
  },
];
