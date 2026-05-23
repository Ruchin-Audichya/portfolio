import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://ruchinaudichya.in';
    const lastModified = new Date();

    // Core routes with priorities
    const coreRoutes = [
        { route: '', priority: 1.0, changeFreq: 'weekly' as const },
        { route: '/blog', priority: 0.8, changeFreq: 'weekly' as const },
        { route: '/projects/medifastrx', priority: 0.9, changeFreq: 'monthly' as const },
        { route: '/projects/placify-ai', priority: 0.85, changeFreq: 'monthly' as const },
        { route: '/projects/portfolio-v1', priority: 0.75, changeFreq: 'monthly' as const },
    ];

    const routes = coreRoutes.map(({ route, priority, changeFreq }) => ({
        url: `${baseUrl}${route}`,
        lastModified,
        changeFrequency: changeFreq,
        priority,
    }));

    return routes;
}
