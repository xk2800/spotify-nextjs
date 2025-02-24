// components/AlbumTracks.tsx
import { Suspense } from 'react';
// import { TracksResponse } from './types';


interface TracksResponse {
  // items: {
  id: string;
  name: string;
  duration_ms: number;
  // Add other track properties as needed
  // }[];
  // Add other response properties as needed
}


async function getTracks(albumId: string) {
  const response = await fetch(`/api/albums/${albumId}/tracks`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tracks');
  }

  return response.json();
}

async function Tracks({ albumId }: { albumId: string }) {
  const tracks = await getTracks(albumId);

  return (
    <div className="space-y-2">
      {tracks.items.map((track: TracksResponse) => (
        <div key={track.id} className="p-4 border rounded">
          <h3 className="font-medium">{track.name}</h3>
          <p className="text-sm text-gray-600">
            Duration: {Math.floor(track.duration_ms / 1000 / 60)}:
            {String(Math.floor((track.duration_ms / 1000) % 60)).padStart(2, '0')}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function AlbumTracks({ albumId }: { albumId: string }) {
  return (
    <Suspense fallback={<div>Loading tracks...</div>}>
      <Tracks albumId={albumId} />
    </Suspense>
  );
}