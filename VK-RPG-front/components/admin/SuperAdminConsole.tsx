"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookMarked,
  Boxes,
  FolderTree,
  LayoutGrid,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { interpolate, useTranslation } from "@/lib/i18n";
import { inputCls, labelCls, submitCls, disabledSubmitCls } from "@/components/forms/formStyles";
import { submitJson } from "@/components/forms/submit";
import type {
  ContentCatalog,
  ContentCategoryRow,
  ContentModuleRow,
} from "@/lib/types";

/* ============================================================
   SuperAdminConsole — o painel das mesas-base.

   Só o d3miurg0 chega aqui (o guard real está no backend; as páginas
   de servidor também redirecionam). As duas mesas-base da seed não
   têm campanha: em vez do livro da mesa, elas mostram o catálogo —
   os kits (content_modules) e a taxonomia (content_categories) que
   o passo 2 do assistente de nova mesa oferece aos narradores.
   ============================================================ */

export type BaseTableLink = {
  id: string;
  title: string;
  system?: string | null;
};

interface SuperAdminConsoleProps {
  actorId: string;
  initialCatalog: ContentCatalog;
  baseTables: BaseTableLink[];
  currentTableId?: string;
}

const DOMAINS = [
  "skill",
  "item",
  "advantage",
  "disadvantage",
  "npc",
  "location",
] as const;

type Domain = (typeof DOMAINS)[number];

type Notice = { kind: "ok" | "error"; text: string } | null;

type KitDraft = {
  name: string;
  slug: string;
  techLevel: string;
  accent: string;
  description: string;
  sort: string;
};

type CategoryDraft = {
  domain: Domain;
  parentId: string;
  name: string;
  displayName: string;
  sort: string;
};

const EMPTY_KIT: KitDraft = {
  name: "",
  slug: "",
  techLevel: "",
  accent: "",
  description: "",
  sort: "",
};

const EMPTY_CATEGORY: CategoryDraft = {
  domain: "skill",
  parentId: "",
  name: "",
  displayName: "",
  sort: "",
};

function sortModules(modules: ContentModuleRow[]): ContentModuleRow[] {
  return [...modules].sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name));
}

function sortCategories(categories: ContentCategoryRow[]): ContentCategoryRow[] {
  return [...categories].sort(
    (a, b) =>
      a.domain.localeCompare(b.domain) ||
      a.sort - b.sort ||
      a.name.localeCompare(b.name)
  );
}

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

function SectionHead({
  eyebrow,
  title,
  hint,
}: {
  eyebrow: string;
  title: string;
  hint: string;
}) {
  return (
    <div className="mb-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-amber-400/90">
        {eyebrow}
      </p>
      <h2 className="font-serif text-2xl md:text-3xl text-zinc-100 mt-1.5">{title}</h2>
      <p className="text-sm text-zinc-500 mt-1.5 max-w-2xl leading-relaxed">{hint}</p>
    </div>
  );
}

