// 分类配置
export interface Category {
  slug: string;
  name: string;
  description?: string;
  directories?: string[];
}

export const CATEGORIES: Category[] = [
  { slug: "tech", name: "技术", description: "偏振控制、FPGA、全栈开发等技术笔记" },
  { slug: "timing", name: "时序", description: "FPGA 时序约束、CDC、DAC/ADC 调试" },
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
