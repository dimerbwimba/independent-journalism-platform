/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; img-src 'self' https: data:; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-src 'self' https://*.youtube.com https://*.vimeo.com; connect-src 'self' https://api.ipify.org https://ipapi.co"
          },
        ],
      },
    ]
  },
  experimental: {
    missingSuspenseWithCSRBailout: false
  }
}

module.exports = nextConfig 