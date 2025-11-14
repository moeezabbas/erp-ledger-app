/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GOOGLE_SCRIPT_URL: process.env.GOOGLE_SCRIPT_URL,
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
