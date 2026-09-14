import { site } from "@/lib/site";

/** ロゴマーク（吹き出し×家 = 相談と制作のセットを表現） */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-deep text-white shadow-soft ${className}`}
    >
      <svg
        viewBox="0 0 48 48"
        className="size-[64%]"
        fill="none"
        aria-hidden="true"
      >
        {/* 吹き出しの輪郭 */}
        <path
          d="M10 13.5A3.5 3.5 0 0 1 13.5 10h21A3.5 3.5 0 0 1 38 13.5v13A3.5 3.5 0 0 1 34.5 30H24l-5.5 5.2L19 30h-5.5A3.5 3.5 0 0 1 10 26.5v-13Z"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        {/* 中の家 */}
        <path
          d="M17.5 23.5 24 17l6.5 6.5"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.5 23.5v7.5h9v-7.5"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 玄関（イエローの点） */}
        <circle className="fill-midori" cx="24" cy="26.5" r="1.8" />
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
      <span className="mt-1 text-[10px] font-medium tracking-[0.28em] text-ink-mute">
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


