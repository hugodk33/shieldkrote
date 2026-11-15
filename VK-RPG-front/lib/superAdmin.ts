import { UserType } from "./userTypes";

/* ============================================================
   Superadmin — o anel que comanda os outros anéis.

   O fluxo de cadastro do catálogo (kits e categorias) é
   exclusivo da conta semeada `d3miurg0`. A regra combina os dois
   sinais: tipo Admin (2) E o nome de usuário. Só o nome não basta
   (alguém poderia criar um jogador homônimo) e só o tipo abriria
   o fluxo para qualquer admin futuro.

   As mesas de exemplo pertencem a um narrador próprio da seed;
   o superadmin apenas enxerga todas as mesas e mantém o catálogo.
   ============================================================ */

export const SUPERADMIN_USERNAME = "d3miurg0";

type Identity = { type?: number | null; username?: string | null } | null | undefined;

export function isSuperAdmin(identity: Identity): boolean {
  if (!identity) return false;
  return (
    identity.type === UserType.Admin &&
    (identity.username ?? "").trim().toLowerCase() === SUPERADMIN_USERNAME
  );
}
