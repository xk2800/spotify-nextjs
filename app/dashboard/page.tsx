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
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/auth/profile");
      if (res.ok) {
        setProfile(await res.json());
      } else {
        console.error("Failed to load profile");
      }
    }
    fetchProfile();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {profile.display_name}</h1>
      {profile.images?.length > 0 && (
        <img src={profile.images[0].url} alt="Profile" width={100} height={100} />
      )}
      <p>Email: {profile.email}</p>
      <p>Spotify ID: {profile.id}</p>
      <a href={profile.external_urls.spotify} target="_blank">View Profile</a>
    </div>
  );
}