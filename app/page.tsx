import Image from "next/image";
import Link from "next/link";
import {
  AppIcon,
  ArrowIcon,
  BoltIcon,
  CardIcon,
  ChatIcon,
  CheckIcon,
  ClockIcon,
  DocIcon,
  HouseIcon,
  MailIcon,
  YenIcon,
} from "@/components/icons";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Container } from "@/components/ui";
import { faqs, maintenance } from "@/lib/site";
import {
  basePlanDescription,
  basePlanFeatures,
  basePlanPrice,
  purchasableOptions,
  yen,
} from "@/lib/model";

/* 7ステップの流れ */
const flowSteps = [
  { no: 1, icon: MailIcon, title: "問い合わせ受付", sub: "（メール）", points: ["フォームから受付", "確認通知＋ヒアリングシート", "予算感・目的・参考サイト"], ring: "border-sky-200", bg: "bg-sky-50/70", num: "bg-sky-400 text-white" },
  { no: 2, icon: ChatIcon, title: "ヒアリングとプラン確定", sub: "（メール／チャット）", points: ["予算と目的を確認", "基本プラン or オプション", "含まれないものも明示"], ring: "border-blue-200", bg: "bg-blue-50/70", num: "bg-[#4a9ed6] text-white" },
  { no: 3, icon: DocIcon, title: "取引条件の明示", sub: "（アプリチャット）", points: ["フリーランス新法に基づく", "8項目を書面的方法で明示"], ring: "border-pink-200", bg: "bg-pink-50/70", num: "bg-[#f2688c] text-white" },
  { no: 4, icon: HouseIcon, title: "構成合意", sub: "（アプリチャット）", points: ["手書きラフを撮影して送付", "順番確認", "修正にカウントしない"], ring: "border-emerald-200", bg: "bg-emerald-50/70", num: "bg-emerald-400 text-white" },
  { no: 5, icon: AppIcon, title: "デザイン制作と修正", sub: "（アプリチャット）", points: ["修正2回まで", "3回目以降は1回3,000円", "追加作業は別途見積もり"], ring: "border-orange-200", bg: "bg-orange-50/70", num: "bg-orange-400 text-white" },
  { no: 6, icon: BoltIcon, title: "納品・検収", sub: "（アプリチャット）", points: ["テスト環境URLを共有", "検収期間：7日以内", "連絡がない場合は完了"], ring: "border-cyan-200", bg: "bg-cyan-50/70", num: "bg-cyan-500 text-white" },
  { no: 7, icon: YenIcon, title: "請求・支払い", sub: "（メール・アプリ）", points: ["請求書発行：振込依頼", "支払：納品後14日以内", "振込手数料は顧客負担"], ring: "border-indigo-200", bg: "bg-indigo-50/70", num: "bg-brand-deep text-white" },
];

const heroPoints = [
  { icon: YenIcon, top: "低価格", bottom: `${yen(basePlanPrice)}〜` },
  { icon: HouseIcon, top: "すべて", bottom: "ウェブ完結" },
  { icon: CheckIcon, top: "丁寧な対応", bottom: "安心サポート" },
  { icon: CardIcon, top: "明確な条件", bottom: "信頼の取引" },
];

