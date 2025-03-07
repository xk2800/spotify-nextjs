/* eslint-disable @typescript-eslint/no-unused-vars */
// app/dashboard/page.tsx
'use client'

import { useEffect, useState } from "react";
import ProfileCard from "@/components/dashboard/ProfileCard";
import PlayerCard from "@/components/dashboard/PlayerCard";
import AlbumsCard from "@/components/dashboard/AlbumsCard";
import Loading from "@/components/Loading";
import { AlbumsResponse, SpotifyAlbum, SpotifyPlayer, SpotifyProfile } from "@/types/types";


export default function Dashboard() {
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalAlbums, setTotalAlbums] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, albumsRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/albums?offset=0&limit=8"),
        ]);

        if (profileRes.ok) {
          setProfile(await profileRes.json());
        } else {
          console.error("Failed to load profile");
        }

        if (albumsRes.ok) {
          const albumsData: AlbumsResponse = await albumsRes.json();
          setAlbums(Array.isArray(albumsData.items) ? albumsData.items : []);
          setNextUrl(albumsData.next);
          setTotalAlbums(albumsData.total || 0);
          setHasMore(!!albumsData.next);
        } else {
          console.error("Failed to load albums");
          setAlbums([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setAlbums([]);
        setHasMore(false);
      }
    }

    fetchData();

    async function fetchPlayer() {
      try {
        const playerRes = await fetch("/api/player");
        if (playerRes.ok) {
          const playerData = await playerRes.json();
          if (playerData && Object.keys(playerData).length > 0 && !playerData.error) {
            setPlayer(playerData);
          } else {
            setPlayer(null); // Clear player state when nothing is playing
          }
        }
      } catch (error) {
        console.error("Error fetching player data:", error);
      }
    }

    // Initial fetch
    fetchPlayer();

    // Poll every 5 seconds
    const interval = setInterval(fetchPlayer, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadMoreAlbums = async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const offset = albums.length;
      const response = await fetch(`/api/auth/albums?offset=${offset}&limit=8`);

      if (response.ok) {
        const data: AlbumsResponse = await response.json();
        setAlbums(prev => [...prev, ...(Array.isArray(data.items) ? data.items : [])]);
        setNextUrl(data.next);
        setHasMore(!!data.next);
      } else {
        console.error("Failed to load more albums");
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more albums:", error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (!profile) return <Loading />;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid md:grid-cols-4 gap-4 md:justify-between">
        <ProfileCard profile={profile} />
        <PlayerCard player={player} />
      </div>

      <AlbumsCard
        albums={albums}
        totalAlbums={totalAlbums}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        loadMoreAlbums={loadMoreAlbums}
      />
    </div>
  );
}