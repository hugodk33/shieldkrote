"use client";

/* ============================================================
   WorldNet — the flat icosahedral net of a `world` location.

   Read-only in the player atlas (click a linked cell to zoom into
   its continent). In the narrator atlas it doubles as a biome
   studio: pick a biome, click cells, link child divisions and save
   the whole layer back through PUT /api/table-location/:id.
   ============================================================ */

import { useEffect, useMemo, useRef, useState } from "react";
import { paintCanvas } from "@/lib/canvasgrid";
import { submitJson } from "@/components/forms/submit";
import { useTranslation } from "@/lib/i18n";
import type { Location } from "@/lib/types";
import {
  BIOMES,
  BIOME_LIST,
  buildNetGeometry,
  cellAt,
  reconcileWorldTiles,
  seedWorldTiles,
  tacticalTilesOf,
  worldTilesOf,
  type BiomeKind,
  type NetCell,
  type Point,
  type WorldTile,
} from "@/lib/worldnet";

type Tool = "open" | "paint" | "link";

interface WorldNetProps {
  node: Location;
  children?: Location[];
  player?: boolean;
  onOpenChild?: (id: string) => void;
}

function polygon(ctx: CanvasRenderingContext2D, c: NetCell): void {
  ctx.beginPath();
  const sides = c.shape === "pentagon" ? 5 : 6;
  const start = c.shape === "pentagon" ? -Math.PI / 2 : 0;
  for (let k = 0; k < sides; k++) {
    const a = start + (k * Math.PI * 2) / sides;
    const x = c.x + Math.cos(a) * c.r;
    const y = c.y + Math.sin(a) * c.r;
    if (k === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

export default function WorldNet({ node, children = [], player = false, onOpenChild }: WorldNetProps) {
  const { t } = useTranslation();
  const geo = useMemo(() => buildNetGeometry(), []);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [tiles, setTiles] = useState<WorldTile[]>(() =>
    reconcileWorldTiles(worldTilesOf(node.tiles), geo, node.id)
  );
  const [tool, setTool] = useState<Tool>("open");
  const [brush, setBrush] = useState<BiomeKind>("plains");
  const [linkId, setLinkId] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Trocar de localidade recomeça com a camada salva daquele local. */
  useEffect(() => {
    setTiles(reconcileWorldTiles(worldTilesOf(node.tiles), geo, node.id));
    setSelected(null);
    setHover(null);
    setTool("open");
    setLinkId("");
  }, [node.id, node.tiles, geo]);

  const byCell = useMemo(() => new Map(tiles.map((tile) => [tile.cell, tile])), [tiles]);
  const byChild = useMemo(() => new Map(children.map((c) => [c.id, c])), [children]);
  const selectedCell = geo.cells.find((c) => c.id === selected) ?? null;
  const hoverCell = geo.cells.find((c) => c.id === hover) ?? null;
  const focusCell = hoverCell ?? selectedCell;
  const focusTile = focusCell ? byCell.get(focusCell.id) : null;
  const focusChild = focusTile?.childId ? byChild.get(focusTile.childId) : null;
  const faceCount = geo.faces.length;
  const pentCount = geo.cells.filter((c) => c.shape === "pentagon").length;

  /* ---------------------------- canvas ---------------------------- */

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    paintCanvas(cv, geo.W, geo.H, (ctx) => {
      ctx.fillStyle = player ? "rgba(8,18,34,0.35)" : "rgba(6,14,18,0.35)";
      ctx.fillRect(0, 0, geo.W, geo.H);

      /* as 20 faces do icosaedro */
      ctx.save();
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = player ? "rgba(96,165,250,0.42)" : "rgba(45,212,191,0.42)";
      ctx.fillStyle = player ? "rgba(96,165,250,0.03)" : "rgba(45,212,191,0.03)";
      for (const f of geo.faces) {
        ctx.beginPath();
        ctx.moveTo(f.points[0].x, f.points[0].y);
        for (let i = 1; i < f.points.length; i++) ctx.lineTo(f.points[i].x, f.points[i].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();

      /* biomas */
      for (const c of geo.cells) {
        const tile = byCell.get(c.id);
        const meta = tile ? BIOMES[tile.biome] : null;
        const isSelected = c.id === selected;
        const isHover = c.id === hover;
        polygon(ctx, c);
        ctx.fillStyle = meta ? meta.fill : "#13161f";
        ctx.fill();
        ctx.strokeStyle = isSelected
          ? player ? "#bfdbfe" : "#5eead4"
          : isHover ? (player ? "#93c5fd" : "#99f6e4")
          : meta ? meta.stroke : "#2b2e37";
        ctx.lineWidth = isSelected ? 2.6 : isHover ? 2 : 1;
        ctx.stroke();

        if (meta?.glyph) {
          ctx.fillStyle = meta.stroke;
          ctx.globalAlpha = 0.9;
          ctx.font = `bold ${Math.max(7, c.r * (c.shape === "pentagon" ? 1.05 : 0.95))}px "Geist Mono", monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(meta.glyph, c.x, c.y + c.r * 0.04);
          ctx.globalAlpha = 1;
        }

        /* continente vinculado: um anel duplo distingue a célula clicável */
        if (tile?.childId) {
          ctx.beginPath();
          ctx.arc(c.x + c.r * 0.66, c.y - c.r * 0.66, Math.max(2.2, c.r * 0.2), 0, Math.PI * 2);
          ctx.fillStyle = player ? "#60a5fa" : "#fbbf24";
          ctx.fill();
          ctx.strokeStyle = "#0b0d12";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    });
  }, [tiles, byCell, selected, hover, geo, player]);

  /* --------------------------- interaction ------------------------ */

  const pointOf = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * geo.W,
      y: ((e.clientY - rect.top) / rect.height) * geo.H,
    };
  };

  const clickCell = (c: NetCell | null) => {
    if (!c) {
      setSelected(null);
      return;
    }
    setSelected(c.id);
    const tile = byCell.get(c.id);
    if (player || tool === "open") {
      if (tile?.childId) onOpenChild?.(tile.childId);
      return;
    }
    setTiles((prev) => prev.map((x) => {
      if (x.cell !== c.id) return x;
      if (tool === "paint") return { ...x, biome: brush, childId: BIOMES[brush].land ? x.childId : null };
      if (tool === "link") return { ...x, childId: linkId || null, biome: linkId && !BIOMES[x.biome].land ? "plains" : x.biome };
      return x;
    }));
    setSaved(false);
  };

  const regenerate = () => {
    const fresh = seedWorldTiles(`${node.id}-${Date.now()}`, children, geo);
    const links = new Map(tiles.map((x) => [x.cell, x.childId]));
    setTiles(fresh.map((x) => ({ ...x, childId: links.get(x.cell) ?? x.childId })));
    setSaved(false);
    setError(null);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await submitJson(`/api/table-location/${node.id}`, "PUT", {
        id: node.id,
        tiles: [...tacticalTilesOf(node.tiles), ...tiles],
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("lc.ms.error"));
    } finally {
      setSaving(false);
    }
  };

  const accent = player ? "border-blue-400/25 bg-blue-400/[0.03]" : "border-teal-400/25 bg-teal-400/[0.03]";
  const pill = (active: boolean) =>
    `rounded-md border px-2 py-1 font-mono text-[10px] tracking-widest uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60 ${
      active
        ? player
          ? "border-blue-400/50 bg-blue-400/15 text-blue-100"
          : "border-teal-400/50 bg-teal-400/15 text-teal-100"
        : "border-zinc-700/60 bg-zinc-800/50 text-zinc-400 hover:text-zinc-100"
    }`;

  return (
    <section className={`rounded-xl border px-4 py-3 ${accent}`} aria-label={t("lc.world.title")}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="font-mono text-[11px] font-bold uppercase tracking-widest text-zinc-200">
            {t("lc.world.title")} · {node.name}
          </h2>
          <p className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-zinc-500">
            {faceCount} {t("lc.world.faces")} · {pentCount} {t("lc.world.pentagons")} · {tiles.length} {t("lc.world.cells")}
          </p>
        </div>
        {!player ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <button type="button" className={pill(tool === "open")} onClick={() => setTool("open")} title={t("lc.world.toolOpenHint")}>
              {t("lc.world.toolOpen")}
            </button>
            <button type="button" className={pill(tool === "paint")} onClick={() => setTool("paint")}>{t("lc.world.toolPaint")}</button>
            <button type="button" className={pill(tool === "link")} onClick={() => setTool("link")}>{t("lc.world.toolLink")}</button>
            <button
              type="button"
              onClick={regenerate}
              className="rounded-md border border-zinc-700/60 bg-zinc-800/50 px-2 py-1 font-mono text-[10px] tracking-widest uppercase text-zinc-400 hover:text-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60"
              title={t("lc.world.regenerateHint")}
            >
              {t("lc.world.regenerate")}
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-md border border-teal-400/40 bg-teal-500/15 px-2.5 py-1 font-mono text-[10px] tracking-widest uppercase text-teal-200 hover:bg-teal-500/25 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60"
            >
              {saving ? t("lc.common.saving") : saved ? t("lc.ms.saved") : t("lc.ms.save")}
            </button>
          </div>
        ) : null}
      </div>

      <p className="mt-2 text-[11px] text-zinc-500">{t(player ? "lc.world.hintPlayer" : "lc.world.hintNarrator")}</p>

      <div className="mt-3 w-full overflow-hidden rounded-lg border border-zinc-700/40 bg-zinc-950/50">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={t("lc.world.canvasAria")}
          className="block w-full touch-none"
          style={{ aspectRatio: `${geo.W} / ${geo.H}`, cursor: player || tool === "open" ? "pointer" : "crosshair" }}
          onPointerMove={(e) => setHover(cellAt(geo, pointOf(e))?.id ?? null)}
          onPointerLeave={() => setHover(null)}
          onClick={(e) => clickCell(cellAt(geo, pointOf(e)))}
        />
      </div>

      {!player && tool === "paint" ? (
        <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label={t("lc.world.palette")}>
          {BIOME_LIST.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setBrush(k)}
              title={t(BIOMES[k].label)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60 ${
                brush === k ? "border-teal-400/60 bg-teal-400/10 text-zinc-100" : "border-zinc-700/50 bg-zinc-800/40 text-zinc-400 hover:text-zinc-100"
              }`}
            >
              <span className="h-3 w-3 rounded-sm border" style={{ background: BIOMES[k].fill, borderColor: BIOMES[k].stroke }} />
              {t(BIOMES[k].label)}
            </button>
          ))}
        </div>
      ) : null}

      {!player && tool === "link" ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label htmlFor="world-child" className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            {t("lc.world.chooseChild")}
          </label>
          <select
            id="world-child"
            value={linkId}
            onChange={(e) => setLinkId(e.target.value)}
            className="rounded-md border border-zinc-700/60 bg-zinc-800/70 px-2 py-1 text-xs text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60"
          >
            <option value="">{t("lc.world.noChild")}</option>
            {children.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {children.length === 0 ? <span className="text-[11px] text-zinc-600">{t("lc.world.noChildren")}</span> : null}
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-700/40 pt-2">
        <div className="min-w-0 text-[11px] text-zinc-500">
          {focusTile ? (
            <>
              <span className="font-mono uppercase tracking-widest text-zinc-400">
                {t(BIOMES[focusTile.biome].label)}
              </span>
              {focusChild ? <span className="ml-2 text-teal-300">↳ {focusChild.name}</span> : null}
            </>
          ) : (
            <span>{t("lc.world.hoverHint")}</span>
          )}
        </div>
        {focusTile?.childId ? (
          <button
            type="button"
            onClick={() => onOpenChild?.(focusTile.childId!)}
            className="rounded-md border border-zinc-700/60 bg-zinc-800/60 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-300 hover:text-teal-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60"
          >
            {t("lc.world.openChild")} →
          </button>
        ) : null}
      </div>
      {error ? <p className="mt-2 text-[11px] text-red-400">{error}</p> : null}
    </section>
  );
}
