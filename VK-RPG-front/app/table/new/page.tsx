import { api } from "@/lib/api";
import { getSeatedUserId } from "@/lib/actor";
import { getLang } from "@/lib/i18n-server";
import type { ContentCatalog } from "@/lib/types";
import TableWizard from "@/components/table/TableWizard";

export const dynamic = "force-dynamic";

export default async function NewTablePage() {
  const lang = await getLang();
  const actorId = await getSeatedUserId();

  let catalog: ContentCatalog | null = null;
  try {
    catalog = await api<ContentCatalog>(`/content-modules?lang=${lang}`);
  } catch {
    catalog = null;
  }

  return <TableWizard key={lang} actorId={actorId} catalog={catalog} lang={lang} />;
}
