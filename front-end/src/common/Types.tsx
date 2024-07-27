export type UseStateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export type LyricsResponse = {
  lyrics: string;
};

export type ItunesResult = {
  artistName: string;
  collectionName: string;
  trackName: string;
  artworkUrl100: string;
};
export type ItunesResponse = {
  resultCount: number;
  results: ItunesResult[];
};

export type ApiResponse = {
  status: string;
  message: string;
  data: object;
};

export type LyricsRequest = {
  artist: string;
  track: string;
};

export type YoutubeQuery = {
  url: string;
};
export type FileUploadQuery = {
  file?: File;
  includeCenterArtwork: boolean;
};
export type ItunesQuery = {
  term: string;
  entity?: string;
  country: string;
  limit?: number;
};

export type Statistics = {
  dateFirstOperation: string;
  dateLastOperation: string;
  artworkGenerations: number;
  lyricsFetches: number;
};

export type ResponseStatus = "info" | "success" | "warn" | "error";

export type Context = {
  // Home
  session_status?: string;
  genius_token?: string;
  stats?: Statistics;

  // Redirect
  error_text?: string;
  redirect_to?: string;
  plural?: string;

  // Lyrics
  lyrics?: string;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
