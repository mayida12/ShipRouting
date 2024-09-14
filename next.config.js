/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpg|gif)$/i,
      type: 'asset/resource'
    })
    return config
  },
}

module.exports = nextConfig
