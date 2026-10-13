// 分类配置
export interface Category {
  slug: string;
  name: string;
  description?: string;
  directories?: string[];
  showWhenEmpty?: boolean;
}

export const CATEGORIES: Category[] = [
  { slug: "tech", name: "技术", description: "偏振控制、FPGA、全栈开发等技术笔记" },
  { slug: "timing", name: "时序", description: "FPGA 时序约束、CDC、DAC/ADC 调试" },
  {
    slug: "imx6ull",
    name: "i.MX6ULL",
    description: "嵌入式 Linux、开发板实践与应用编程笔记",
    directories: ["Linux-imx6ull"],
  },
  {
    slug: "humanities",
    name: "人文",
    description: "历史、文化、阅读与日常观察，从一个问题开始思考",
    directories: ["人文"],
    showWhenEmpty: true,
  },
  { slug: "guide", name: "攻略", description: "工具使用、教程、生活经验" },
  {
    slug: "libo",
    name: "李勃老师课程笔记",
    description: "李勃老师课程的学习笔记",
    directories: ["李勃老师课程笔记"],
  },
  { slug: "default", name: "其他", description: "未分类" },
];

export function getCategoryName(slug: string): string {
  const c = CATEGORIES.find(c => c.slug === slug);
  return c ? c.name : slug;
}
