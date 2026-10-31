import { redirect } from "next/navigation";
import SuperAdminConsole from "@/components/admin/SuperAdminConsole";
import { api } from "@/lib/api";
import { getSeatedUser } from "@/lib/actor";
import { isBaseTable, isSuperAdmin } from "@/lib/superAdmin";
import type { ContentCatalog, GameTable, UserTables } from "@/lib/types";

export const dynamic = "force-dynamic";

/* ============================================================
   /admin — o painel do superadmin.

   A rota existe para o d3miurg0 ter um destino direto, fora das
   mesas. A regra é a mesma das mesas-base: tipo Admin (2) E nome
   de usuário `d3miurg0`. Todo mundo além dele volta ao hub.
   ============================================================ */

const EMPTY_CATALOG: ContentCatalog = {
  modules: [],
  categories: [],
  counts: [],
  references: [],
};

function baseTableLinks(tables: UserTables | null): GameTable[] {
  const seen = new Set<string>();
  return [...(tables?.narrating ?? []), ...(tables?.playing ?? [])].filter((table) => {
    if (!isBaseTable(table) || seen.has(table.id)) return false;
    seen.add(table.id);
    return true;
  });
}

export default async function AdminPage() {
  const user = await getSeatedUser();

  if (!user) redirect("/login?next=/admin");
  if (!isSuperAdmin(user)) redirect("/tables");

  const [catalog, tables] = await Promise.all([
    api<ContentCatalog>("/content-modules").catch(() => null),
    api<UserTables>(`/users/${encodeURIComponent(user.id)}/tables`).catch(() => null),
  ]);

  const baseTables = baseTableLinks(tables).map((table) => ({
    id: table.id,
    title: table.title,
    system: table.system ?? null,
  }));

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
      <SuperAdminConsole
        actorId={user.id}
        initialCatalog={catalog ?? EMPTY_CATALOG}
        baseTables={baseTables}
      />
    </div>
  );
}
