import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',      // generate static files in out/
  trailingSlash: true,   // GitHub Pages needs index.html in each directory
};

export default nextConfig;
