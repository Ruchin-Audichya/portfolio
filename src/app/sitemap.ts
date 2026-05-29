import { MetadataRoute } from 'next';
import { content } from '@/lib/content';
import { getAllPosts } from '@/lib/mdx';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://ruchinaudichya.in';
    const lastModified = new Date();

    const coreRoutes = [
        { route: '', priority: 1.0, changeFreq: 'weekly' as const },
        { route: '/blog', priority: 0.7, changeFreq: 'weekly' as const },
    ];

    const projectRoutes = content.projects.map((project, index) => ({
        route: `/projects/${project.slug}`,
        priority: index < 2 ? 0.9 : 0.7,
        changeFreq: 'monthly' as const,
    }));

    let blogRoutes: { route: string; priority: number; changeFreq: 'weekly' | 'monthly' }[] = [];
    try {
        blogRoutes = getAllPosts().map((post) => ({
            route: `/blog/${post.slug}`,
            priority: 0.6,
            changeFreq: 'monthly' as const,
        }));
    } catch {
        blogRoutes = [];
    }

    return [...coreRoutes, ...projectRoutes, ...blogRoutes].map(({ route, priority, changeFreq }) => ({
        url: `${baseUrl}${route}`,
        lastModified,
        changeFrequency: changeFreq,
        priority,
    }));
}
