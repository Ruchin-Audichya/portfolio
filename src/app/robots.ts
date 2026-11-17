import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            { userAgent: "*", allow: "/", disallow: ["/api/", "/private/", "/admin"] },
            { userAgent: "Googlebot", allow: "/", disallow: ["/api/", "/admin"] },
            { userAgent: "Bingbot", allow: "/", disallow: ["/api/", "/admin"] },
            // Allow major AI crawlers — being indexed by them is now a name-search signal.
            { userAgent: "GPTBot", allow: "/" },
            { userAgent: "PerplexityBot", allow: "/" },
            { userAgent: "ClaudeBot", allow: "/" },
            { userAgent: "Google-Extended", allow: "/" },
        ],
        sitemap: "https://www.ruchinaudichya.in/sitemap.xml",
        host: "https://www.ruchinaudichya.in",
    };
}
