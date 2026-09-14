import { site } from "@/lib/site";

/** ロゴマーク（家とつながりのノード） */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-xl bg-brand text-white shadow-sm ${className}`}
    >
      <svg
        viewBox="0 0 48 48"
        className="size-[60%]"
        fill="none"
        aria-hidden="true"
      >
        {/* roof */}
        <path
          d="M11 27 L24 13 L37 27"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* walls */}
        <path
          d="M15 27 L15 36 L33 36 L33 27"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* connect node on the roof peak */}
        <circle className="fill-[#ffd9c4]" cx="24" cy="13" r="3.5" />
      </svg>
    </span>
  );
}

/** ワードマーク（屋号） */
export function Wordmark() {
  return (
    <span className="flex flex-col leading-none">
      <span className="font-maru text-lg font-bold tracking-tight text-ink">
        {site.name}
      </span>
      <span className="mt-1 text-[10px] font-medium tracking-[0.2em] text-ink-soft">
        WEB CREATION SERVICE
      </span>
    </span>
  );
}

/** ヘッダー用ロゴ */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="size-10" />
      <Wordmark />
    </span>
  );
}
