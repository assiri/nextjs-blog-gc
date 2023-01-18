/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["images.unsplash.com", "openweathermap.org"],
  },
};

module.exports = nextConfig;
