import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 統合・削除した旧ページから、新しいページへ誘導する
      { source: "/flow", destination: "/price", permanent: true },
      { source: "/service", destination: "/price", permanent: true },
      // よくある質問はメインページ内のセクションへ統合
      { source: "/faq", destination: "/#faq", permanent: true },
      // お申し込みフォームは廃止し、マイページ（/dashboard/payment）の購入画面へ統合
      { source: "/apply", destination: "/price", permanent: true },
    ];
  },
};

export default nextConfig;
