import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getLearningAccess } from "@/lib/auth/getLearningAccess";
import {
  PLAYLIST_PROGRESS_COOKIE,
  parsePlaylistProgressCookie,
  serializePlaylistProgress,
} from "@/lib/learning/playlistProgress";

/**
 * Owner-only Already read shelf JSON.
 * Same cookie store as playlist progress. Seeds defaults when uninitialized.
 */

function cookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export async function GET() {
  const access = await getLearningAccess();
  if (access.status !== "ok" || !access.isOwner) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const jar = await cookies();
  const progress = parsePlaylistProgressCookie(
    jar.get(PLAYLIST_PROGRESS_COOKIE)?.value,
    access.userId
  );

  const response = NextResponse.json({
    userId: access.userId,
    alreadyRead: progress.alreadyRead,
  });

  // Persist seeded/defaulted shelf so later edits are not overwritten by re-seed.
  response.cookies.set({
    name: PLAYLIST_PROGRESS_COOKIE,
    value: serializePlaylistProgress(progress),
    ...cookieOptions(60 * 60 * 24 * 400),
  });

  return response;
}
