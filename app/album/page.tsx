"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Album() {
  const searchParams = useSearchParams();
  const albumId = searchParams.get("id");

  interface Album {
    name: string;
    imageUrl: string | null;
    tracks: {
      id: string;
      name: string;
      artists: string;
      duration: number;
    }[];
  }

  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter()

  useEffect(() => {
    if (!albumId) {
      setError("No album ID provided");
      setLoading(false);
      return;
    }

    const fetchAlbum = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/tracks?id=${albumId}`);

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Something went wrong");
        }

        const data = await res.json();
        setAlbum(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [albumId]);

  if (loading) return <p>Loading album...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!album) return <p>No album found.</p>; // Handle empty album response

  return (
    <div>

      <Button onClick={() => router.back()}>Back to Albums</Button>

      <h1>{album.name || "Unknown Album"}</h1>

      {album.imageUrl ? (
        <img src={album.imageUrl} alt={album.name || "Album Cover"} width={300} />
      ) : (
        <p>No album image available</p>
      )}

      <h2>Tracks:</h2>
      <ul>
        {album.tracks.length > 0 ? (
          album.tracks.map((track) => (
            <li key={track.id}>
              <strong>{track.name}</strong> - {track.artists} ({(track.duration / 60000).toFixed(2)} min)
            </li>
          ))
        ) : (
          <p>No tracks available</p>
        )}
      </ul>
    </div>
  );
}