// app/api/auth/player/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const token = (await cookies()).get("spotify_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No access token found" }, { status: 401 });
  }

  try {
    const response = await fetch("https://api.spotify.com/v1/me/player/", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 204) {
      // No content, means no active player session
      return NextResponse.json({});
    }

    if (!response.ok) {
      throw new Error("Failed to fetch player");
    }

    const player = await response.json();

    return NextResponse.json(player);
  } catch (error) {
    console.error("Error fetching player:", error);
    return NextResponse.json({ error: "Failed to fetch player" }, { status: 500 });
  }
}