export default function SuperAdminConsole({
  actorId,
  initialCatalog,
  baseTables,
  currentTableId,
}: SuperAdminConsoleProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [catalog, setCatalog] = useState<ContentCatalog>(initialCatalog);
  const [kit, setKit] = useState<KitDraft>(EMPTY_KIT);
  const [category, setCategory] = useState<CategoryDraft>(EMPTY_CATEGORY);
  const [kitBusy, setKitBusy] = useState(false);
  const [categoryBusy, setCategoryBusy] = useState(false);
  const [kitNotice, setKitNotice] = useState<Notice>(null);
  const [categoryNotice, setCategoryNotice] = useState<Notice>(null);

  const countsByModule = useMemo(() => {
    const map = new Map<string, Map<string, number>>();
    for (const row of catalog.counts) {
      const domainMap = map.get(row.moduleId) ?? new Map<string, number>();
      domainMap.set(row.domain, (domainMap.get(row.domain) ?? 0) + row.count);
      map.set(row.moduleId, domainMap);
    }
    return map;
  }, [catalog.counts]);

  const rootsFor = (domain: string) =>
    catalog.categories
      .filter((entry) => entry.domain === domain && !entry.parent_id)
      .sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name));

  const childrenFor = (parentId: string) =>
    catalog.categories
      .filter((entry) => entry.parent_id === parentId)
      .sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name));

  const actorQuery = `?actor=${encodeURIComponent(actorId)}`;

  async function submitKit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!kit.name.trim()) {
      setKitNotice({ kind: "error", text: t("admin.form.required") });
      return;
    }

    setKitBusy(true);
    setKitNotice(null);
    try {
      const created = await submitJson<ContentModuleRow>(
        `/api/content-modules${actorQuery}`,
        "POST",
        {
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
      setKit(EMPTY_KIT);
      setKitNotice({ kind: "ok", text: t("admin.kits.saved") });
      router.refresh();
    } catch (error) {
      setKitNotice({
        kind: "error",
        text: error instanceof Error ? error.message : t("admin.kits.submitError"),
      });
    } finally {
      setKitBusy(false);
    }
  }

  async function submitCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!category.name.trim()) {
      setCategoryNotice({ kind: "error", text: t("admin.form.required") });
      return;
    }

    setCategoryBusy(true);
    setCategoryNotice(null);
    try {
      const created = await submitJson<ContentCategoryRow>(
        `/api/content-categories${actorQuery}`,
        "POST",
        {
          domain: category.domain,
          parentId: category.parentId || null,
          name: category.name.trim(),
          displayName: category.displayName.trim() || null,
          sort: category.sort.trim() || null,
        }
      );
      setCatalog((prev) => ({
        ...prev,
        categories: sortCategories([...prev.categories, created]),
      }));
      setCategory((prev) => ({
        ...prev,
        parentId: "",
        name: "",
        displayName: "",
        sort: "",
      }));
      setCategoryNotice({ kind: "ok", text: t("admin.categories.saved") });
      router.refresh();
    } catch (error) {
      setCategoryNotice({
        kind: "error",
        text: error instanceof Error ? error.message : t("admin.categories.submitError"),
      });
    } finally {
      setCategoryBusy(false);
    }
  }

  const parentOptions = rootsFor(category.domain);

  return (
    <div className="space-y-10">
      {/* ---------- hero ---------- */}
      <header className="relative overflow-hidden rounded-2xl border border-amber-900/40 bg-gradient-to-br from-zinc-900 via-zinc-950 to-amber-950/20 p-6 md:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border border-amber-600/20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-4 -top-8 h-48 w-48 rounded-full border border-dashed border-amber-600/20"
        />

        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-amber-400/90">
              {t("admin.eyebrow")}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-zinc-100 mt-2">
              {t("admin.title")}
            </h1>
            <p className="text-sm text-stone-400 mt-3 leading-relaxed">
              {t("admin.subtitle")}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link
                href="/tables"
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                {t("admin.backHub")}
              </Link>
              {baseTables.map((table) => (
                <Link
                  key={table.id}
                  href={`/table/${table.id}`}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    table.id === currentTableId
                      ? "border-amber-600/60 bg-amber-950/30 text-amber-300"
                      : "border-zinc-700/60 text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  <BookMarked className="h-3.5 w-3.5" />
                  {table.title}
                </Link>
              ))}
            </div>
          </div>

          <div aria-hidden className="relative h-28 w-28 shrink-0">
            <div className="absolute inset-0 rounded-full border border-amber-500/50" />
            <div className="absolute inset-3 rounded-full border border-dashed border-amber-500/30" />
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-serif text-2xl tracking-tight text-amber-300">d3</span>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- guidance + base tables ---------- */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/40 p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-100">
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            {t("admin.guidanceTitle")}
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400">
            {t("admin.guidanceBody")}
          </p>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-zinc-500">
            <li className="flex gap-2">
              <Boxes className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500/80" />
              {t("admin.guidanceKits")}
            </li>
            <li className="flex gap-2">
              <FolderTree className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500/80" />
              {t("admin.guidanceCategories")}
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/40 p-5">
          <h2 className="text-sm font-bold text-zinc-100">{t("admin.baseTables")}</h2>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            {t("admin.baseTablesHint")}
          </p>
          <ul className="mt-3 space-y-2">
            {baseTables.map((table) => (
              <li key={table.id}>
                <Link
                  href={`/table/${table.id}`}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2.5 transition-colors hover:border-amber-800/60 hover:bg-amber-950/10"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-zinc-200">
                      {table.title}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                      {table.system || t("admin.badge")}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-400" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- kits ---------- */}
      <section id="kits">
        <SectionHead
          eyebrow={t("admin.kits.eyebrow")}
          title={t("admin.kits.title")}
          hint={t("admin.kits.hint")}
        />

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <div className="space-y-3">
            {catalog.modules.length === 0 ? (
              <p className="rounded-xl border border-dashed border-zinc-700/70 bg-zinc-900/30 px-4 py-10 text-center text-sm text-zinc-500">
                {t("admin.kits.empty")}
              </p>
            ) : (
              catalog.modules.map((module) => {
                const domainCounts = countsByModule.get(module.id);
                const total = domainCounts
                  ? [...domainCounts.values()].reduce((sum, value) => sum + value, 0)
                  : 0;
                const accent = module.accent || "#c9a227";
                return (
                  <article
                    key={module.id}
                    className="rounded-xl border border-zinc-700/50 bg-zinc-900/40 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: accent, boxShadow: `0 0 8px ${accent}88` }}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold leading-tight text-zinc-100">
                          {module.name}
                        </h3>
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
              <button
                type="submit"
                disabled={kitBusy}
                className={kitBusy ? disabledSubmitCls : submitCls}
              >
                {t("admin.kits.submit")}
              </button>
            </div>
            <NoticeLine notice={kitNotice} />
          </form>
        </div>
      </section>

      {/* ---------- categories ---------- */}
      <section id="categories">
        <SectionHead
          eyebrow={t("admin.categories.eyebrow")}
          title={t("admin.categories.title")}
          hint={t("admin.categories.hint")}
        />

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <div>
            {catalog.categories.length === 0 ? (
              <p className="rounded-xl border border-dashed border-zinc-700/70 bg-zinc-900/30 px-4 py-10 text-center text-sm text-zinc-500">
                {t("admin.categories.empty")}
              </p>
            ) : (
              <div className="space-y-5">
                {DOMAINS.map((domain) => {
                  const roots = rootsFor(domain);
                  const subCount = roots.reduce(
                    (sum, root) => sum + childrenFor(root.id).length,
                    0
                  );
                  return (
                    <div key={domain}>
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="font-mono text-[10px] uppercase tracking-widest text-amber-400/80">
                          {t(`admin.domain.${domain}`)}
                        </h3>
                        <span className="h-px flex-1 bg-zinc-800" />
                        <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
                          {roots.length} {t("admin.categories.rootsLabel")} · {subCount}{" "}
                          {t("admin.categories.childrenLabel")}
                        </span>
                      </div>

                      {roots.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/20 px-3 py-3 text-xs text-zinc-600">
                          {t("admin.categories.noParents")}
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {roots.map((root) => {
                            const children = childrenFor(root.id);
                            return (
                              <li
                                key={root.id}
                                className="rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-2.5"
                              >
                                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                  <span className="text-sm font-semibold text-zinc-200">
                                    {root.display_name}
                                  </span>
                                  <span className="font-mono text-[10px] text-zinc-500">
                                    {root.name}
                                  </span>
                                  <span className="ml-auto font-mono text-[9px] uppercase tracking-widest text-zinc-600">
                                    {t("admin.categories.root")}
                                  </span>
                                </div>

                                {children.length ? (
                                  <div className="mt-2 flex flex-wrap gap-1.5">
                                    {children.map((child) => (
                                      <span
                                        key={child.id}
                                        className="inline-flex items-center gap-1 rounded border border-zinc-700/60 bg-zinc-950/40 px-2 py-0.5 text-[11px] text-zinc-300"
                                      >
                                        {child.display_name}
                                        <span className="font-mono text-[9px] text-zinc-500">
                                          {child.name}
                                        </span>
                                      </span>
                                    ))}
                                  </div>
                                ) : null}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <form
            onSubmit={submitCategory}
            className="rounded-xl border border-amber-900/40 bg-zinc-900/50 p-5"
          >
            <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-100">
              <Plus className="h-4 w-4 text-amber-400" />
              {t("admin.categories.new")}
            </h3>

            <div className="mt-4 space-y-3">
              <Field label={t("admin.categories.domain")}>
                <select
                  value={category.domain}
                  onChange={(event) =>
                    setCategory((prev) => ({
                      ...prev,
                      domain: event.target.value as Domain,
                      parentId: "",
                    }))
                  }
                  className={inputCls}
                >
                  {DOMAINS.map((domain) => (
                    <option key={domain} value={domain}>
                      {t(`admin.domain.${domain}`)}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={t("admin.categories.parent")}>
                <select
                  value={category.parentId}
                  onChange={(event) =>
                    setCategory((prev) => ({ ...prev, parentId: event.target.value }))
                  }
                  className={inputCls}
                  disabled={parentOptions.length === 0}
                >
                  <option value="">{t("admin.categories.parentNone")}</option>
                  {parentOptions.map((root) => (
                    <option key={root.id} value={root.id}>
                      {root.display_name} ({root.name})
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={t("admin.categories.name")}>
                <input
                  value={category.name}
                  onChange={(event) =>
                    setCategory((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder={t("admin.categories.namePh")}
                  className={`${inputCls} font-mono text-sm`}
                  required
                />
              </Field>

              <div className="grid gap-3 sm:grid-cols-[1fr_6rem]">
                <Field label={t("admin.categories.display")}>
                  <input
                    value={category.displayName}
                    onChange={(event) =>
                      setCategory((prev) => ({ ...prev, displayName: event.target.value }))
                    }
                    placeholder={t("admin.categories.displayPh")}
                    className={inputCls}
                  />
                </Field>
                <Field label={t("admin.categories.sort")}>
                  <input
                    type="number"
                    value={category.sort}
                    onChange={(event) =>
                      setCategory((prev) => ({ ...prev, sort: event.target.value }))
                    }
                    className={`${inputCls} font-mono text-sm`}
                  />
                </Field>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="submit"
                disabled={categoryBusy}
                className={categoryBusy ? disabledSubmitCls : submitCls}
              >
                {t("admin.categories.submit")}
              </button>
            </div>
            <NoticeLine notice={categoryNotice} />
          </form>
        </div>
      </section>
    </div>
  );
}
