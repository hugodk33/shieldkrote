import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/* ============================================================
   `/player` — link antigo.

   O lobby da mesa continua em `/player/table/[id]`; esta rota
   apenas encaminha para a estante "Jogando" do hub, onde cada
   mesa tem o seu próprio cartão.
   ============================================================ */

export default function PlayerHome() {
  redirect("/tables#playing");
}
