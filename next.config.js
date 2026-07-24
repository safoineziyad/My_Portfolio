/** @type {import('next').NextConfig} */
const TASK_DASHBOARD_API_URL = process.env.TASK_DASHBOARD_API_URL || '';

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
  async rewrites() {
    const rewrites = [
      {
        source: '/cafe',
        destination: '/cafe/index.html',
      },
      {
        source: '/cafe-api/:path*',
        destination: '/api/cafe-api/:path*',
      },
    ];

    if (TASK_DASHBOARD_API_URL) {
      rewrites.push({
        source: '/task-api/:path*',
        destination: `${TASK_DASHBOARD_API_URL}/api/:path*`,
      });
    }

    return rewrites;
  },
  headers: async () => {
    const connectSrcDirectives = ["'self'", 'ws:', 'wss:'];
    if (TASK_DASHBOARD_API_URL) {
      try {
        const url = new URL(TASK_DASHBOARD_API_URL);
        connectSrcDirectives.push(url.origin);
      } catch {
        // ignore invalid URL
      }
    }

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com https://s.ytimg.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://rsms.me",
              "font-src 'self' https://fonts.gstatic.com https://rsms.me",
              "img-src 'self' data: https://images.unsplash.com https://img.youtube.com",
              `connect-src ${connectSrcDirectives.join(' ')}`,
              "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
