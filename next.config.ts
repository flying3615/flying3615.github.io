import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',      // generate static files in out/
  basePath: '/resume',   // matches https://flying3615.github.io/resume
  trailingSlash: true,   // GitHub Pages needs index.html in each directory
};

export default nextConfig;
