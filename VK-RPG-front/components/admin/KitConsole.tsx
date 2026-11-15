"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FolderTree, Plus } from "lucide-react";
import { interpolate, useTranslation } from "@/lib/i18n";
import { inputCls, labelCls, submitCls, disabledSubmitCls } from "@/components/forms/formStyles";
import { submitJson } from "@/components/forms/submit";
import type { ContentCatalog, ContentModuleRow } from "@/lib/types";

/* ============================================================
   KitConsole — registro dos kits (content_modules).

   Rota exclusiva do superadmin (`/admin/kits`). Cada idioma tem
   o seu próprio acervo: um kit EN só aparece no assistente de
   mesas EN, e vice-versa. Aqui o d3miurg0 vê os dois acervos e
   registra novos pacotes no idioma escolhido.
   ============================================================ */

type Lang = "en" | "pt";
type Filter = "all" | Lang;

type Notice = { kind: "ok" | "error"; text: string } | null;

type KitDraft = {
  lang: Lang;
  name: string;
  slug: string;
  techLevel: string;
  accent: string;
  description: string;
  sort: string;
};

const DOMAINS = [
  "skill",
  "item",
  "advantage",
  "disadvantage",
  "npc",
  "location",
] as const;

const EMPTY_KIT: KitDraft = {
  lang: "pt",
  name: "",
  slug: "",
  techLevel: "",
  accent: "",
  description: "",
  sort: "",
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  );
}

function NoticeLine({ notice }: { notice: Notice }) {
  if (!notice) return null;
  return (
    <p
      role={notice.kind === "error" ? "alert" : "status"}
      className={`mt-3 rounded-lg border px-3 py-2 text-xs leading-snug ${
        notice.kind === "error"
          ? "border-red-800/60 bg-red-950/30 text-red-300"
          : "border-emerald-800/60 bg-emerald-950/30 text-emerald-300"
      }`}
    >
      {notice.text}
    </p>
  );
}

function sortModules(modules: ContentModuleRow[]): ContentModuleRow[] {
  return [...modules].sort(
    (a, b) =>
      a.lang.localeCompare(b.lang) ||
      a.sort - b.sort ||
      a.name.localeCompare(b.name)
  );
}

function langLabel(lang: string): string {
  return lang === "en" ? "EN" : "PT";
}

