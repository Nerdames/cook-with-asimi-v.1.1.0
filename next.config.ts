/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.sanity.io', 'picsum.photos'], // <-- add picsum.photos here
  },
}

module.exports = nextConfig
