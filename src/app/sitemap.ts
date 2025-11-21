import { MetadataRoute } from 'next'
import { content } from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://ruchinaudichya.in'

    // Get all project URLs
    const projectUrls = content.projects.map((project) => ({
        url: `${baseUrl}/work/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        ...projectUrls,
    ]
}
