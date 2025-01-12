/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      appDir: true, // Keep if you're using the App Directory feature
    },
    serverExternalPackages: ["mongoose"], // Updated field name for external server-side packages
    images: {
      domains: ["lh3.googleusercontent.com"], // Allow images from this domain
    },
    webpack(config) {
      config.experiments = {
        ...config.experiments,
        topLevelAwait: true, // Enable top-level await
      };
      return config;
    },
  };
  
  export default nextConfig;
  