import { redirect } from "next/navigation";
import KitConsole from "@/components/admin/KitConsole";
import { api } from "@/lib/api";
import { getSeatedUser } from "@/lib/actor";
import { isSuperAdmin } from "@/lib/superAdmin";
import type { ContentCatalog } from "@/lib/types";

export const dynamic = "force-dynamic";

/* ============================================================
   /admin/kits — registro dos pacotes de campanha.

   Rota exclusiva do superadmin. O catálogo é lido SEM `lang`
   porque esta tela administra os dois acervos (EN e PT); cada
   kit carrega a própria coluna `lang`.
   ============================================================ */

const EMPTY_CATALOG: ContentCatalog = {
  modules: [],
  categories: [],
  counts: [],
  references: [],
};

export default async function AdminKitsPage() {
  const user = await getSeatedUser();

  if (!user) redirect("/login?next=/admin/kits");
  if (!isSuperAdmin(user)) redirect("/tables");

  const catalog = await api<ContentCatalog>("/content-modules").catch(() => null);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
      <KitConsole actorId={user.id} initialCatalog={catalog ?? EMPTY_CATALOG} />
    </div>
  );
}
