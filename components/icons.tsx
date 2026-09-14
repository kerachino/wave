import type { ReactNode } from "react";

type IconProps = { className?: string };

function Svg({
  className,
  children,
  title,
}: IconProps & { children: ReactNode; title?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className ?? "size-6"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      role="img"
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

/** 価格（円マーク） */
export function YenIcon({ className }: IconProps) {
  return (
    <Svg className={className} title="価格">
      <path d="M12 4l0 16M9.5 8.5l5 0M9.5 8.5l1.6 1.6 1.6-1.6 1.6 1.6 1.6-1.6" />
      <path d="M14.5 8.5l1.6 1.6 1.6-1.6 1.6 1.6 1.6-1.6" />
    </Svg>
  );
}

/** スピード（稲妻） */
export function BoltIcon({ className }: IconProps) {
  return (
    <Svg className={className} title="スピード">
      <path d="M13.5 4L11 7 14 10 11.5 13 15 16 12.5 20" />
    </Svg>
  );
}

/** スマホ対応（端末） */
export function PhoneIcon({ className }: IconProps) {
  return (
    <Svg className={className} title="スマホ対応">
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <rect x="8.5" y="7" width="7" height="10" rx="1" fill="currentColor" opacity="0.9" />
      <path d="M18 20l-4 0" />
    </Svg>
  );
}

/** 地域密着（家） */
export function HouseIcon({ className }: IconProps) {
  return (
    <Svg className={className} title="地域密着">
      <path d="M8 11L12 5 16 11" />
      <path d="M10 11L10 18 14 18 14 11" />
    </Svg>
  );
}

/** メール */
export function MailIcon({ className }: IconProps) {
  return (
    <Svg className={className} title="メール">
      <rect x="4" y="5" width="16" height="12" rx="2" />
      <path d="M4 5h16M4 9h16M4 14h6M4 14L4 17M10 14L10 17h6 0" />
      <path d="M3 6L2 3h9 0" strokeWidth="1.4" />
    </Svg>
  );
}

/** チャット（吹き出し） */
export function ChatIcon({ className }: IconProps) {
  return (
    <Svg className={className} title="チャット">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </Svg>
  );
}

/** チェック */
export function CheckIcon({ className }: IconProps) {
  return (
    <Svg className={className} title="チェック">
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeWidth="2.5" />
    </Svg>
  );
}

/** 文書 */
export function DocIcon({ className }: IconProps) {
  return (
    <Svg className={className} title="文書">
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <rect x="8.5" y="8" width="7" height="2" rx="1" />
      <rect x="8.5" y="12" width="7" height="2" rx="1" />
    </Svg>
  );
}

/** カード */
export function CardIcon({ className }: IconProps) {
  return (
    <Svg className={className} title="カード決済">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M6 9L20 9" />
      <circle cx="7" cy="16" r="1.4" />
      <circle cx="10.6" cy="16" r="1.4" />
      <circle cx="14.2" cy="16" r="1.4" />
    </Svg>
  );
}

/** 矢印（→） */
export function ArrowIcon({ className }: IconProps) {
  return (
    <Svg className={className ?? "size-5"} title="進む">
      <path d="M4 12l14 0M4 12l6 5M18 12L12 17" strokeWidth="2" />
    </Svg>
  );
}

/** 目安・返信（壁時計） */
export function ClockIcon({ className }: IconProps) {
  return (
    <Svg className={className} title="返信目安">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 6l0 12M12 12l3.5 2.5" strokeWidth="2.2" />
    </Svg>
  );
}