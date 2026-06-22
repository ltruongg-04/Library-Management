/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 🔄 Proxy API requests to backend to avoid CORS issues during development
  async rewrites() {
    return [
      // Proxy backend auth endpoints (login, register, google) — nhưng KHÔNG proxy NextAuth routes
      {
        source: '/api/auth/:slug(login|register|google)',
        destination: 'http://localhost:8081/api/auth/:slug',
      },
      // Proxy tất cả API khác (không phải /api/auth/*)
      {
        source: '/api/:path((?!auth(?:/|$)).*)',
        destination: 'http://localhost:8081/api/:path*',
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
}

module.exports = nextConfig
