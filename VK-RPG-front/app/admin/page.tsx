import { redirect } from "next/navigation";
import SuperAdminConsole from "@/components/admin/SuperAdminConsole";
import { api } from "@/lib/api";
import { getSeatedUser } from "@/lib/actor";
import { isSuperAdmin } from "@/lib/superAdmin";
import type { ContentCatalog } from "@/lib/types";

export const dynamic = "force-dynamic";

/* ============================================================
   /admin — a taxonomia do catálogo.

   A rota existe para o d3miurg0 ter um destino direto, fora das
   mesas. A regra é tipo Admin (2) E nome de usuário `d3miurg0`.
   Todo mundo além dele volta ao hub. Os kits têm a sua própria
   rota (`/admin/kits`).
   ============================================================ */

const EMPTY_CATALOG: ContentCatalog = {
  modules: [],
  categories: [],
  counts: [],
  references: [],
};

export default async function AdminPage() {
  const user = await getSeatedUser();

  if (!user) redirect("/login?next=/admin");
  if (!isSuperAdmin(user)) redirect("/tables");

  const catalog = await api<ContentCatalog>("/content-modules").catch(() => null);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
      <SuperAdminConsole actorId={user.id} initialCatalog={catalog ?? EMPTY_CATALOG} />
    </div>
  );
}
