import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            { userAgent: "*", allow: "/", disallow: ["/api/", "/private/"] },
            { userAgent: "Googlebot", allow: "/", disallow: ["/api/"] },
            { userAgent: "Bingbot", allow: "/", disallow: ["/api/"] },
            // Allow major AI crawlers — being indexed by them is now a name-search signal.
            { userAgent: "GPTBot", allow: "/" },
            { userAgent: "PerplexityBot", allow: "/" },
            { userAgent: "ClaudeBot", allow: "/" },
            { userAgent: "Google-Extended", allow: "/" },
        ],
        sitemap: "https://ruchinaudichya.in/sitemap.xml",
        host: "https://ruchinaudichya.in",
    };
}
