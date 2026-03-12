/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ['@live-volley/ui', '@live-volley/types'],
};

module.exports = nextConfig;
