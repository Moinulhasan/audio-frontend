import { MetadataRoute } from 'next'

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/private/', '/admin/', '/api/'],
        },
        sitemap: 'https://econotes.moinul4u.com/sitemap.xml',
    }
}
