import type { MetadataRoute } from 'next';
import { config } from '@/lib/config';
import { MAJOR_STARS } from '@/lib/engine/names';
import { LESSONS } from '@/content/lessons';
import { PALACE_NAMES, starHref } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${config.siteUrl}${p}`;
  const fixed = ['/', '/tu-dien', '/phuong-phap', '/nghien-cuu', '/hoc', '/sao', '/chinh-gio', '/bang-gia', '/bao-mat', '/dieu-khoan'];
  return [
    ...fixed.map((p) => ({ url: u(p) })),
    ...LESSONS.map((l) => ({ url: u(`/hoc/${l.slug}`) })),
    ...MAJOR_STARS.map((s) => ({ url: u(starHref(s)) })),
    ...MAJOR_STARS.flatMap((s) => PALACE_NAMES.map((p) => ({ url: u(starHref(s, p)) }))),
  ];
}
