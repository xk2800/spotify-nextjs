// types/spotify.ts

export interface SpotifyProfile {
  display_name: string;
  product: string;
  email: string;
  id: string;
  images?: { url: string }[];
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyPlayer {
  device: {
    name: string;
  };
  item: {
    name: string
    artists: { name: string; }[];
    album: {
      images: {
        url: string;
      }[];
      name: string;
    };
  };
}

export interface SpotifyAlbum {
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

export interface AlbumsResponse {
  items: SpotifyAlbum[];
  next: string | null;
  total: number;
}

// Generic interface for data items
export interface DataItem {
  id: string;
  [key: string]: string | number | boolean | object | undefined;
}

// Generic interface for paginated data
export interface PaginatedData<T extends DataItem> {
  items: T[];
  total: number;
  next: string | null;
  previous: string | null;
}

export interface Artist {
  id: string;
  name: string;
  images?: Array<{ url: string }>;
  genres?: string[];
  [key: string]: string | number | boolean | Array<{ url: string }> | string[] | undefined;
}

export interface ArtistAPI {
  name: string;
}

export interface Track {
  id: string;
  name: string;
  artists: ArtistAPI[];
  duration_ms: number;
}

export interface TracksData {
  items: Track[];
}

export interface Album {
  name: string;
  imageUrl: string | null;
  tracks: {
    id: string;
    name: string;
    artists: string;
    duration: number;
  }[];
  total_tracks: string;
  copyrights: string;
  release_date: string;
  mainArtist: string,
  artistProfileImage: string,
}

export interface ProfileCardProps {
  profile: SpotifyProfile;
}

export interface TracksResponse {
  // items: {
  id: string;
  name: string;
  duration_ms: number;
  // Add other track properties as needed
  // }[];
  // Add other response properties as needed
}

export interface PlayerCardProps {
  player: SpotifyPlayer | null;
}

export interface AlbumsCardProps {
  albums: SpotifyAlbum[];
  totalAlbums: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMoreAlbums: () => Promise<void>;
}

export interface CachedData<T extends DataItem> {
  [key: string]: {
    data: PaginatedData<T> | null;
    items: T[];
    offset: number;
    hasMore: boolean;
  }
}

export interface UsePaginatedDataProps<T extends DataItem> {
  fetchData: (params: { key: string, offset: number }) => Promise<PaginatedData<T>>;
  initialKey: string;
  maxItems?: number;
}

// Props for the DataPaginator component
export interface DataPaginatorProps<T extends DataItem> {
  items: T[];
  total: number;
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

// Props for the DataViewer component
export interface DataViewerProps<T extends DataItem> {
  data: PaginatedData<T> | null;
  renderItems: (items: T[]) => React.ReactNode;
}

// Props for the TimeRangeSelector component
export interface TimeRangeSelectorProps {
  currentRange: string;
  ranges: Array<{ id: string, label: string }>;
  onChange: (range: string) => void;
}

export interface TimeMachineData {
  total: number;
  items: Array<{
    id: string;
    name: string;
    images?: Array<{
      url: string;
    }>;
    genres?: string[];
  }>;
}