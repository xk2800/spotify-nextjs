import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  console.log(searchParams);

  const albumId = searchParams.get("id");

  if (!albumId) {
    return NextResponse.json({ error: "Album ID is required" }, { status: 400 });
  }

  // const token = "YOUR_SPOTIFY_ACCESS_TOKEN"; // Replace this with your actual token
  const token = (await cookies()).get("spotify_token")?.value;

  try {
    // Fetch album details
    const albumResponse = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!albumResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch album details" }, { status: albumResponse.status });
    }

    const albumData = await albumResponse.json();

    // Fetch Album Tracks
    const tracksResponse = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!tracksResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch album tracks" }, { status: tracksResponse.status });
    }

    const tracksData = await tracksResponse.json();

    return NextResponse.json({
      name: albumData.name,
      imageUrl: albumData.images?.[0]?.url || null, // Get the album cover image
      tracks: tracksData.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map((artist: any) => artist.name).join(", "), // Combine multiple artists
        duration: track.duration_ms,
      })),
    });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}