export default function KitConsole({
  actorId,
  initialCatalog,
}: {
  actorId: string;
  initialCatalog: ContentCatalog;
}) {
  const { t } = useTranslation();
  const router = useRouter();

  const [catalog, setCatalog] = useState<ContentCatalog>(initialCatalog);
  const [filter, setFilter] = useState<Filter>("all");
  const [kit, setKit] = useState<KitDraft>(EMPTY_KIT);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const countsByModule = useMemo(() => {
    const map = new Map<string, Map<string, number>>();
    for (const row of catalog.counts) {
      const key = `${row.lang}:${row.moduleId}`;
      const domainMap = map.get(key) ?? new Map<string, number>();
      domainMap.set(row.domain, (domainMap.get(row.domain) ?? 0) + row.count);
      map.set(key, domainMap);
    }
    return map;
  }, [catalog.counts]);

  const modules = useMemo(
    () =>
      sortModules(catalog.modules).filter(
        (module) => filter === "all" || module.lang === filter
      ),
    [catalog.modules, filter]
  );

  const actorQuery = `?actor=${encodeURIComponent(actorId)}`;

  async function submitKit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!kit.name.trim()) {
      setNotice({ kind: "error", text: t("admin.form.required") });
      return;
    }

    setBusy(true);
    setNotice(null);
    try {
      const created = await submitJson<ContentModuleRow>(
        `/api/content-modules${actorQuery}`,
        "POST",
        {
          lang: kit.lang,
          name: kit.name.trim(),
          slug: kit.slug.trim() || null,
          techLevel: kit.techLevel.trim() || null,
          accent: kit.accent.trim() || null,
          description: kit.description.trim() || null,
          sort: kit.sort.trim() || null,
        }
      );
      setCatalog((prev) => ({
        ...prev,
        modules: sortModules([...prev.modules, created]),
      }));
      setKit({ ...EMPTY_KIT, lang: kit.lang });
      setNotice({ kind: "ok", text: t("admin.kits.saved") });
      router.refresh();
    } catch (error) {
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : t("admin.kits.submitError"),
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      <header className="relative overflow-hidden rounded-2xl border border-amber-900/40 bg-gradient-to-br from-zinc-900 via-zinc-950 to-amber-950/20 p-6 md:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border border-amber-600/20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-4 -top-8 h-48 w-48 rounded-full border border-dashed border-amber-600/20"
        />

        <div className="relative max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-amber-400/90">
            {t("admin.kits.eyebrow")}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-zinc-100 mt-2">
            {t("admin.kits.title")}
          </h1>
          <p className="text-sm text-stone-400 mt-3 leading-relaxed">
            {t("admin.kits.pageSubtitle")}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t("admin.nav.categories")}
            </Link>
            <Link
              href="/tables"
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              {t("admin.backHub")}
            </Link>
          </div>
        </div>
      </header>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-amber-400/90">
              {t("admin.kits.filter")}
            </p>
            <p className="text-sm text-zinc-500 mt-1.5 max-w-2xl leading-relaxed">
              {t("admin.kits.langHint")}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: "all", label: t("admin.kits.filterAll") },
                { id: "en", label: "EN" },
                { id: "pt", label: "PT" },
              ] as Array<{ id: Filter; label: string }>
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setFilter(option.id)}
                aria-pressed={filter === option.id}
                className={`px-3.5 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/60 ${
                  filter === option.id
                    ? "border-amber-600/70 bg-amber-700/15 text-amber-300"
                    : "border-zinc-700/60 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <div className="space-y-3">
            {modules.length === 0 ? (
              <p className="rounded-xl border border-dashed border-zinc-700/70 bg-zinc-900/30 px-4 py-10 text-center text-sm text-zinc-500">
                {t("admin.kits.empty")}
              </p>
            ) : (
              modules.map((module) => {
                const domainCounts = countsByModule.get(`${module.lang}:${module.id}`);
                const total = domainCounts
                  ? [...domainCounts.values()].reduce((sum, value) => sum + value, 0)
                  : 0;
                const accent = module.accent || "#c9a227";
                return (
                  <article
                    key={`${module.lang}-${module.id}`}
                    className="rounded-xl border border-zinc-700/50 bg-zinc-900/40 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: accent, boxShadow: `0 0 8px ${accent}88` }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold leading-tight text-zinc-100">
                            {module.name}
                          </h3>
                          <span className="inline-flex items-center rounded border border-zinc-700/60 bg-zinc-950/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                            {langLabel(module.lang)}
                          </span>
                        </div>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                          {module.slug}
                          {module.tech_level ? ` · ${module.tech_level}` : ""}
                        </p>
                      </div>
                      <span className="shrink-0 font-mono text-[10px] tabular-nums text-zinc-500">
                        {interpolate(t("admin.kits.records"), { n: total })}
                      </span>
                    </div>

                    {module.description ? (
                      <p className="mt-2.5 text-xs leading-relaxed text-zinc-400">
                        {module.description}
                      </p>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {DOMAINS.map((domain) => {
                        const count = domainCounts?.get(domain) ?? 0;
                        if (!count) return null;
                        return (
                          <span
                            key={domain}
                            className="inline-flex items-center gap-1 rounded border border-zinc-700/60 bg-zinc-950/40 px-2 py-0.5 font-mono text-[10px] text-zinc-400"
                          >
                            <span className="font-bold tabular-nums text-zinc-100">{count}</span>
                            {t(`admin.domain.${domain}`)}
                          </span>
                        );
                      })}
                    </div>
                  </article>
                );
              })
            )}
          </div>

          <form
            onSubmit={submitKit}
            className="rounded-xl border border-amber-900/40 bg-zinc-900/50 p-5"
          >
            <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-100">
              <Plus className="h-4 w-4 text-amber-400" />
              {t("admin.kits.new")}
            </h3>

            <div className="mt-4 space-y-3">
              <Field label={t("admin.kits.lang")}>
                <select
                  value={kit.lang}
                  onChange={(event) =>
                    setKit((prev) => ({ ...prev, lang: event.target.value as Lang }))
                  }
                  className={inputCls}
                >
                  <option value="pt">{t("admin.kits.langPt")}</option>
                  <option value="en">{t("admin.kits.langEn")}</option>
                </select>
              </Field>

              <Field label={t("admin.kits.name")}>
                <input
                  value={kit.name}
                  onChange={(event) => setKit((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder={t("admin.kits.namePh")}
                  className={inputCls}
                  required
                />
              </Field>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={t("admin.kits.slug")}>
                  <input
                    value={kit.slug}
                    onChange={(event) => setKit((prev) => ({ ...prev, slug: event.target.value }))}
                    placeholder={t("admin.kits.slugPh")}
                    className={`${inputCls} font-mono text-sm`}
                  />
                </Field>
                <Field label={t("admin.kits.tech")}>
                  <input
                    value={kit.techLevel}
                    onChange={(event) =>
                      setKit((prev) => ({ ...prev, techLevel: event.target.value }))
                    }
                    placeholder={t("admin.kits.techPh")}
                    className={`${inputCls} font-mono text-sm`}
                  />
                </Field>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_6rem]">
                <Field label={t("admin.kits.accent")}>
                  <input
                    value={kit.accent}
                    onChange={(event) =>
                      setKit((prev) => ({ ...prev, accent: event.target.value }))
                    }
                    placeholder={t("admin.kits.accentPh")}
                    className={`${inputCls} font-mono text-sm`}
                  />
                </Field>
                <Field label={t("admin.kits.sort")}>
                  <input
                    type="number"
                    value={kit.sort}
                    onChange={(event) => setKit((prev) => ({ ...prev, sort: event.target.value }))}
                    className={`${inputCls} font-mono text-sm`}
                  />
                </Field>
              </div>

              <Field label={t("admin.kits.description")}>
                <textarea
                  value={kit.description}
                  onChange={(event) =>
                    setKit((prev) => ({ ...prev, description: event.target.value }))
                  }
                  placeholder={t("admin.kits.descriptionPh")}
                  rows={3}
                  className={`${inputCls} resize-y`}
                />
              </Field>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button type="submit" disabled={busy} className={busy ? disabledSubmitCls : submitCls}>
                {t("admin.kits.submit")}
              </button>
            </div>
            <NoticeLine notice={notice} />
          </form>
        </div>
      </section>

      <p className="flex items-center gap-2 text-xs leading-relaxed text-zinc-500">
        <FolderTree className="h-3.5 w-3.5 shrink-0 text-amber-500/80" />
        {t("admin.kits.categoriesHint")}{" "}
        <Link href="/admin" className="text-amber-300 hover:text-amber-200 underline underline-offset-2">
          {t("admin.nav.categories")}
        </Link>
      </p>
    </div>
  );
}
