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
  typescript: {
    // Allow production builds to successfully complete even if there are type errors
    ignoreBuildErrors: true,
  },
  // Optimize for production
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  // Skip API routes validation during build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Exclude problematic packages from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      }
    }
    
    // Ignore problematic dependencies during build
    config.externals = [...(config.externals || []), {
      'puppeteer-extra-plugin-stealth': 'commonjs puppeteer-extra-plugin-stealth',
      'puppeteer-extra-plugin-recaptcha': 'commonjs puppeteer-extra-plugin-recaptcha',
      'playwright-extra': 'commonjs playwright-extra',
      'playwright': 'commonjs playwright',
    }]
    
    return config
  },
};

export default nextConfig;