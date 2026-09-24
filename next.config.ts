import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['localhost', process.env.DEV_HOST].filter((origin): origin is string =>
    Boolean(origin)
  ),
};

export default nextConfig;
