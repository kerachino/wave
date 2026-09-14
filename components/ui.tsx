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
    <section id={id} className={`py-16 sm:py-24 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/** セクション見出し（エメラルドのドットつきラベル） */
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
        <p
          className={`inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold tracking-[0.16em] text-brand ${
            center ? "justify-center" : ""
          }`}
        >
          <span aria-hidden="true" className="size-1.5 rounded-full bg-midori" />
          {eyebrow}
        </p>
      )}
      <h2
        className={`${eyebrow ? "mt-3 " : ""}font-maru text-2xl font-bold tracking-tight leading-snug text-ink sm:text-3xl`}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-sm leading-8 text-ink-soft sm:text-base">
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
  variant?: "primary" | "secondary" | "ghost" | "accent" | "dark";
  size?: "md" | "lg";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-200 active:scale-[0.98]";
  const sizes = {
    md: "px-6 py-3 text-sm",
    lg: "px-7 py-3.5 text-[15px]",
  };
  const variants = {
    primary:
      "bg-brand text-white shadow-[0_12px_26px_-10px_rgb(37_99_235_/_0.55)] hover:-translate-y-0.5 hover:bg-brand-dark",
    secondary:
      "bg-white text-ink shadow-card ring-1 ring-line hover:-translate-y-0.5 hover:text-brand-dark hover:ring-brand/40",
    ghost: "text-brand hover:text-brand-dark",
    accent:
      "bg-midori text-ink shadow-[0_12px_26px_-10px_rgb(251_191_36_/_0.6)] hover:-translate-y-0.5 hover:brightness-105",
    dark: "bg-white/10 text-white ring-1 ring-white/20 backdrop-blur hover:-translate-y-0.5 hover:bg-white/15",
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

/** カード（大きな角丸でポップに） */
export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-3xl border border-line bg-white shadow-card ${className}`}
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
    brand: "bg-brand-soft text-brand-deep ring-1 ring-inset ring-brand/20",
    midori: "bg-midori-soft text-midori-dark ring-1 ring-inset ring-midori/30",
    ink: "bg-ink text-white",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}


