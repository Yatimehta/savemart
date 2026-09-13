/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.sabziwala.dk',
      },
      {
        protocol: 'https',
        hostname: 'sabziwala.dk',
      },
      {
        protocol: 'https',
        hostname: 'usercontent.one',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
};

export default nextConfig;
