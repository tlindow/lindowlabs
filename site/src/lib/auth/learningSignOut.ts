"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { STYTCH_SESSION_COOKIE } from "@/lib/auth/learningAuth";

export async function learningSignOut() {
  const jar = await cookies();
  jar.delete(STYTCH_SESSION_COOKIE);
  redirect("/");
}
