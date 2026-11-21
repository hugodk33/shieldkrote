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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center mb-5">
        {/* coluna da esquerda */}
        <div className="min-w-0">
          {data.character.portraitUrl ? (
            <img
              src={data.character.portraitUrl}
              alt={data.character.sheet?.name || data.character.name || ""}
              className="w-full aspect-square rounded-xl border border-zinc-700/60 bg-zinc-900 object-cover"
            />
          ) : null}
        </div>
        {/* coluna da direita */}
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-widest uppercase text-green-300/90">{t("pg.ch.eyebrow")}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 mt-1">
            {data.character.sheet?.name || data.character.name || t("nav.character")}
          </h1>
          {data.table?.title ? (
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-0.5">{data.table.title}</p>
          ) : null}
          {data.character.user?.username ? (
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 border border-zinc-700/50 rounded-md px-2 py-1 inline-block mt-3">
              {data.character.user.username}
            </span>
          ) : null}
        </div>
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
        <>
          <CharacterSheet data={data} basePath={basePath} showName={false} managePassive />
          <CharacterVisibilityDrawer tableId={tableId} targetId={data.character.id} defaultOpen={openVisibility} />
        </>
      )}
    </div>
  );
}