export default function Home() {
  return (
    <div className="flex flex-col bg-white text-ink">
      {/* ヒーロー */}
      <section id="features" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#e8f3fb] via-[#f4f9fd] to-white" />
        <div aria-hidden="true" className="dots pointer-events-none absolute inset-0 opacity-70" />
        <div aria-hidden="true" className="glow-strong pointer-events-none absolute -top-32 left-[-6%] size-[26rem] opacity-40" />
        <div aria-hidden="true" className="glow-pink pointer-events-none absolute -bottom-24 right-[8%] size-[22rem] opacity-50" />
        <Container className="relative pb-12 pt-10 sm:pt-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <p className="inline-block -rotate-2 font-maru text-sm font-bold text-ink-soft underline decoration-[#f2688c]/50 decoration-wavy underline-offset-8">
                はじめてのWebサイトでも安心
              </p>
              <h1 className="mt-4 font-maru font-bold leading-[1.25] tracking-tight">
                <span className="block text-[1.9rem] sm:text-4xl">
                  <span className="text-[#f2688c]">低価格</span>
                  <span className="mx-2 text-ink-soft">×</span>
                  <span className="text-gradient-blue">ウェブ完結</span>
                </span>
                <span className="mt-1 block text-[1.7rem] text-brand-deep sm:text-4xl">
                  Web制作サービス
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-8 text-ink-soft">
                個人事業主・小規模事業者のための、
                問い合わせから支払い・やり取り・納品まで
                すべてウェブ上で完結するWebサイト制作サービスです。
              </p>
              <ul className="mt-6 grid max-w-md grid-cols-4 gap-2">
                {heroPoints.map((p) => (
                  <li key={p.bottom} className="text-center">
                    <span className="mx-auto grid size-12 place-items-center rounded-full bg-white text-brand shadow-card ring-1 ring-line">
                      <p.icon className="size-5" />
                    </span>
                    <span className="mt-2 block text-[11px] font-bold leading-5 text-ink">
                      {p.top}
                      <br />
                      {p.bottom}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#f2688c] px-7 py-3.5 text-[15px] font-bold text-white shadow-[0_12px_26px_-10px_rgb(242_104_140_/_0.6)] transition-all hover:-translate-y-0.5 hover:brightness-105">
                  <MailIcon className="size-5" />
                  無料で相談する
                </Link>
                <Link href="/price" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-bold text-ink shadow-card ring-1 ring-line transition-all hover:-translate-y-0.5 hover:text-brand-dark">
                  料金プランを見る
                </Link>
              </div>
            </div>
            <div className="relative">
              <p className="absolute -top-7 right-2 z-10 hidden rotate-3 text-right font-maru text-xs font-bold leading-6 text-ink-soft sm:block">
                小さなお店・個人の想いを
                <br />
                Webで応援します！
              </p>
              <div aria-hidden="true" className="glow-soft absolute -inset-8" />
              <div className="relative flex items-end justify-center gap-3">
                <div className="relative w-[78%] overflow-hidden rounded-2xl border-[6px] border-ink bg-white shadow-lift">
                  <Image src="/header.png" alt="制作したカフェサイトのイメージ" width={1000} height={640} priority className="h-auto w-full object-cover" />
                </div>
                <div className="relative w-[22%] overflow-hidden rounded-2xl border-4 border-ink bg-white shadow-lift">
                  <Image src="/header.png" alt="スマートフォン表示のイメージ" width={300} height={620} className="h-44 w-full object-cover object-top sm:h-56" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      {/* 料金プラン */}
      <section id="plan" className="scroll-mt-24 bg-white">
        <Container className="py-14 sm:py-16">
          <h2 className="font-maru text-2xl font-bold text-brand-deep">料金プラン</h2>
          <p className="mt-1 text-xs leading-6 text-ink-soft">
            まずは基本プランから、ご要望に応じてオプションもご用意しています。
          </p>
          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.25fr_0.9fr]">
            <div className="rounded-2xl border-2 border-[#f6b8c7] bg-[#fff7f9] p-6">
              <span className="inline-block rounded-full bg-[#f2688c] px-3 py-1 text-[11px] font-bold text-white">
                基本プラン
              </span>
              <p className="mt-3 font-maru font-bold text-brand-deep">
                <span className="text-4xl text-[#f2688c]">{yen(basePlanPrice)}</span>
                <span className="ml-2 rounded-full bg-[#f2688c]/15 px-2.5 py-1 align-middle text-[11px] font-bold text-[#c14a68]">
                  1ページ
                </span>
              </p>
              <ul className="mt-4 space-y-2 text-xs leading-6 text-ink">
                <li className="flex gap-1.5">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-[#f2688c]" />
                  デザイン：要望を反映（テンプレートベース＋調整）
                </li>
                {basePlanFeatures.map((f) => (
                  <li key={f} className="flex gap-1.5">
                    <CheckIcon className="mt-1 size-4 shrink-0 text-[#f2688c]" />
                    {f}
                  </li>
                ))}
                <li className="flex gap-1.5">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-[#f2688c]" />
                  修正回数：2回まで（3回目以降は1回3,000円）
                </li>
                <li className="flex gap-1.5">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-[#f2688c]" />
                  納品形式：データ納品（オンライン）
                </li>
              </ul>
              <p className="mt-3 text-[11px] leading-5 text-ink-soft">{basePlanDescription}</p>
              <Link href="/price" className="mt-4 block rounded-full bg-[#f2688c] px-4 py-2.5 text-center text-sm font-bold text-white transition-all hover:brightness-105">
                料金プランをくわしく見る
              </Link>
            </div>
            <div id="option" className="scroll-mt-24 rounded-2xl border border-line bg-white p-6 shadow-card">
              <h3 className="font-maru text-base font-bold text-brand-deep">
                オプション <span className="text-xs font-medium text-ink-soft">（都度見積もり）</span>
              </h3>
              <ul className="mt-4 divide-y divide-line text-sm">
                {purchasableOptions.slice(0, 6).map((o) => (
                  <li key={o.id} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="flex items-center gap-2 font-bold text-ink">
                      <span className="grid size-7 place-items-center rounded-lg bg-brand-soft text-brand">
                        <DocIcon className="size-4" />
                      </span>
                      <span className="text-[13px]">{o.name}</span>
                    </span>
                    <span className="whitespace-nowrap text-[13px] font-bold text-ink-soft">
                      {o.displayPrice ?? `${yen(o.defaultPrice)}〜`}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/price" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand hover:text-brand-dark">
                すべてのオプションを見る <ArrowIcon className="size-4" />
              </Link>
            </div>
            <div className="rounded-2xl border border-[#cde8e0] bg-[#eef7f3] p-6">
              <h3 className="font-maru text-base font-bold text-brand-deep">
                維持費 <span className="text-xs font-medium text-ink-soft">（任意）</span>
              </h3>
              <p className="mt-3 flex items-center gap-2 font-maru text-xl font-bold text-brand-deep">
                <ClockIcon className="size-6 text-emerald-500" />
                月額 {maintenance.price}
              </p>
              <p className="mt-1 text-[11px] text-ink-soft">{maintenance.priceNote}</p>
              <div className="mt-4 border-t border-emerald-900/10 pt-3">
                <p className="text-xs font-bold text-ink">含まれるもの</p>
                <ul className="mt-1.5 space-y-1 text-[11px] leading-5 text-ink-soft">
                  <li>・サーバー・ドメイン管理</li>
                  <li>・軽微な修正2回まで</li>
                  <li>・セキュリティ更新</li>
                </ul>
              </div>
              <div className="mt-3 border-t border-emerald-900/10 pt-3">
                <p className="text-xs font-bold text-ink">含まれないもの</p>
                <ul className="mt-1.5 space-y-1 text-[11px] leading-5 text-ink-soft">
                  <li>・コンテンツ新規追加</li>
                  <li>・デザイン変更</li>
                  <li>・機能追加</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>
      {/* サービスの流れ */}
      <section id="flow" className="scroll-mt-24 bg-[#f7fafd]">
        <Container className="py-14 sm:py-16">
          <h2 className="font-maru text-2xl font-bold text-brand-deep">
            サービスの流れ
            <span className="ml-3 align-middle text-xs font-medium text-ink-soft">
              7つのステップで、安心してご依頼いただけます。
            </span>
          </h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {flowSteps.map((s) => (
              <li key={s.no} className={`flex flex-col rounded-2xl border p-4 ${s.ring} ${s.bg}`}>
                <span className={`grid size-7 place-items-center rounded-full font-maru text-sm font-bold ${s.num}`}>{s.no}</span>
                <span className="mx-auto mt-2 grid size-11 place-items-center rounded-full bg-white text-brand-deep shadow-card ring-1 ring-line">
                  <s.icon className="size-5" />
                </span>
                <p className="mt-2 text-center text-[13px] font-bold leading-6 text-ink">
                  {s.title}
                  <span className="block text-[10px] font-medium text-ink-soft">{s.sub}</span>
                </p>
                <ul className="mt-2 space-y-1 border-t border-ink/10 pt-2 text-[11px] leading-5 text-ink-soft">
                  {s.points.map((pt) => (
                    <li key={pt} className="flex gap-1"><span aria-hidden="true">・</span>{pt}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          {/* 支払い・法務・口座・注意 */}
          <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.3fr_1fr]">
            <div id="payment" className="scroll-mt-24 rounded-2xl border border-line bg-white p-5 shadow-card">
              <h3 className="flex items-center gap-2 font-maru text-sm font-bold text-brand-deep">
                <span className="grid size-7 place-items-center rounded-lg bg-brand-soft text-brand"><CardIcon className="size-4" /></span>
                支払い方法
              </h3>
              <dl className="mt-4 space-y-3 text-xs leading-6">
                <div className="flex gap-3 border-b border-dashed border-line pb-3">
                  <dt className="w-16 shrink-0 font-bold text-ink">原則</dt>
                  <dd className="text-ink-soft">頭金のみ（契約締結後7日以内に一括前払い）</dd>
                </div>
                <div className="flex gap-3 border-b border-dashed border-line pb-3">
                  <dt className="w-16 shrink-0 font-bold text-ink">2分割</dt>
                  <dd className="text-ink-soft">頭金50％＋納品後50％（各回の支払期日を明記）</dd>
                </div>
                <div className="flex gap-3 border-b border-dashed border-line pb-3">
                  <dt className="w-16 shrink-0 font-bold text-ink">振込手数料</dt>
                  <dd className="text-ink-soft">顧客負担</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 font-bold text-ink">決済代行</dt>
                  <dd className="text-ink-soft">Square請求書（クレジットカード対応可）</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <h3 className="flex items-center gap-2 font-maru text-sm font-bold text-brand-deep">
                <span className="grid size-7 place-items-center rounded-lg bg-brand-soft text-brand"><DocIcon className="size-4" /></span>
                法的対応事項
              </h3>
              <div className="mt-3 text-[11px] leading-6 text-ink-soft">
                <p className="font-bold text-ink">フリーランス新法への対応</p>
                <ul className="mt-1 space-y-0.5">
                  <li>・取引条件の明示（給付内容をアプリチャットで）</li>
                  <li>・支払期日：受領日から60日以内</li>
                  <li>・書面交付義務（やり取りの場合は速やかに交付）</li>
                  <li>・記録保存（チャットのスクリーンショット）</li>
                </ul>
                <p className="mt-2 font-bold text-ink">著作権への対応</p>
                <ul className="mt-1 space-y-0.5">
                  <li>・フリー素材または顧客支給</li>
                  <li>・他サイトのHTML／CSSのコピーは禁止</li>
                  <li>・著作権の帰属を契約時に明確化</li>
                  <li>・著作者人格権を行使しない旨の承諾</li>
                </ul>
                <p className="mt-2 font-bold text-ink">決済サービス</p>
                <ul className="mt-1 space-y-0.5">
                  <li>・Square：クレジットカード／請求書／サブスク</li>
                  <li>・銀行振込：振込内容メールで対応（法的義務クリア）</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
                <h3 className="flex items-center gap-2 font-maru text-sm font-bold text-brand-deep">
                  <span className="grid size-7 place-items-center rounded-lg bg-brand-soft text-brand"><HouseIcon className="size-4" /></span>
                  口座・決済
                </h3>
                <dl className="mt-3 space-y-2.5 text-[11px] leading-6">
                  <div className="flex gap-3 rounded-xl bg-cream px-3 py-2">
                    <dt className="w-16 shrink-0 font-bold text-ink">口座</dt>
                    <dd className="text-ink-soft">個人口座で開始（実績を積んでから屋号付き口座へ移行）</dd>
                  </div>
                  <div className="flex gap-3 rounded-xl bg-cream px-3 py-2">
                    <dt className="w-16 shrink-0 font-bold text-ink">決済代行</dt>
                    <dd className="text-ink-soft">Square（本人確認が必要）</dd>
                  </div>
                  <div className="flex gap-3 rounded-xl bg-cream px-3 py-2">
                    <dt className="w-16 shrink-0 font-bold text-ink">維持費回収</dt>
                    <dd className="text-ink-soft">Square請求書の定期請求（契約PDF発行可能）</dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-2xl border border-[#f6b8c7] bg-[#fff7f9] p-5">
                <h3 className="flex items-center gap-2 font-maru text-sm font-bold text-[#c14a68]">
                  <span className="grid size-6 place-items-center rounded-full bg-[#f2688c] text-sm font-bold text-white">!</span>
                  運用上の注意点
                </h3>
                <ol className="mt-3 space-y-1.5 text-[11px] leading-5 text-ink-soft">
                  <li><span className="mr-1 inline-grid size-4 place-items-center rounded-full bg-[#f2688c] text-[10px] font-bold text-white">1</span>何でも受け入れる危険（自社アプリ制作は別途見積もり）</li>
                  <li><span className="mr-1 inline-grid size-4 place-items-center rounded-full bg-[#f2688c] text-[10px] font-bold text-white">2</span>修正回数の上限を明記（無制限は破綻）</li>
                  <li><span className="mr-1 inline-grid size-4 place-items-center rounded-full bg-[#f2688c] text-[10px] font-bold text-white">3</span>工数記録を必ず取る（ページ時間動向を把握）</li>
                  <li><span className="mr-1 inline-grid size-4 place-items-center rounded-full bg-[#f2688c] text-[10px] font-bold text-white">4</span>安さではなく丁寧さで選ばれる（信頼の勝）</li>
                </ol>
              </div>
            </div>
          </div>
        </Container>
      </section>
      {/* よくある質問 */}
      <section id="faq" className="scroll-mt-24 bg-white">
        <Container className="py-14 sm:py-16">
          <h2 className="text-center font-maru text-2xl font-bold text-brand-deep">よくある質問</h2>
          <p className="mt-1 text-center text-xs text-ink-soft">気になることをまとめました。</p>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-7 text-ink-soft">
            ここにない質問は、
            <Link href="/contact" className="font-bold text-brand underline decoration-brand/30 underline-offset-4 hover:text-brand-dark">
              お問い合わせフォーム
            </Link>
            からお気軽にどうぞ。
          </p>
        </Container>
      </section>
      {/* 下部CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#bcdcf3] via-[#d9ecf9] to-[#f2f8fd]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#9cc8e8]/40 to-transparent" />
        <Container className="relative py-14 text-center sm:py-16">
          <p className="-rotate-2 font-maru text-sm font-bold text-ink-soft">
            あなたのビジネスをWebで応援します。
          </p>
          <Link href="/contact" className="mx-auto mt-5 inline-flex items-center gap-3 rounded-full bg-[#f2688c] px-10 py-4 font-maru text-lg font-bold text-white">
            <MailIcon className="size-5" />
            今すぐお問い合わせ
            <span aria-hidden="true">›</span>
          </Link>
          <p className="mt-3 text-xs text-ink-soft">まずはお気軽にご相談ください。</p>
        </Container>
        <div className="relative bg-brand-deep py-3 text-center text-[11px] text-white/80">
          Web制作サポート — あなたの想いを、Webでカタチに
        </div>
      </section>
    </div>
  );
}
