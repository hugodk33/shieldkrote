import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/* ============================================================
   `/narrator` — link antigo.

   A seleção de mesas deixou de ser uma tela por papel: o hub em
   `/tables` mostra o que a pessoa narra e o que joga. Quem chega
   por um link antigo cai direto na estante "Narrando".
   ============================================================ */

export default function NarratorHome() {
  redirect("/tables#narrating");
}
