import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady?: () => void;
    Spotify: any;
  }
}

export default function Player() {
  const [player, setPlayer] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [track, setTrack] = useState<any>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = process.env.SPOTIFY_CLIENT_SECRET; // Get a fresh token dynamically
      const spotifyPlayer = new window.Spotify.Player({
        name: "Spotify Profile App",
        getOAuthToken: (cb: (token: string) => void) => {
          cb(token);
        },
        volume: 0.5,
      });

      spotifyPlayer.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Player is ready with Device ID:", device_id);
        setDeviceId(device_id);
      });

      spotifyPlayer.addListener("player_state_changed", (state: any) => {
        if (!state) return;
        console.log("Player state changed:", state);

        const currentTrack = state.track_window.current_track;
        setTrack(currentTrack);
      });

      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    };

    return () => {
      if (player) player.disconnect();
    };
  }, []);

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Player Information</CardTitle>
      </CardHeader>
      <CardContent>
        {track ? (
          <div>
            <Image src={track.album.images[0].url} alt={track.name} width={300} height={300} />
            <p>{track.name}</p>
            <p>Media currently playing on:</p>
            <p>{deviceId ? `Device ID: ${deviceId}` : "Unknown device"}</p>
          </div>
        ) : (
          <div>
            <p>Hmm!, nothing to see here, since you&apos;re not playing anything on Spotify.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}