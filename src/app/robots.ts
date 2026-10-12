import type { MetadataRoute } from 'next';
import { config } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/la-so/', '/xem', '/admin', '/api/', '/huy-dang-ky'] },
    sitemap: `${config.siteUrl}/sitemap.xml`,
  };
}
