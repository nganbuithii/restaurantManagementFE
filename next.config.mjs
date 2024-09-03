/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: process.env.NODE_ENV === 'development',
    pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
    images: {
        domains: ['res.cloudinary.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/dp0daqkme/image/upload/**',
            },
        ],
    },
};

export default nextConfig;
