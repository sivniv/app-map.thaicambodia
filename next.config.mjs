/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ['facebook.com', 'scontent.com'],
  },
  eslint: {
    // Allow production builds to successfully complete even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;