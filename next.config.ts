import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const NextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['child_process', 'fs', 'path'],
  // Allow all hosts for Replit environment
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
};

export default withMDX(NextConfig);