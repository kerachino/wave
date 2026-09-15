import type { Metadata } from "next";
import { M_PLUS_Rounded_1c, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { site } from "@/lib/site";
import { AuthProvider } from "@/components/AuthProvider";
import { basePlanPrice, yen } from "@/lib/model";

const notoSans = Noto_Sans_JP({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const display = M_PLUS_Rounded_1c({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ホームページ制作代行`,
    template: `%s | ${site.name}`,
  },
  description: `${site.tagline} 地域の法人・店舗さま向けのホームページ制作を、基本プラン${yen(basePlanPrice)}＋付け足し形式でご提供。スマホ対応・相談しやすい運営が特徴です。`,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: site.name,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${notoSans.variable} ${display.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <SiteChrome>{children}</SiteChrome>
        </AuthProvider>
      </body>
    </html>
  );
}
