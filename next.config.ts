
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.livemint.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bsmedia.business-standard.com',
        port: '',
        pathname: '/**',
      }
      // Add other common image provider hostnames if needed
      // For example, if your AI often returns images from specific CDNs:
      // {
      //   protocol: 'https',
      //   hostname: 'images.unsplash.com',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'cdn.example.com',
      // },
    ],
    // Allow any remote pattern for more flexibility if the AI returns diverse image sources
    // Be cautious with this in production due to security implications.
    // domains: [], // Deprecated, use remotePatterns
    // For Genkit returning various image URLs, this might be necessary,
    // but it's less secure.
    // dangerouslyAllowSVG: true, // If you expect SVGs
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // If needed
  },
};

export default nextConfig;
