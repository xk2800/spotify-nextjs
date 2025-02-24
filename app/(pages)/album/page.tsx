"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MoveLeft } from "lucide-react";
import { motion } from 'framer-motion';
import Image from "next/image";
import { format } from "date-fns";

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
    total_tracks: string,
    copyrights: string,
    release_date: string,
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
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
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

      <motion.div
        whileHover="hover" // Applies hover animation to all child elements
        className="inline-flex items-center gap-2"
      >
        <Button variant="link" onClick={() => router.back()} className="flex items-center gap-2 pl-2 hover:no-underline hover:text-[#1ED760]">
          <motion.div
            variants={{ hover: { x: -5 } }} // Moves left when parent is hovered
            transition={{ type: "spring", stiffness: 300 }}
          >
            <MoveLeft />
          </motion.div>
          Back to Albums
        </Button>
      </motion.div>

      <div className="flex">
        <div>
          {album.imageUrl ? (
            <Image src={album.imageUrl} alt={album.name || "Album Cover"} width={300} height={300} />
          ) : (
            <p>No album image available</p>
          )}

        </div>

        <div>
          <h1>{album.name || "Unknown Album"}</h1>
          <p>{album.tracks[0].artists}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>{album.release_date.slice(0, 4)}</TooltipTrigger>
              <TooltipContent>
                <p>{format(new Date(album.release_date), "do MMM yyyy")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <p>{album.total_tracks} total tracks</p>
        </div>
      </div>

      <h2>Tracks:</h2>
      {album.tracks.length > 0 ? (
        <Table className="bg-black/30">
          <TableCaption>{album.copyrights}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Track Name</TableHead>
              {/* <TableHead>Artists</TableHead> */}
              <TableHead className="text-right">Duration (min)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {album.tracks.map((track, index) => (
              <TableRow key={track.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{track.name}</TableCell>
                {/* <TableCell>{track.artists}</TableCell> */}
                <TableCell className="text-right">{(track.duration / 60000).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No tracks available</p>
      )}


      <ul>

      </ul>
    </div >
  );
}