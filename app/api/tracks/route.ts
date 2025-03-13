import { ArtistAPI, Track, TracksData } from "@/types/types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  console.log(searchParams);

  const albumId = searchParams.get("AlbumId");

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


    // Fetch Artist
    const artistsResponse = await fetch(`https://api.spotify.com/v1/artists/${albumData.artists?.[0]?.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!artistsResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch album artists" }, { status: tracksResponse.status });
    }

    const artistsData = await artistsResponse.json();

    console.log(artistsData.images?.[0].url);

    return NextResponse.json({
      name: albumData.name,
      mainArtist: albumData.artists?.[0]?.name,
      copyrights: albumData.copyrights?.[0]?.text,
      total_tracks: albumData.total_tracks,
      release_date: albumData.release_date,
      imageUrl: albumData.images?.[0]?.url || null, // Get the album cover image
      tracks: (tracksData as TracksData).items.map((track: Track) => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map((artist: ArtistAPI) => artist.name).join(", "), // Combine multiple artists
        duration: track.duration_ms,
      })),

      // Artist
      artistProfileImage: artistsData.images?.[0].url
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}