"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitJson } from "./submit";
import { cancelCls, inputCls, labelCls, submitCls } from "./formStyles";
import { useTranslation } from "@/lib/i18n";
import { readPerspective } from "@/lib/side";

export interface TableFormProps {
  initial?: { id: string; title: string; system: string; intro: string };
}

export default function TableForm({ initial }: TableFormProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const isEdit = !!initial;
  const [title, setTitle] = useState(initial?.title ?? "");
  const [system, setSystem] = useState(initial?.system ?? "");
  const [intro, setIntro] = useState(initial?.intro ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (isEdit && initial) {
        await submitJson<{ success?: boolean }>(`/api/game-table/edit/${initial.id}`, "PUT", { title, system, intro });
        router.push("/narrator");
        router.refresh();
      } else {
        const result = await submitJson<{ id: string }>("/api/create-game-table", "POST", {
          actor: readPerspective().actor,
          title,
          system,
          intro,
        });
        router.push(`/table/${result.id}`);
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("fr.err.table"));
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-green-100 mb-6">
          {isEdit ? t("fr.table.editTitle") : t("fr.table.newTitle")}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelCls}>{t("fr.campaignTitle")}</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>{t("fr.system")}</label>
            <input
              value={system}
              onChange={(e) => setSystem(e.target.value)}
              className={inputCls}
              placeholder={t("fr.systemPh")}
            />
          </div>

          <div>
            <label className={labelCls}>{t("fr.intro")}</label>
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              rows={4}
              className={inputCls}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className={`${submitCls} disabled:opacity-50`}>
              {saving ? t("fr.saving") : isEdit ? t("fr.saveChanges") : t("fr.table.create")}
            </button>
            <a href="/narrator" className={cancelCls}>
              {t("fr.cancel")}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
