/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // iztro dùng i18next khởi tạo lúc import — giữ nguyên module phía server
  serverExternalPackages: ['iztro'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
      { source: '/la-so/:id*', headers: [{ key: 'Referrer-Policy', value: 'no-referrer' }, { key: 'X-Robots-Tag', value: 'noindex' }] },
    ];
  },
};

export default nextConfig;
