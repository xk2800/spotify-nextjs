// app/dashboard/page.tsx
'use client'

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

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, playerRes] = await Promise.all([
          fetch("/api/auth/profile"),
          fetch("/api/auth/player"),
        ]);

        if (profileRes.ok) {
          setProfile(await profileRes.json());
        } else {
          console.error("Failed to load profile");
        }

        if (playerRes.ok) {
          const playerData = await playerRes.json();
          console.log(playerData);
          setPlayer(playerData);
        } else {
          console.error("Failed to load player");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  if (!profile) return <p>Loading...</p>;
  // if (!player) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {profile.display_name}</h1>
      {profile.images?.length > 0 && (
        <img src={profile.images[0].url} alt="Profile" width={100} height={100} />
      )}
      <p>Email: {profile.email}</p>
      <p>Spotify ID: {profile.id}</p>
      <a href={profile.external_urls.spotify} target="_blank">View Profile</a>
      <p>Device: { }</p>
    </div>
  );
}