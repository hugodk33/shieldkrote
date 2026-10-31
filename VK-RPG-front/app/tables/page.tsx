import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Dices, Link2, Plus, ShieldCheck, Swords } from "lucide-react";
import TableCard from "@/components/tables/TableCard";
import { api } from "@/lib/api";
import { getSeatedUserId, getSessionUsername } from "@/lib/actor";
import { getLang, makeT } from "@/lib/i18n-server";
import { isSuperAdmin } from "@/lib/superAdmin";
import type { UserTables } from "@/lib/types";

export const dynamic = "force-dynamic";

/* ============================================================
   /tables — o hub depois do login.

   Duas estantes, não um papel escolhido para sempre: "Narrando"
   reúne as mesas que a pessoa conduz (dona ou narradora convidada)
   e "Jogando" as mesas em que tem assento. Quem faz as duas coisas
   vê as duas seções; quem tem várias mesas vê todas.
   ============================================================ */

function SectionTitle({
  id,
  icon,
  title,
  hint,
  action,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  hint: string;
  action?: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24 flex flex-wrap items-end justify-between gap-3 mb-4">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold text-zinc-100">
          {icon}
          {title}
        </h2>
        <p className="text-xs text-zinc-500 mt-1">{hint}</p>
      </div>
      {action}
    </div>
  );
}

export default async function TablesPage() {
  const [seat, t, cookieUsername] = await Promise.all([
    getSeatedUserId(),
    getLang().then(makeT),
    getSessionUsername(),
  ]);

  if (!seat) redirect("/login?next=/tables");

  const data = await api<UserTables>(`/users/${encodeURIComponent(seat)}/tables`).catch(
    () => null
  );

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="rounded-2xl border border-zinc-700/60 bg-zinc-900/50 p-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-red-400/80">
            {t("pg.hub.loadErrorEyebrow")}
          </p>
          <p className="text-sm text-zinc-400 mt-2">{t("pg.hub.loadError")}</p>
          <Link
            href="/login"
            className="inline-block mt-5 rounded-md border border-zinc-700/60 px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
          >
            {t("pg.nav.login")}
          </Link>
        </div>
      </div>
    );
  }

  const username = data.user.username || cookieUsername || "";
  const total = new Set([...data.narrating, ...data.playing].map((table) => table.id)).size;
  const empty = total === 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 md:py-14">
      <header className="relative rounded-2xl border border-zinc-700/60 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-6 md:p-8 overflow-hidden mb-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-16 w-72 h-72 rounded-full border border-emerald-800/30"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-4 right-8 w-48 h-48 rounded-full border border-emerald-800/20"
        />

        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-emerald-400/90">
              {t("pg.hub.eyebrow")}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-zinc-100 mt-2">
              {t("pg.hub.title")}
            </h1>
            <p className="text-sm text-stone-400 mt-3 leading-relaxed">
              {username
                ? t("pg.hub.welcome").replace("{name}", username)
                : t("pg.hub.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-zinc-700/50 bg-zinc-900/70 px-4 py-3 text-center min-w-[5rem]">
              <div className="font-mono text-2xl font-bold text-emerald-400 leading-none">
                {data.narrating.length}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 mt-1.5">
                {t("pg.hub.narrating")}
              </div>
            </div>
            <div className="rounded-lg border border-zinc-700/50 bg-zinc-900/70 px-4 py-3 text-center min-w-[5rem]">
              <div className="font-mono text-2xl font-bold text-sky-400 leading-none">
                {data.playing.length}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 mt-1.5">
                {t("pg.hub.playing")}
              </div>
            </div>
          </div>
        </div>
      </header>

      {isSuperAdmin(data.user) ? (
        <Link
          href="/admin"
          className="group mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-amber-900/50 bg-gradient-to-r from-zinc-900 via-zinc-950 to-amber-950/20 px-5 py-4 transition-colors hover:border-amber-700/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/60"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-amber-600/40 bg-amber-950/30 text-amber-300">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-mono text-[10px] uppercase tracking-[0.26em] text-amber-400/90">
              {t("admin.hub.eyebrow")}
            </span>
            <span className="mt-0.5 block text-sm text-zinc-300">{t("admin.hub.body")}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 transition-colors group-hover:text-amber-200">
            {t("admin.hub.open")}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      ) : null}

      {empty ? (
        <div className="rounded-2xl border border-dashed border-zinc-700/70 bg-zinc-900/30 px-6 py-16 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-zinc-500">
            {t("pg.hub.emptyAllEyebrow")}
          </p>
          <h2 className="font-serif text-2xl text-zinc-200 mt-3">{t("pg.hub.emptyAll")}</h2>
          <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto leading-relaxed">
            {t("pg.hub.emptyAllBody")}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/table/new"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t("pg.newTable")}
            </Link>
            <span className="inline-flex items-center gap-2 text-xs text-zinc-500">
              <Link2 className="w-3.5 h-3.5" />
              {t("pg.hub.inviteHint")}
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          <section aria-labelledby="narrating">
            <SectionTitle
              id="narrating"
              icon={<Dices className="w-5 h-5 text-emerald-400" />}
              title={t("pg.hub.narrating")}
              hint={t("pg.hub.narratingHint")}
              action={
                <Link
                  href="/table/new"
                  className="inline-flex items-center gap-1.5 rounded-md border border-emerald-800/50 bg-emerald-950/30 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/40 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t("pg.hub.newTable")}
                </Link>
              }
            />
            {data.narrating.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.narrating.map((table) => (
                  <TableCard
                    key={`narrating-${table.id}`}
                    table={table}
                    mode="narrating"
                    userId={seat}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 px-5 py-8 text-center text-sm text-zinc-500">
                {t("pg.hub.emptyNarrating")}
              </p>
            )}
          </section>

          <section aria-labelledby="playing">
            <SectionTitle
              id="playing"
              icon={<Swords className="w-5 h-5 text-sky-400" />}
              title={t("pg.hub.playing")}
              hint={t("pg.hub.playingHint")}
            />
            {data.playing.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.playing.map((table) => (
                  <TableCard
                    key={`playing-${table.id}`}
                    table={table}
                    mode="playing"
                    userId={seat}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 px-5 py-8 text-center text-sm text-zinc-500">
                {t("pg.hub.emptyPlaying")}
              </p>
            )}
          </section>

          <p className="flex items-center justify-center gap-2 pt-2 text-center font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            <Link2 className="w-3 h-3" />
            {t("pg.hub.inviteHint")}
          </p>
        </div>
      )}
    </div>
  );
}
