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
        destination: 'http://127.0.0.1:8081/api/auth/:slug',
      },
      // Proxy tất cả API khác (không phải /api/auth/*)
      {
        source: '/api/:path((?!auth(?:/|$)).*)',
        destination: 'http://127.0.0.1:8081/api/:path*',
      },
    ]
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
}

module.exports = nextConfig
