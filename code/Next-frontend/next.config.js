/** @type {import('next').NextConfig} */
const DEFAULT_BACKEND_URL = "https://lms-backend-345298684510.europe-west1.run.app";
const backendUrl = process.env.BACKEND_INTERNAL_URL || process.env.BACKEND_URL || DEFAULT_BACKEND_URL;
const backendHostname = new URL(backendUrl).hostname;

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: "standalone",
    // 🔄 Proxy API requests to backend to avoid CORS issues during development
    async rewrites() {
        return [
            // Proxy backend auth endpoints (login, register, google) — nhưng KHÔNG proxy NextAuth routes
            {
                source: "/api/auth/:slug(login|register|activate|resend-activation|google|forgot-password|verify-otp|reset-password|change-password|refresh-token|logout)",
                destination: `${backendUrl}/api/auth/:slug`,
            },
            // Proxy tất cả API khác (không phải /api/auth/*)
            {
                source: "/api/:path((?!auth(?:/|$)).*)",
                destination: `${backendUrl}/api/:path*`,
            },
        ];
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
            {
                protocol: "https",
                hostname: "covers.openlibrary.org",
            },
            {
                protocol: "http",
                hostname: "localhost",
            },
            {
                protocol: "http",
                hostname: "127.0.0.1",
            },
            {
                protocol: "https",
                hostname: backendHostname,
            },
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
            },
        ],
    },
};

module.exports = nextConfig;
