// app/api/auth/albums/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const token = (await cookies()).get("spotify_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No access token found" }, { status: 401 });
  }

  try {
    const response = await fetch("https://api.spotify.com/v1/me/albums", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 204) {
      // No content, means no active albums session
      return NextResponse.json({});
    }

    if (!response.ok) {
      throw new Error("Failed to fetch albums");
    }

    const albums = await response.json();
    console.log(albums);

    return NextResponse.json(albums);
  } catch (error) {
    console.error("Error fetching albums:", error);
    return NextResponse.json({ error: "Failed to fetch albums" }, { status: 500 });
  }
}