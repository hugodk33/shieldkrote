"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutGrid, LogIn, LogOut, UserRound } from "lucide-react";
import LanguageSwitch from "./LanguageSwitch";
import { logout } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";

/* ============================================================
   Header — a moldura de todas as páginas.

   Antes da sessão ele oferece só "Entrar"; depois, o atalho para
   as mesas, o nome de quem está conectado e "Sair". O hub é o
   destino natural: cada pessoa escolhe ali o que narra e o que
   joga, sem um papel fixo decidido no login.
   ============================================================ */

export default function Header({
  userId,
  username,
}: {
  userId: string | null;
  username: string | null;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const signedIn = Boolean(userId);

  const signOut = () => {
    if (busy) return;
    setBusy(true);
    logout();
    router.replace("/");
    router.refresh();
  };

  return (
    <header className="bg-zinc-800/90 border-b border-zinc-700/50 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4 h-14">
          <div className="flex items-center gap-6 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-2 text-amber-400 font-bold text-xl tracking-tight shrink-0"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              ShieldFrog
            </Link>

            {signedIn ? (
              <Link
                href="/tables"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                {t("pg.nav.tables")}
              </Link>
            ) : null}
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <LanguageSwitch />

            {signedIn ? (
              <>
                <Link
                  href="/tables"
                  aria-label={t("pg.nav.tables")}
                  className="sm:hidden inline-flex items-center justify-center w-8 h-8 rounded-md border border-zinc-700/60 text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Link>

                {username ? (
                  <span className="hidden md:inline-flex items-center gap-1.5 max-w-[10rem] rounded-full border border-zinc-700/60 bg-zinc-900/70 px-2.5 py-1 text-xs text-zinc-300">
                    <UserRound className="w-3.5 h-3.5 text-emerald-400/80 shrink-0" />
                    <span className="truncate">{username}</span>
                  </span>
                ) : null}

                <button
                  type="button"
                  onClick={signOut}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700/60 px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:border-zinc-500/70 hover:text-zinc-100 disabled:opacity-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t("pg.nav.logout")}</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              >
                <LogIn className="w-3.5 h-3.5" />
                {t("pg.nav.login")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
