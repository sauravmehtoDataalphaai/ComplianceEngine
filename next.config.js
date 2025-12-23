/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable Turbopack to avoid symlink issues on Windows
  // Use webpack instead
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude pg and related packages from server-side bundling
      // Since we're using localStorage, these aren't needed
      config.externals = config.externals || [];
      config.externals.push({
        'pg': 'commonjs pg',
        'pg-native': 'commonjs pg-native',
        'drizzle-orm': 'commonjs drizzle-orm',
        'drizzle-orm/node-postgres': 'commonjs drizzle-orm/node-postgres',
      });
    }
    return config;
  },
  // Add empty turbopack config to silence the warning
  turbopack: {},
}

module.exports = nextConfig

