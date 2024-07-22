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

export const RESPONSE_STATUS: Record<string, ResponseStatus> = {
  INFO: "info",
  SUCCESS: "success",
  WARN: "warn",
  ERROR: "error",
};

export const _PATHS = {
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
  redirect_to: _PATHS.home,
  plural: "s",
};
