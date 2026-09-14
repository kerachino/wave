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
    <div className="border-b border-ink/10 bg-cream">
      <Container className="py-12">
        <nav aria-label="パンくず" className="text-xs text-ink-mute">
          <Link href="/" className="hover:text-brand">
            トップページ
          </Link>
          <span aria-hidden="true"> / </span>
          {title}
        </nav>
        {eyebrow && (
          <p className="mt-3 text-sm font-bold tracking-widest text-brand">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 font-maru text-2xl font-bold text-ink sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-soft">
            {description}
          </p>
        )}
      </Container>
    </div>
  );
}