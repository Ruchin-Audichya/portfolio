import { MetadataRoute } from 'next';
import { content } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://ruchinaudichya.in';
    const lastModified = new Date('2026-05-25');

    const coreRoutes = [
        { route: '', priority: 1.0, changeFreq: 'weekly' as const },
        { route: '/blog', priority: 0.8, changeFreq: 'weekly' as const },
        { route: '/blog/building-this-portfolio', priority: 0.7, changeFreq: 'monthly' as const },
    ];

    const projectRoutes = content.projects.map((project, index) => ({
        route: `/projects/${project.slug}`,
        priority: index < 2 ? 0.9 : 0.75,
        changeFreq: 'monthly' as const,
    }));

    return [...coreRoutes, ...projectRoutes].map(({ route, priority, changeFreq }) => ({
        url: `${baseUrl}${route}`,
        lastModified,
        changeFrequency: changeFreq,
        priority,
    }));
}
