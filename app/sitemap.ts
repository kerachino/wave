import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const base = site.url.replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/service", priority: 0.9 },
    { path: "/price", priority: 0.9 },
    { path: "/flow", priority: 0.8 },
    { path: "/works", priority: 0.7 },
    { path: "/faq", priority: 0.8 },
    { path: "/contact", priority: 0.9 },
    { path: "/apply", priority: 0.8 },
    { path: "/operator", priority: 0.5 },
    { path: "/law", priority: 0.4 },
    { path: "/privacy", priority: 0.4 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
}