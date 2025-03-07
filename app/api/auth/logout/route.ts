import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();

  // Clear Spotify auth cookies
  (await cookieStore).set("spotify_token", "", { expires: new Date(0), path: "/" });
  (await cookieStore).set("spotify_refresh_token", "", { expires: new Date(0), path: "/" });

  return NextResponse.json({ message: "Logged out successfully" });
}