import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://ruchinaudichya.in';
    const lastModified = new Date();

    // Core routes with priorities
    const coreRoutes = [
        { route: '', priority: 1.0, changeFreq: 'weekly' as const },
        { route: '/projects', priority: 0.9, changeFreq: 'weekly' as const },
        { route: '/blog', priority: 0.8, changeFreq: 'weekly' as const },
        { route: '/work', priority: 0.7, changeFreq: 'monthly' as const },
        { route: '/shop', priority: 0.6, changeFreq: 'monthly' as const },
    ];

    const routes = coreRoutes.map(({ route, priority, changeFreq }) => ({
        url: `${baseUrl}${route}`,
        lastModified,
        changeFrequency: changeFreq,
        priority,
    }));

    return routes;
}
