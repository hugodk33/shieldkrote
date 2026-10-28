"use client";

import { api } from "@/lib/api";
import type { PublicUser } from "@/lib/types";
import { clearSeat, writeSession } from "@/lib/seat";
import { setNarratorSide } from "@/lib/side";

/* ============================================================
   Session — the browser side of the username/password login.

   There is no server session table: the backend verifies the
   credentials and the browser keeps the same actor cookie the rest
   of the app already reads. Logging in writes the username cookie
   (so the header can greet you) and starts from a clean
   perspective; each table card chooses the hat afterwards.
   ============================================================ */

export async function login(username: string, password: string): Promise<PublicUser> {
  const user = await api<PublicUser>("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  writeSession(user.id, user.username);
  /* A fresh session must not inherit a character preview from whoever was
     using this browser before. The hub picks the perspective per table. */
  setNarratorSide();
  return user;
}

export function logout(): void {
  clearSeat();
}
