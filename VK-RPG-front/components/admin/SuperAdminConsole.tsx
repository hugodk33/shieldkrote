"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Boxes, FolderTree, LayoutGrid, Plus, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { inputCls, labelCls, submitCls, disabledSubmitCls } from "@/components/forms/formStyles";
import { submitJson } from "@/components/forms/submit";
import type { ContentCatalog, ContentCategoryRow } from "@/lib/types";

/* ============================================================
   SuperAdminConsole — a taxonomia do catálogo.

   Só o d3miurg0 chega aqui (o guard real está no backend; as
   páginas de servidor também redirecionam). A tela cuida das
   categorias globais que o passo 2 do assistente usa para
   agrupar o conteúdo. Os kits têm rota própria (`/admin/kits`)
   porque cada idioma mantém o seu próprio acervo.
   ============================================================ */

interface SuperAdminConsoleProps {
  actorId: string;
  initialCatalog: ContentCatalog;
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

type CategoryDraft = {
  domain: Domain;
  parentId: string;
  name: string;
  displayName: string;
  sort: string;
};

const EMPTY_CATEGORY: CategoryDraft = {
  domain: "skill",
  parentId: "",
  name: "",
  displayName: "",
  sort: "",
};

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
}: SuperAdminConsoleProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [catalog, setCatalog] = useState<ContentCatalog>(initialCatalog);
  const [category, setCategory] = useState<CategoryDraft>(EMPTY_CATEGORY);
  const [categoryBusy, setCategoryBusy] = useState(false);
  const [categoryNotice, setCategoryNotice] = useState<Notice>(null);

  const rootsFor = (domain: string) =>
    catalog.categories
      .filter((entry) => entry.domain === domain && !entry.parent_id)
      .sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name));

  const childrenFor = (parentId: string) =>
    catalog.categories
      .filter((entry) => entry.parent_id === parentId)
      .sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name));

  const actorQuery = `?actor=${encodeURIComponent(actorId)}`;

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
              <Link
                href="/admin/kits"
                className="inline-flex items-center gap-1.5 rounded-md border border-amber-700/50 bg-amber-950/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-amber-300 hover:bg-amber-950/40 transition-colors"
              >
                <Boxes className="h-3.5 w-3.5" />
                {t("admin.kits.title")}
                <ArrowRight className="h-3 w-3" />
              </Link>
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

      {/* ---------- guidance ---------- */}
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

        <Link
          href="/admin/kits"
          className="group flex flex-col justify-between rounded-xl border border-amber-900/40 bg-zinc-900/40 p-5 transition-colors hover:border-amber-700/60 hover:bg-amber-950/10"
        >
          <div>
            <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-100">
              <Boxes className="h-4 w-4 text-amber-400" />
              {t("admin.kits.title")}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">
              {t("admin.kits.hint")}
            </p>
          </div>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-amber-300 transition-colors group-hover:text-amber-200">
            {t("admin.kits.open")}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
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
