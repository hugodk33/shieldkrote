import { UserType } from "./userTypes";
import type { GameTable } from "./types";

/* ============================================================
   Superadmin — o anel que comanda os outros anéis.

   O fluxo de cadastro do catálogo (pacotes/kits e categorias) é
   exclusivo da conta semeada `d3miurg0`, que também é a dona das
   duas mesas-base. A regra combina os dois sinais: tipo Admin (2)
   E o nome de usuário. Só o nome não basta (alguém poderia criar
   um jogador homônimo) e só o tipo abriria o fluxo para qualquer
   admin futuro.
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

/** Uma mesa-base é uma mesa cujo narrador é o superadmin da seed. */
export function isBaseTable(
  table: Pick<GameTable, "narrator"> | null | undefined
): boolean {
  return isSuperAdmin(table?.narrator);
}
