import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  Dices,
  Link2,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Swords,
  UserRound,
  Users,
} from "lucide-react";
import { api } from "@/lib/api";
import { getSeatedUserId, getSessionUsername } from "@/lib/actor";
import { hueFor } from "@/lib/hue";
import { getLang, makeT, type ServerT } from "@/lib/i18n-server";
import type { GameTable } from "@/lib/types";

export const dynamic = "force-dynamic";

/* ============================================================
   `/` — a página pública.

   Ela vende a mesa antes de pedir qualquer coisa: o que dá para
   fazer, como se entra e uma campanha aberta em destaque. O login
   é uma porta separada (`/login`) e o hub de mesas só aparece
   depois que a pessoa entra.
   ============================================================ */

function sigilLetters(title: string): string {
  const words = title.split(/\s+/).filter((word) => /[A-Za-z0-9À-ÿ]/.test(word));
  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function Sigil({ name, size = 56 }: { name: string; size?: number }) {
  const hue = hueFor(name || "VKRPG");
  return (
    <div
      className="relative grid place-items-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" className="absolute inset-0" style={{ width: size, height: size }}>
        <circle cx="32" cy="32" r="27" fill="none" stroke={hue.ring} strokeWidth="1.5" />
        <circle
          cx="32"
          cy="32"
          r="27"
          fill="none"
          stroke={hue.dot}
          strokeWidth="0.75"
          strokeDasharray="1.5 6"
          strokeDashoffset="14"
        />
      </svg>
      <span
        className="relative z-10 font-mono font-bold leading-none"
        style={{ color: hue.dot, fontSize: size * 0.36, letterSpacing: "-0.02em" }}
      >
        {sigilLetters(name || "VKRPG")}
      </span>
    </div>
  );
}

function Ticket({ table, signedIn, t }: { table: GameTable | null; signedIn: boolean; t: ServerT }) {
  const title = table?.title?.trim() || t("pg.land.ticketFallbackTitle");
  const system = table?.system?.trim() || "GURPS";
  const players = table?.players?.length ?? 0;
  const narrator = table?.narrator?.name || table?.narrator?.username || t("pg.hub.you");

  return (
    <div className="relative w-full max-w-md mx-auto lg:ml-auto">
      <div
        aria-hidden
        className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-2xl border border-amber-500/20"
      />

      <article className="relative rounded-2xl border border-zinc-700/70 bg-zinc-950/95 shadow-2xl shadow-black/50">
        <div className="px-6 pt-5 pb-5">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-amber-400/90">
              {t("pg.land.ticketEyebrow")}
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-800/50 bg-emerald-950/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-emerald-300">
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              {t("pg.land.tablesEyebrow")}
            </span>
          </div>

          <div className="mt-5 flex items-start gap-4">
            {table ? (
              <Sigil name={table.title || table.id} size={58} />
            ) : (
              <div className="grid place-items-center w-[58px] h-[58px] shrink-0 rounded-full border border-dashed border-zinc-600/70 text-zinc-500">
                <Dices className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-400">
                {system}
              </p>
              <h2 className="font-serif text-2xl leading-tight tracking-tight text-zinc-100 mt-1">
                {title}
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-stone-400 line-clamp-3">
            {table?.intro?.trim() || t("pg.land.ticketFallbackBody")}
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-zinc-800/80 pt-4">
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                {t("f.narrator")}
              </dt>
              <dd className="mt-1 flex items-center gap-1.5 text-xs text-zinc-300">
                <UserRound className="w-3.5 h-3.5 text-zinc-400" />
                <span className="truncate">{narrator}</span>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                {t("pg.narrator.statPlayers")}
              </dt>
              <dd className="mt-1 flex items-center gap-1.5 text-xs text-zinc-300">
                <Users className="w-3.5 h-3.5 text-zinc-400" />
                {(players === 1 ? t("pg.land.ticketPlayersOne") : t("pg.land.ticketPlayers")).replace(
                  "{n}",
                  String(players)
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative border-t border-dashed border-zinc-700/80">
          <span
            aria-hidden
            className="absolute -left-2 -top-2 w-4 h-4 rounded-full border border-zinc-700/70 bg-zinc-900"
          />
          <span
            aria-hidden
            className="absolute -right-2 -top-2 w-4 h-4 rounded-full border border-zinc-700/70 bg-zinc-900"
          />
          <div className="flex items-center justify-between gap-3 px-6 py-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-400">
              VKRPG · {t("pg.land.ticketSeat")}
            </span>
            <Link
              href={
                table
                  ? `/join/${table.id}`
                  : signedIn
                    ? "/table/new"
                    : "/login?next=/table/new"
              }
              className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-3 py-1.5 text-xs font-bold text-zinc-950 hover:bg-amber-400 transition-colors"
            >
              {table ? t("pg.land.ticketSeat") : t("pg.land.ticketCreate")}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="border-t border-zinc-800 pt-5">
      <span className="grid place-items-center w-9 h-9 rounded-lg border border-zinc-700/60 bg-zinc-900 text-emerald-300">
        {icon}
      </span>
      <h3 className="mt-4 text-sm font-bold text-zinc-100">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-zinc-400">{body}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="relative pl-12 md:pl-0 md:pt-12">
      <span className="absolute left-0 top-0 md:left-0 md:top-0 grid place-items-center w-8 h-8 rounded-full border border-amber-500/30 bg-zinc-950 font-mono text-[10px] font-bold text-amber-300">
        {n}
      </span>
      <span
        aria-hidden
        className="absolute left-4 top-8 bottom-0 w-px bg-zinc-800 md:hidden"
      />
      <h3 className="font-serif text-xl text-zinc-100">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>
    </div>
  );
}

export default async function Home() {
  const [tables, seat, cookieUsername, lang] = await Promise.all([
    api<GameTable[]>("/game-tables").catch(() => [] as GameTable[]),
    getSeatedUserId(),
    getSessionUsername(),
    getLang(),
  ]);

  const t = makeT(lang);
  const list = (tables ?? []).filter((table) => Boolean(table?.id));
  const featured = list[0] ?? null;
  const more = list.slice(1, 4);
  const signedIn = Boolean(seat);
  const username = cookieUsername || null;

  const eyebrow =
    list.length > 0
      ? (list.length === 1 ? t("pg.land.eyebrowCountOne") : t("pg.land.eyebrowCount")).replace(
          "{n}",
          String(list.length)
        )
      : t("pg.land.eyebrow");

  return (
    <div className="overflow-hidden">
      {/* ---------------- hero ---------------- */}
      <section className="relative border-b border-zinc-800/80">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_-10%,rgba(245,158,11,0.10),transparent_55%),radial-gradient(ellipse_at_88%_90%,rgba(16,185,129,0.08),transparent_50%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.3] [background-image:radial-gradient(circle_at_1px_1px,rgba(113,113,122,0.28)_1px,transparent_0)] [background-size:26px_26px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-[-8rem] w-[34rem] h-[34rem] rounded-full border border-amber-500/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 right-[-2rem] w-[22rem] h-[22rem] rounded-full border border-amber-500/10"
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-16 md:pt-24 md:pb-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-16 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-900/60 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.24em] text-amber-300/90">
              <Sparkles className="w-3 h-3" />
              {eyebrow}
            </p>

            <h1 className="font-serif text-[2.9rem] leading-[0.98] tracking-[-0.03em] text-zinc-100 mt-6 md:text-[4.1rem] max-w-2xl">
              {t("pg.land.title")}
            </h1>

            <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-stone-400">
              {t("pg.land.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={signedIn ? "/tables" : "/login?next=/tables"}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-950/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              >
                {signedIn ? t("pg.land.ctaTables") : t("pg.land.ctaStart")}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#como-funciona"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700/70 px-5 py-3 text-sm font-medium text-zinc-300 hover:border-zinc-500/70 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/50"
              >
                {t("pg.land.ctaHow")}
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/80" />
                {t("pg.land.noInstall")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-sky-500/80" />
                {t("pg.land.roles")}
              </span>
              {signedIn && username ? (
                <span className="inline-flex items-center gap-1.5 text-zinc-400">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  {username}
                </span>
              ) : null}
            </div>
          </div>

          <Ticket table={featured} signedIn={signedIn} t={t} />
        </div>
      </section>

      {/* ---------------- o que tem na mesa ---------------- */}
      <section className="relative max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-emerald-400/90">
              {t("pg.land.featuresEyebrow")}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl leading-[1.05] tracking-tight text-zinc-100 mt-3">
              {t("pg.land.featuresTitle")}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
            <Feature
              icon={<ScrollText className="w-4 h-4" />}
              title={t("pg.land.feature1Title")}
              body={t("pg.land.feature1Body")}
            />
            <Feature
              icon={<BookOpen className="w-4 h-4" />}
              title={t("pg.land.feature2Title")}
              body={t("pg.land.feature2Body")}
            />
            <Feature
              icon={<Link2 className="w-4 h-4" />}
              title={t("pg.land.feature3Title")}
              body={t("pg.land.feature3Body")}
            />
            <Feature
              icon={<Users className="w-4 h-4" />}
              title={t("pg.land.feature4Title")}
              body={t("pg.land.feature4Body")}
            />
          </div>
        </div>
      </section>

      {/* ---------------- como funciona ---------------- */}
      <section id="como-funciona" className="scroll-mt-20 border-y border-zinc-800/80 bg-zinc-950/40">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-xl">
            <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-amber-400/90">
              {t("pg.land.howEyebrow")}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl leading-[1.05] tracking-tight text-zinc-100 mt-3">
              {t("pg.land.howTitle")}
            </h2>
          </div>

          <div className="relative mt-10 grid md:grid-cols-3 gap-8 md:gap-10">
            <span
              aria-hidden
              className="absolute left-0 right-0 top-4 hidden md:block h-px bg-zinc-800"
            />
            <Step n="01" title={t("pg.land.step1Title")} body={t("pg.land.step1Body")} />
            <Step n="02" title={t("pg.land.step2Title")} body={t("pg.land.step2Body")} />
            <Step n="03" title={t("pg.land.step3Title")} body={t("pg.land.step3Body")} />
          </div>
        </div>
      </section>

      {/* ---------------- mesas abertas ---------------- */}
      {more.length > 0 ? (
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-sky-400/90">
                {t("pg.land.tablesEyebrow")}
              </p>
              <h2 className="font-serif text-3xl md:text-4xl leading-[1.05] tracking-tight text-zinc-100 mt-3">
                {t("pg.land.tablesTitle")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {t("pg.land.tablesBody")}
              </p>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {more.map((table) => {
              const players = table.players?.length ?? 0;
              const narrator =
                table.narrator?.name || table.narrator?.username || t("pg.narrator.theNarrator");
              return (
                <Link
                  key={table.id}
                  href={`/join/${table.id}`}
                  className="group flex flex-col rounded-xl border border-zinc-700/60 bg-zinc-900/50 p-5 hover:border-zinc-500/70 hover:bg-zinc-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/50"
                >
                  <div className="flex items-start gap-3">
                    <Sigil name={table.title || table.id} size={40} />
                    <div className="min-w-0">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                        {table.system?.trim() || "GURPS"}
                      </p>
                      <h3 className="mt-1 text-base font-bold leading-tight text-zinc-100 truncate">
                        {table.title?.trim() || t("pg.noTitle")}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-4 flex-1 text-xs leading-relaxed text-zinc-400 line-clamp-2">
                    {table.intro?.trim() || t("pg.land.ticketNoIntro")}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-zinc-800 pt-3">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                      <UserRound className="w-3 h-3" />
                      <span className="truncate max-w-[8rem]">{narrator}</span>
                      <span className="text-zinc-500">·</span>
                      {(players === 1 ? t("pg.land.ticketPlayersOne") : t("pg.land.ticketPlayers")).replace(
                        "{n}",
                        String(players)
                      )}
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-sky-300 group-hover:text-sky-200 transition-colors">
                      {t("pg.land.tablesOpen")}
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* ---------------- fecho ---------------- */}
      <section className="px-6 pb-16 md:pb-20">
        <div className="relative max-w-6xl mx-auto overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-950 to-emerald-950/40 px-6 py-12 md:px-12 md:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full border border-amber-500/15"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-6 right-8 w-44 h-44 rounded-full border border-amber-500/10"
          />

          <div className="relative flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-2xl">
              <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-amber-400/90">
                {t("pg.land.closeEyebrow")}
              </p>
              <h2 className="font-serif text-3xl md:text-5xl leading-[1.02] tracking-tight text-zinc-100 mt-3">
                {t("pg.land.closeTitle")}
              </h2>
              <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed text-stone-400">
                {t("pg.land.closeBody")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={signedIn ? "/tables" : "/login?next=/tables"}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-bold text-zinc-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-950/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
              >
                {signedIn ? t("pg.land.ctaTables") : t("pg.land.closeCta")}
                <ArrowRight className="w-4 h-4" />
              </Link>
              {signedIn ? (
                <Link
                  href="/table/new"
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-700/70 px-5 py-3 text-sm font-medium text-zinc-300 hover:border-zinc-500/70 hover:text-white transition-colors"
                >
                  <CalendarClock className="w-4 h-4" />
                  {t("pg.newTable")}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- rodapé ---------------- */}
      <footer className="border-t border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-400">
            {t("pg.land.footRights")}
          </p>
          <p className="text-xs text-zinc-400">{t("pg.land.footNote")}</p>
        </div>
      </footer>
    </div>
  );
}
