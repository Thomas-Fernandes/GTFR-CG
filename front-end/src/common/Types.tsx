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
