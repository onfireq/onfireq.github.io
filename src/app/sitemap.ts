import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://onfireq.github.io';
  
  // 获取所有博客文章
  const posts = getAllPosts();
  const blogUrls = posts.map((post) => {
    const publishedAt = new Date(post.date);
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      ...(!Number.isNaN(publishedAt.getTime()) ? { lastModified: publishedAt } : {}),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  return [
    {
      url: baseUrl,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/skills`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...blogUrls,
  ];
}
