import Link from "next/link";
import { Container } from "@/components/ui";

/** サブページ共通のタイトルヘッダー */
export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="relative overflow-hidden border-b border-line bg-cream">
      <div aria-hidden="true" className="dots pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="glow-strong pointer-events-none absolute -top-24 right-[-6%] size-72 opacity-40"
      />
      <div
        aria-hidden="true"
        className="glow-amber pointer-events-none absolute -top-20 left-[-4%] size-56 opacity-40"
      />
      <Container className="relative py-14 sm:py-16">
        <nav aria-label="パンくず" className="flex items-center gap-1.5 text-xs text-ink-mute">
          <Link href="/" className="transition-colors hover:text-brand">
            トップページ
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-ink-soft">{title}</span>
        </nav>
        {eyebrow && (
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-bold tracking-[0.18em] text-brand shadow-card">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-maru text-3xl font-bold tracking-tight leading-snug text-ink sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-sm leading-8 text-ink-soft sm:text-base">
            {description}
          </p>
        )}
      </Container>
    </div>
  );
}

