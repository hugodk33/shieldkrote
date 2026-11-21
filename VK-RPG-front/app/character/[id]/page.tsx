import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import type { CharacterViewer } from "@/lib/types";
import CharacterTabs, { type SheetTab } from "@/components/character/CharacterTabs";
import CharacterSheet from "@/components/character/CharacterSheet";
import GearPanel from "@/components/character/GearPanel";
import CharacterJourneyView from "@/components/character/CharacterJourneyView";
import CharacterVisibilityDrawer from "@/components/visibility/CharacterVisibilityDrawer";
import CharacterGallery from "@/components/gallery/CharacterGallery";
import { getLang, makeT } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export default async function CharacterViewerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ moment?: string; tab?: string; visibility?: string }>;
}) {
  const { id } = await params;
  const { moment, tab, visibility } = await searchParams;
  const t = makeT(await getLang());
  const qs = moment ? `?moment=${moment}` : "";
  let data: CharacterViewer | undefined;
  try {
    data = await api<CharacterViewer>(`/game-table-character/${id}${qs}`);
  } catch {
    data = undefined;
  }
  if (!data) notFound();
  const basePath = `/character/${id}`;
  const tableId = data.table?.id;
  const openVisibility = visibility === "1";
  const name = data.character.sheet?.name || data.character.name || t("nav.character");

  const activeTab: SheetTab =
    tab === "inventory" || tab === "journey" || tab === "images" ? tab : "sheet";
  const momentNum = moment ? Number(moment) : null;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {tableId ? (
        <Link href={`/table/${tableId}`} className="text-zinc-500 hover:text-zinc-300 text-sm mb-4 inline-block transition-colors">
          {t("itm.back")}
        </Link>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-green-300/90">{t("pg.ch.eyebrow")}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 mt-1">{name}</h1>
          {data.table?.title ? (
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-0.5">{data.table.title}</p>
          ) : null}
        </div>
        {data.character.user?.username ? (
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 border border-zinc-700/50 rounded-md px-2 py-1">
            {data.character.user.username}
          </span>
        ) : null}
      </div>

      <CharacterTabs basePath={basePath} active={activeTab} moment={momentNum} />

      {activeTab === "images" ? (
        <CharacterGallery
          characterId={data.character.id}
          name={data.character.sheet?.name || data.character.name || ""}
          portraitUrl={data.character.portraitUrl}
          bodyUrl={data.character.bodyUrl}
          images={data.character.images ?? []}
        />
      ) : activeTab === "inventory" ? (
        <GearPanel data={data} historic={!!moment} />
      ) : activeTab === "journey" ? (
        <CharacterJourneyView
          characterId={data.character.id}
          basePath={basePath}
          moments={data.moments ?? []}
          selectedMoment={data.selected_moment ?? null}
          tab={activeTab}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="min-w-0">
            {data.character.portraitUrl ? (
              <img
                src={data.character.portraitUrl}
                alt={name}
                className="w-full aspect-square rounded-xl border border-zinc-700/60 bg-zinc-900 object-cover"
              />
            ) : (
              <div
                aria-label={t("fr.ch.portrait")}
                className="flex aspect-square w-full items-center justify-center rounded-xl border border-dashed border-zinc-700/60 bg-zinc-900/40 text-zinc-700"
              >
                <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <CharacterSheet data={data} basePath={basePath} showName={false} managePassive />
            <CharacterVisibilityDrawer tableId={tableId} targetId={data.character.id} defaultOpen={openVisibility} />
          </div>
        </div>
      )}
    </div>
  );
}
