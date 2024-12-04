/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        NEXT_PUBLIC_PUBLIC_KEY: process.env.NEXT_PUBLIC_PUBLIC_KEY,
        PRIVATE_KEY: process.env.NEXT_PUBLIC_PRIVATE_KEY,
    },
};

export default nextConfig;

