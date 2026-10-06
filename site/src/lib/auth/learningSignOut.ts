"use server";

import { signOut } from "@/auth";

export async function learningSignOut() {
  await signOut({ redirectTo: "/" });
}
