// app/api/auth/albums/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const token = (await cookies()).get("spotify_token")?.value;
  const url = new URL(request.url);
  const offset = url.searchParams.get("offset") || "0";
  const limit = url.searchParams.get("limit") || "20";

  if (!token) {
    return NextResponse.json({ error: "No access token found" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/albums?offset=${offset}&limit=${limit}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 204) {
      // No content, means no active albums session
      return NextResponse.json({ items: [], next: null, total: 0 });
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch albums: ${response.status}`);
    }

    const albums = await response.json();

    return NextResponse.json({
      items: albums.items || [],
      next: albums.next,
      total: albums.total || 0
    });
  } catch (error) {
    console.error("Error fetching albums:", error);
    return NextResponse.json(
      { error: "Failed to fetch albums", items: [], next: null, total: 0 },
      { status: 500 }
    );
  }
}