import { Context, ResponseStatus } from "./Types";

export const REGEX_YOUTUBE_URL = [
  /https?:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}/,
  /https?:\/\/youtu\.be\/[a-zA-Z0-9_-]{11}/,
];

export const ACCEPTED_IMG_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
];

export const DEFAULT_EVENT_DURATION = {
  SECONDS_TOAST: 5,
  MS_FADE_OUT: 500,
  MS_VERTICAL_SLIDE: 200,
};

export const RESPONSE: Record<string, Record<string, string>> = {
  ERROR: {
    LYRICS_NOT_FOUND: "Lyrics not found.",
  },
};

export const RESPONSE_STATUS: Record<string, ResponseStatus> = {
  INFO: "info",
  SUCCESS: "success",
  WARN: "warn",
  ERROR: "error",
};
export const TOAST_TYPE = RESPONSE_STATUS;

export const TITLE = {
  PREFIX: "GTFR-CG - ",
  HOME: "Home",
  LYRICS: "Lyrics",
  PROCESSED_IMAGES: "Processed Images",
  ARTWORK_GENERATION: "Artwork Generation",
  REDIRECT: "Redirect",
};

export const PATHS = {
  home: "/home",
  redirect: "/redirect",
  artworkGeneration: "/artwork-generation",
  processedImages: "/processed-images",
  lyrics: "/lyrics",
};

export const DEFAULT_CONTEXT: Context = {
  // Home
  session_status: "initializing",
  genius_token: "",
  stats: {
    dateFirstOperation: "N/A",
    dateLastOperation: "N/A",
    artworkGenerations: 0,
    lyricsFetches: 0,
  },

  // Redirect
  error_text: "",
  redirect_to: PATHS.home,
  plural: "s",
};
