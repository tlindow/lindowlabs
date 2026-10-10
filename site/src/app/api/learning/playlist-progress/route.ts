import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getLearningAccess } from "@/lib/auth/getLearningAccess";
import {
  PLAYLIST_PROGRESS_COOKIE,
  emptyPlaylistProgress,
  parsePlaylistProgressCookie,
  serializePlaylistProgress,
  type PlaylistProgress,
} from "@/lib/learning/playlistProgress";

/**
 * Owner playlist progress.
 * Temporary store: httpOnly cookie keyed by Stytch user_id.
 * Needs Vercel KV / Redis for durable multi-device persistence (no KV env in repo yet).
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

async function requireOwner() {
  const access = await getLearningAccess();
  if (access.status !== "ok" || !access.isOwner) {
    return null;
  }
  return access;
}

export async function GET() {
  const access = await requireOwner();
  if (!access) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const jar = await cookies();
  const progress = parsePlaylistProgressCookie(
    jar.get(PLAYLIST_PROGRESS_COOKIE)?.value,
    access.userId
  );
  return NextResponse.json({ progress });
}

export async function PUT(req: Request) {
  const access = await requireOwner();
  if (!access) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body: { progress?: PlaylistProgress };
  try {
    body = (await req.json()) as { progress?: PlaylistProgress };
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const incoming = body.progress;
  if (!incoming || typeof incoming.books !== "object") {
    return NextResponse.json({ error: "invalid_progress" }, { status: 400 });
  }

  const progress: PlaylistProgress = {
    userId: access.userId,
    books: incoming.books ?? {},
  };

  const response = NextResponse.json({ progress });
  response.cookies.set({
    name: PLAYLIST_PROGRESS_COOKIE,
    value: serializePlaylistProgress(progress),
    ...cookieOptions(60 * 60 * 24 * 400),
  });
  return response;
}

export async function DELETE() {
  const access = await requireOwner();
  if (!access) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const progress = emptyPlaylistProgress(access.userId);
  const response = NextResponse.json({ progress });
  response.cookies.set({
    name: PLAYLIST_PROGRESS_COOKIE,
    value: serializePlaylistProgress(progress),
    ...cookieOptions(60 * 60 * 24 * 400),
  });
  return response;
}
