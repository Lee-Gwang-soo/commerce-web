/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ Production에서 타입 에러를 무시합니다.
    // TODO: 타입 에러 수정 후 이 옵션 제거 필요
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Production에서 ESLint 경고를 무시합니다.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "esnmmlqzmlnygtmdxdvq.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
