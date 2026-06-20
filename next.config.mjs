/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports for GitHub Pages
  // Configure basePath if you're deploying to a subdirectory
  // basePath: '/repo-name', // Uncomment and replace with your repository name if needed
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Required for static export
  },
  // This ensures trailing slashes are handled correctly
  trailingSlash: true,
}

export default nextConfig
