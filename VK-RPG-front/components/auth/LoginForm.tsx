"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { login } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";

/* ============================================================
   LoginForm — usuário + senha, sem seletor de papel.

   O papel não é escolhido aqui: depois de entrar, o hub de mesas
   mostra o que a pessoa narra e o que ela joga.
   ============================================================ */

export default function LoginForm({ next }: { next: string | null }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setError(null);
    try {
      await login(username.trim(), password);
      router.replace(next ?? "/tables");
      router.refresh();
    } catch (e) {
      const message = (e as Error)?.message ?? "";
      setError(
        message.includes("401") ? t("pg.login.error") : t("pg.login.connectionError")
      );
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-400/90">
          {t("pg.login.formEyebrow")}
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100 mt-1">
          {t("pg.login.formTitle")}
        </h2>
      </div>

      <label className="block">
        <span className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
          {t("pg.login.username")}
        </span>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          autoFocus
          required
          disabled={busy}
          placeholder={t("pg.login.usernamePh")}
          className="w-full rounded-lg border border-zinc-700/70 bg-zinc-900/80 px-3.5 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-700/70 focus:ring-2 focus:ring-emerald-800/30 disabled:opacity-60"
        />
      </label>

      <label className="block">
        <span className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
          {t("pg.login.password")}
        </span>
        <span className="relative block">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            disabled={busy}
            placeholder={t("pg.login.passwordPh")}
            className="w-full rounded-lg border border-zinc-700/70 bg-zinc-900/80 px-3.5 py-3 pr-11 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-700/70 focus:ring-2 focus:ring-emerald-800/30 disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? t("pg.login.hidePassword") : t("pg.login.showPassword")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </span>
      </label>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-800/50 bg-red-950/30 px-3 py-2.5 text-xs text-red-300"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy || !username.trim() || !password}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors shadow-lg shadow-emerald-950/40 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
        {busy ? t("pg.login.submitting") : t("pg.login.submit")}
      </button>

      <div className="space-y-2 pt-1">
        <p className="text-xs text-zinc-500 leading-relaxed">{t("pg.login.noAccount")}</p>
        <p className="font-mono text-[10px] leading-relaxed text-zinc-600">
          {t("pg.login.demoHint")}
        </p>
      </div>
    </form>
  );
}
