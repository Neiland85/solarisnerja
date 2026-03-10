import type { NextConfig } from "next"

const nextConfig: NextConfig = {

  experimental: {
    optimizePackageImports: ["lucide-react"]
  },

  turbopack: {
    root: __dirname
  },

  typescript: {
    ignoreBuildErrors: false
  },

  eslint: {
    ignoreDuringBuilds: false
  }

}

export default nextConfig
