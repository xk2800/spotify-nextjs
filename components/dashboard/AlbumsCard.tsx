// components/dashboard/AlbumsCard.tsx
import Image from "next/image";
import Link from "next/link";
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlbumsCardProps } from "@/types/types";

export default function AlbumsCard({
  albums,
  totalAlbums,
  hasMore,
  isLoadingMore,
  loadMoreAlbums
}: AlbumsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Saved Albums</CardTitle>
        <CardDescription>Let&apos;s see what albums have you saved recently</CardDescription>
      </CardHeader>
      <CardContent>
        {albums.length > 0 ? (
          <>
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
                      className="rounded-lg"
                    />
                    <div className="flex flex-col">
                      <span className="truncate overflow-hidden text-lg">{album.album.name}</span>
                      <span className="text-xs -mt-1">by {album.album.artists[0]?.name}</span>
                    </div>
                  </motion.li>
                </Link>
              ))}
            </motion.ul>

            {albums.length > 0 && (
              <div className="mt-6 flex justify-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Showing {albums.length} of {totalAlbums} albums
                </p>
              </div>
            )}

            {hasMore && (
              <div className="mt-2 flex justify-center">
                <Button
                  onClick={loadMoreAlbums}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? "Loading..." : "Load More Albums"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div>
            <p>Hmm, it seems like you didn&apos;t save any albums yet.</p>
            <p className="text-xs bg-primary inline-block text-primary hover:text-black cursor-pointer transition-colors px-3">
              Try adding an album on spotify and see something appear here!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}