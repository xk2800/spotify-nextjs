// app/dashboard/page.tsx
'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SpotifyProfile {
  display_name: string;
  email: string;
  id: string;
  images?: { url: string }[];
  external_urls: {
    spotify: string;
  };
}

interface SpotifyPlayer {
  device: {
    name: string;
  };
}

interface SpotifyAlbum {
  album: {
    id: string;
    name: string;
    images: { url: string }[];
    artists: { name: string }[];
  };
}

export default function Dashboard() {
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, playerRes, albumsRes] = await Promise.all([
          fetch("/api/auth/profile"),
          fetch("/api/auth/player"),
          // fetch("/api/auth/albums"),
          fetch("/server/albums"),
        ]);

        if (profileRes.ok) {
          setProfile(await profileRes.json());
        } else {
          console.error("Failed to load profile");
        }

        if (playerRes.ok) {
          const playerData = await playerRes.json();
          if (playerData && Object.keys(playerData).length > 0 && !playerData.error) {
            setPlayer(playerData);
          } else {
            console.log("No active player found, skipping update.");
          }
        }

        if (albumsRes.ok) {
          const albumsData = await albumsRes.json();
          setAlbums(Array.isArray(albumsData.items) ? albumsData.items : []); // ✅ Ensures albums is always an array
          console.log(albumsData);

        } else {
          console.error("Failed to load albums");
          setAlbums([]); // ✅ Fallback to empty array
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setAlbums([]); // ✅ Fallback to empty array on error
      }
    }

    fetchData();
  }, []);

  if (!profile) return <p>Loading...</p>;
  if (albums.length === 0) return <p>No saved albums found.</p>; // ✅ Now this won't crash

  return (
    <div>
      <h1>Welcome, {profile.display_name}</h1>
      {profile.images?.[0]?.url && (
        <Image src={profile.images[0].url} alt="Profile" width={100} height={100} priority />
      )}
      <p>Email: {profile.email}</p>
      <p>Spotify ID: {profile.id}</p>
      <a href={profile.external_urls.spotify} target="_blank">View Profile</a>
      {player &&
        <p>Media currently playing on: {player.device.name}</p>
      }
      <p>Your Saved Playlists</p>
      <ul className="grid grid-cols-2 md:grid-cols-7">
        {albums.map((album) => (
          <Link key={album.album.id} href={`/album?id=${album.album.id}`}>
            <li>
              <p className="text-bold text-red-200">{album.album.external_urls.spotify}</p>
              <img
                src={album.album.images[0]?.url}
                alt={album.album.name}
                width={100}
                height={100}
              />
              <p>{album.album.name} - {album.album.artists[0]?.name}</p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}