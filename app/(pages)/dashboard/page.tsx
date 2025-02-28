// app/dashboard/page.tsx
'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import defaultProfilePic from '@/public/default-profile-pic.jpg'
import Loading from "@/components/Loading";

interface SpotifyProfile {
  display_name: string;
  product: string,
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
  item: {
    album: {
      images: {
        url: string,
      }[];
      name: string
    };
  };
}

interface SpotifyAlbum {
  album: {
    id: string;
    name: string;
    images: { url: string }[];
    artists: { name: string }[];
    external_urls: {
      spotify: string;
    };
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

  // if (!profile) return <p>Loading...</p>;
  if (!profile) return <Loading />;
  // if (albums.length === 0) return <p>No saved albums found.</p>; // ✅ Now this won't crash

  return (
    <div className="flex flex-col gap-5">
      <div className="grid md:grid-cols-4 gap-4 md:justify-between">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Welcome, {profile.display_name}</CardTitle>
            <CardDescription>Here is a quick glimpse of your spotify profile</CardDescription>
          </CardHeader>
          <CardContent>
            {profile.images?.[0]?.url ? (
              <Image src={profile.images[0].url} alt="Profile" width={100} height={100} priority />
            ) : (
              <Image src={defaultProfilePic} alt="Profile" width={100} height={100} priority />
            )}
            <Badge variant={"default"} className="capitalize mt-2">{profile.product}</Badge>
            <p>Email: {profile.email}</p>
            <p>Spotify ID: {profile.id}</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant={'secondary'}>
              <Link href={profile.external_urls.spotify} target="_blank">Check out my Profile on Spotify</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Player Information</CardTitle>
          </CardHeader>
          <CardContent>
            {player ? (
              <div>
                <Image src={player.item.album.images?.[0]?.url} alt={player.item.album.name} width={300} height={300} />
                <p>{player.item.album.name}</p>
                <p>Media currently playing on:</p>
                <p>{player.device.name}</p>
              </div>
            ) : (
              <div>
                <p>Hmm, nothing to see here, since you&apos;re not playing anything on Spotify.</p>
                <p className="text-xs bg-primary inline-block text-primary hover:text-black cursor-pointer transition-colors px-3">Try playing something on spotify and see something appear here!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Your Saved Albums</CardTitle>
            <CardDescription>Let&apos;s see what albums have you saved recently</CardDescription>
          </CardHeader>
          <CardContent>
            {albums.length > 0 ? (
              <motion.ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {albums.map((album) => (
                  <Link key={album.album.id} href={`/album?AlbumId=${album.album.id}`}>
                    <motion.li
                      variants={{ hover: { x: -5 } }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <p className="hidden">{album.album.external_urls.spotify}</p>
                      <Image
                        src={album.album.images[0]?.url}
                        alt={album.album.name}
                        width={1000}
                        height={1000}
                      />
                      <div className="flex flex-col">
                        <span className="truncate overflow-hidden text-lg">{album.album.name}</span>
                        <span className="text-xs -mt-1">by {album.album.artists[0]?.name}</span>
                      </div>
                    </motion.li>
                  </Link>
                ))}
              </motion.ul>
            ) : (
              <div>
                <p>Hmm, it seems like you didn&apos;t save any albums yet.</p>
                <p className="text-xs bg-primary inline-block text-primary hover:text-black cursor-pointer transition-colors px-3">Try adding an album on spotify and see something appear here!</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>


      </div>
    </div>
  );
}