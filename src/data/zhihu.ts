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

// 当前为空，请运行 python3 sync_zhihu.py 同步你的真实知乎数据
// 或手动添加你知乎上实际的内容
export const zhihuContents: ZhihuContent[] = [];
