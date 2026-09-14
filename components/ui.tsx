import Link from "next/link";
import type { ReactNode } from "react";

/** ページ幅を揃えるラッパー */
export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

/** セクション */
export function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`py-16 sm:py-20 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/** セクション見出し */
export function SectionHeading({
  eyebrow,
  title,
  description,
  center = true,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`${center ? "mx-auto text-center" : ""} max-w-2xl ${className}`}
    >
      {eyebrow && (
        <p className="text-sm font-bold tracking-widest text-brand">{eyebrow}</p>
      )}
      <h2 className="mt-2 font-maru text-2xl font-bold leading-snug text-ink sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-sm leading-7 text-ink-soft sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

/** ボタン風リンク */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all";
  const sizes = {
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };
  const variants = {
    primary:
      "brand-sheen bg-brand text-white shadow-md hover:bg-brand-dark hover:shadow-lg",
    secondary:
      "bg-white text-ink ring-1 ring-ink/15 hover:ring-brand hover:text-brand",
    ghost: "text-brand hover:text-brand-deep",
  };
  return (
    <Link
      href={href}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

/** カード */
export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-3xl border border-ink/10 bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

/** 小さなバッジ */
export function Badge({
  children,
  color = "brand",
  className = "",
}: {
  children: ReactNode;
  color?: "brand" | "midori" | "ink";
  className?: string;
}) {
  const colors = {
    brand: "bg-brand-soft text-brand-deep",
    midori: "bg-midori-soft text-midori-dark",
    ink: "bg-ink text-white",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}
