// components/dashboard/PlayerCard.tsx
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SpotifyPlayer } from "@/types/types";

interface PlayerCardProps {
  player: SpotifyPlayer | null;
}

export default function PlayerCard({ player }: PlayerCardProps) {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Player Information</CardTitle>
      </CardHeader>
      <CardContent>
        {player ? (
          <div>

            <Image
              src={player.item.album.images?.[0]?.url}
              alt={player.item.album.name}
              width={300}
              height={300}
              className="w-full max-w-xs lg:max-w-lg xl:max-w-xl h-auto rounded-lg"
            />
            <p>{player.item.name}</p>
            <p className="text-xs">by {player.item.artists?.map(artist => artist.name).join(', ')}</p>
            {/* <p>From {player.item.album.name}</p> */}
            <div className="text-xs">
              <p>Media currently playing on:</p>
              <p>{player.device.name}</p>
            </div>
          </div>
        ) : (
          <div>
            <p>Hmm, nothing to see here, since you&apos;re not playing anything on Spotify.</p>
            <p className="text-xs bg-primary inline-block text-primary hover:text-black cursor-pointer transition-colors px-3">
              Try playing something on spotify and see something appear here!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}