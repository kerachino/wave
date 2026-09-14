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
          className={`inline-flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-brand ${
            center ? "justify-center" : ""
          }`}
        >
          <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 font-maru text-2xl font-bold tracking-tight leading-snug text-ink sm:text-3xl">
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
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200";
  const sizes = {
    md: "px-6 py-3 text-sm",
    lg: "px-7 py-3.5 text-[15px]",
  };
  const variants = {
    primary:
      "bg-brand text-white shadow-soft hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-lift",
    secondary:
      "bg-white text-ink shadow-card ring-1 ring-line hover:-translate-y-0.5 hover:text-brand-dark hover:ring-brand/40",
    ghost: "text-brand hover:text-brand-dark",
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

/** カード（ヘアライン境界＋控えめな影） */
export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-white shadow-card ${className}`}
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


