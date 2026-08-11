// 知乎个人数据 - 从知乎开放平台手动导出
// 导出方法:
// 1. 访问 https://developer.zhihu.com/hotlist
// 2. 切换到"用户的创作"，点击"查看接口返回格式"
// 3. 或用 zhihu-cli: & "$env:LOCALAPPDATA\ZhihuCLI\current\zhihu-cli.exe" me contents --type all --limit 50
// 4. 复制 JSON 到 zhihu_raw.json，运行 python3 sync_zhihu.py

export interface ZhihuContent {
  type: "answer" | "article" | "pin";
  title: string;
  url: string;
  summary: string;
  likeCount: number;
  commentCount: number;
  createdAt: number;
}

export const zhihuContents: ZhihuContent[] = [];
