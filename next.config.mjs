/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.printify.com' },
      { protocol: 'https', hostname: 'cdn.printflow.et' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3000'] },
  },
}

export default nextConfig
