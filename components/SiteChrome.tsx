"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dashboard = pathname.startsWith("/dashboard");
  return (
    <>
      {!dashboard && <Header />}
      <main className="flex-1">{children}</main>
      {!dashboard && <Footer />}
      {!dashboard && <ChatWidget />}
    </>
  );
}
