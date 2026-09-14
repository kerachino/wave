import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 統合・削除した旧ページから、新しいページへ誘導する
      { source: "/flow", destination: "/price", permanent: true },
      { source: "/service", destination: "/price", permanent: true },
    ];
  },
};

export default nextConfig;
