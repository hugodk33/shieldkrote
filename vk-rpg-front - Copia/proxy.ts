import { NextResponse, type NextRequest } from "next/server";
import { ACTOR_COOKIE } from "@/lib/actorCookie";

/* ============================================================
   Proxy — a porta da frente.

   A landing (`/`), o login e os convites (`/join/*`) são públicos.
   Todo o resto exige a identidade que o login grava no cookie
   `vkrpg.actor`; sem ela, a pessoa é mandada para `/login` com o
   caminho original em `?next=` para voltar depois de entrar.

   Isto não substitui autorização de verdade no backend — é só a
   borda que impede uma tela privada de renderizar sem sessão.
   ============================================================ */

const PUBLIC_PATHS = ["/login", "/join"];

function isPublic(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PATHS.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();
  if (request.cookies.get(ACTOR_COOKIE)?.value) return NextResponse.next();

  const login = request.nextUrl.clone();
  login.pathname = "/login";
  login.search = "";
  login.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
