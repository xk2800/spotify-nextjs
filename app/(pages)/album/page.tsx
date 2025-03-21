"use client";

import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { MoveLeft } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { Album } from "@/types/types";

// AlbumContent component that uses useSearchParams
const AlbumContent = () => {
  const searchParams = useSearchParams();
  const albumId = searchParams.get("AlbumId");
  const router = useRouter();



  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!albumId) {
      setError("No album ID provided");
      setLoading(false);
      return;
    }

    const fetchAlbum = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/tracks?AlbumId=${albumId}`);

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

  if (loading) return <Loading />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!album) return <p>No album found.</p>;

  return (
    <div>
      <motion.div
        whileHover="hover"
        className="inline-flex items-center gap-2"
      >
        <Button variant="link" onClick={() => router.back()} className="flex items-center gap-2 pl-2 hover:no-underline hover:text-[#1ED760] hover:scale-100">
          <motion.div
            variants={{ hover: { x: -5 } }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <MoveLeft />
          </motion.div>
          Back to Dashboard
        </Button>
      </motion.div>

      <div className="mt-5">
        <div className="flex justify-center mb-5">
          {album.imageUrl ? (
            <Image
              src={album.imageUrl}
              alt={album.name || "Album Cover"}
              width={300}
              height={300}
              className="rounded-lg"
            />
          ) : (
            <p>No album image available</p>
          )}
        </div>

        <div className="font-medium">
          <h1 className="text-4xl font-bold">{album.name || "Unknown Album"}</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-xs">{album.release_date.slice(0, 4)}</TooltipTrigger>
              <TooltipContent>
                <p>{format(new Date(album.release_date), "do MMM yyyy")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="text-xs">{album.total_tracks} tracks to possibly groove to</div>

          <div className="flex items-center gap-4 mt-5">
            <Image src={album.artistProfileImage} width={60} height={60} alt={album.mainArtist} className="rounded-lg" />
            {album.mainArtist}
          </div>
        </div>
      </div>

      <div className="my-7">
        <h2 className="mb-4">What&apos;s in this album?</h2>
        {album.tracks.length > 0 ? (
          <Table className="bg-black/30">
            <TableCaption>{album.copyrights}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Track Name</TableHead>
                <TableHead className="text-center w-[160px]">Duration (min)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {album.tracks.map((track, index) => (
                <TableRow key={track.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{track.name}</TableCell>
                  <TableCell className="text-center w-[160px]">{Math.floor(track.duration / 60000)}:{((track.duration % 60000) / 1000).toFixed(0).padStart(2, '0')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No tracks available</p>
        )}
      </div>
    </div>
  );
};

// Main Album page component with Suspense boundary
export default function Album() {
  return (
    <Suspense fallback={'Loading...'}>
      <AlbumContent />
    </Suspense>
  );
}