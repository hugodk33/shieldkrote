import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import type { NpcViewer } from "@/lib/types";
import NpcForm from "@/components/forms/NpcForm";
import CharacterGallery from "@/components/gallery/CharacterGallery";

export const dynamic = "force-dynamic";

export default async function EditNpcPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let data: NpcViewer | undefined;
  try {
    data = await api<NpcViewer>(`/game-table-npc/${id}`);
  } catch {
    data = undefined;
  }
  if (!data) notFound();

  const { character } = data;

  return (
    <NpcForm initial={data}>
      <CharacterGallery
        characterId={character.id}
        name={character.sheet?.name ?? character.name ?? "NPC"}
        portraitUrl={character.portraitUrl}
        bodyUrl={character.bodyUrl}
        images={character.images ?? []}
      />
    </NpcForm>
  );
}
