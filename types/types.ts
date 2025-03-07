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