// 知乎个人数据 - 从知乎开放平台 / zhihu-cli 手动导出
// 来源: https://developer.zhihu.com/hotlist 切换到"用户的创作"
// 或: & "$env:LOCALAPPDATA\ZhihuCLI\current\zhihu-cli.exe" me contents --type all --limit 50
// 运行 python3 sync_zhihu.py 从 zhihu_raw.json 自动填充

export interface ZhihuContent {
  type: "answer" | "article" | "pin";
  title: string;
  url: string;
  summary: string;
  likeCount: number;
  commentCount: number;
  createdAt: number;
}

export interface ZhihuStats {
  answerCount: number;
  articleCount: number;
  pinCount: number;
  totalLikes: number;
  totalComments: number;
  likes: number;
  thanks: number;
  favorites: number;
}

// 数据来自你提供的截图 (91 次赞同 / 45 次喜欢 / 60 次收藏)
export const zhihuContents: ZhihuContent[] = [];

export const zhihuStats: ZhihuStats = {
  answerCount: 17,
  articleCount: 2,
  pinCount: 0,
  totalLikes: 91,
  totalComments: 0,
  likes: 91,
  thanks: 45,
  favorites: 60,
};
