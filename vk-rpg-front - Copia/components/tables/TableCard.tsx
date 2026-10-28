"use client";

import Link from "next/link";
import { ArrowRight, Dices, Swords, UserRound } from "lucide-react";
import { hueFor } from "@/lib/hue";
import { useTranslation } from "@/lib/i18n";
import { clearPreview, markPlayerSide, setNarratorSide } from "@/lib/side";
import type { GameTable } from "@/lib/types";

/* ============================================================
   TableCard — uma mesa no hub.

   O cartão é quem decide o chapéu antes de navegar: "Narrando"
   abre `/table/[id]` com a perspectiva do mestre; "Jogando" abre
   `/player/table/[id]` com a perspectiva de jogador. Sem isso, o
   cookie de perspectiva da mesa anterior vazaria para a próxima.
   ============================================================ */

type Mode = "narrating" | "playing";

function initials(title: string): string {
  const words = title.split(/\s+/).filter((word) => /[A-Za-z0-9À-ÿ]/.test(word));
  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export default function TableCard({
  table,
  mode,
  userId,
}: {
  table: GameTable;
  mode: Mode;
  userId: string;
}) {
  const { t } = useTranslation();
  const hue = hueFor(table.title || table.id);
  const count = table.players?.length ?? 0;
  const mine = table.players?.find((player) => player.userId === userId);
  const characterName = mine?.character?.sheet?.name || mine?.character?.name || null;

  const href = mode === "narrating" ? `/table/${table.id}` : `/player/table/${table.id}`;
  const tone =
    mode === "narrating"
      ? "border-emerald-800/40 bg-emerald-950/20 text-emerald-300"
      : "border-sky-800/40 bg-sky-950/20 text-sky-300";

  const open = () => {
    if (mode === "narrating") {
      setNarratorSide();
    } else {
      clearPreview();
      markPlayerSide();
    }
  };

  return (
    <Link
      href={href}
      onClick={open}
      className="group relative flex flex-col rounded-xl border border-zinc-700/60 bg-zinc-900/60 overflow-hidden transition-colors hover:border-zinc-500/70 hover:bg-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/50"
    >
      <div className="p-5 flex items-start gap-4">
        <div
          className="relative grid place-items-center w-12 h-12 rounded-lg border shrink-0"
          style={{ borderColor: `${hue.dot}44`, background: `${hue.ring}18` }}
        >
          <span className="font-mono text-sm font-bold" style={{ color: hue.dot }}>
            {initials(table.title || "?")}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest ${tone}`}
            >
              {mode === "narrating" ? (
                <Dices className="w-3 h-3" />
              ) : (
                <Swords className="w-3 h-3" />
              )}
              {mode === "narrating" ? t("pg.hub.narrating") : t("pg.hub.playing")}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
              {table.system || t("f.system")}
            </span>
          </div>

          <h3 className="mt-1.5 text-lg font-bold text-zinc-100 leading-tight truncate">
            {table.title || t("pg.noTitle")}
          </h3>

          <p className="mt-1 text-[11px] text-zinc-500 truncate">
            {mode === "narrating"
              ? t("pg.hub.narratedBy").replace(
                  "{name}",
                  table.narrator?.username || t("pg.hub.you")
                )
              : characterName
                ? t("pg.hub.playingAs").replace("{name}", characterName)
                : t("pg.hub.noCharacter")}
          </p>
        </div>
      </div>

      {table.intro ? (
        <p className="px-5 text-sm text-stone-400 leading-relaxed line-clamp-2">{table.intro}</p>
      ) : null}

      <div className="mt-auto px-5 py-4 flex items-center justify-between gap-3 border-t border-zinc-800/80">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          <UserRound className="w-3.5 h-3.5" />
          {(count === 1 ? t("pg.hub.playersOne") : t("pg.hub.players")).replace(
            "{n}",
            String(count)
          )}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 group-hover:text-emerald-200 transition-colors">
          {mode === "narrating" ? t("pg.hub.openNarrator") : t("pg.hub.openPlayer")}
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
