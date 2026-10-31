import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import { getSeatedUserId } from "@/lib/actor";
import { safeNextPath } from "@/lib/authTarget";
import { getLang, makeT } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

/* ============================================================
   /login — entrada convencional (usuário + senha).

   A landing continua pública em `/`. Quem já tem sessão e abre
   esta rota é levado direto para o destino pedido (ou para o hub
   de mesas). O formulário em si vive em LoginForm.
   ============================================================ */

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const next = safeNextPath(sp.next);

  if (await getSeatedUserId()) redirect(next ?? "/tables");

  const t = makeT(await getLang());

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(16,185,129,0.10),transparent_55%),radial-gradient(ellipse_at_90%_90%,rgba(245,158,11,0.08),transparent_50%)]"
      />

      <div className="relative max-w-5xl mx-auto px-6 py-12 md:py-20 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
        <section className="max-w-md">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber-400/90">
            {t("pg.login.eyebrow")} · VKRPG
          </p>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight text-zinc-100 mt-4">
            {t("pg.login.title")}
          </h1>
          <p className="text-stone-400 text-sm md:text-base leading-relaxed mt-5">
            {t("pg.login.subtitle")}
          </p>

          <div className="mt-8 border-l border-zinc-700/70 pl-4 space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              {t("pg.login.afterTitle")}
            </p>
            <p className="text-xs text-zinc-500 leading-relaxed">{t("pg.login.afterBody")}</p>
          </div>
        </section>

        <section className="relative rounded-2xl border border-zinc-700/60 bg-zinc-950/70 p-6 md:p-8 shadow-2xl shadow-black/30 overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-24 -right-20 w-64 h-64 rounded-full border border-emerald-800/40"
          />
          <div
            aria-hidden
            className="absolute -top-10 -right-6 w-40 h-40 rounded-full border border-emerald-800/30"
          />

          <div className="relative">
            <LoginForm next={next} />
          </div>

          <Link
            href="/"
            className="relative inline-flex items-center gap-2 mt-7 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t("pg.login.back")}
          </Link>
        </section>
      </div>
    </div>
  );
}
