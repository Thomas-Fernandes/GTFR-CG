type Statistics = {
  dateFirstOperation: string;
  dateLastOperation: string;
  artworkGenerations: number;
  lyricsFetches: number;
};

type ResponseStatus = "info" | "success" | "warn" | "error";

type Context = {
  // Home
  session_status?: string;
  genius_token?: string;
  stats?: Statistics;

  // Redirect
  error_text?: string;
  redirect_to?: string;
  plural?: string;
}

export type { Context, ResponseStatus, Statistics };
