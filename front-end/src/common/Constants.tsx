import { Context, ResponseStatus } from "./Types";

export const PROCESSED_IMAGES = {
  COVER_ART_FILENAME: "ProcessedArtwork.png",

  LOGO_POSITIONS: [
    "top-left", "top-center", "top-right",
    "center-left", "center-center", "center-right",
    "bottom-left", "bottom-center", "bottom-right",
  ],
  DEFAULT_SELECTED_POSITION: "center-left",
};

export const ARTWORK_GENERATION = {
  ITUNES: {
    MAX_TITLE_LENGTH: 42,
    MAX_CROP_LENGTH: 12,
  },
  FILE_UPLOAD: {
    ACCEPTED_IMG_EXTENSIONS: [
      "jpg",
      "jpeg",
      "png",
    ]
  },
  YOUTUBE: {
    REGEX_YOUTUBE_URL: [
      /https?:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}/,
      /https?:\/\/youtu\.be\/[a-zA-Z0-9_-]{11}/,
    ],
  },
};

/**************** GENERIC ****************/

export const RESPONSE: Record<string, Record<string, string>> = {
  WARN: {
    // Artwork Generation
    NO_RESULTS_FOUND: "No results found.",
    NO_IMG: "Please select an image file.",
    INVALID_FILE_TYPE: "Please select a valid image file.",
    INVALID_URL: "Please enter a valid URL.",

    // Lyrics
    MISSING_FIELDS: "Please fill out all the required fields.",
  },
  ERROR: {
    // Lyrics
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

export const DEFAULT_EVENT_DURATION = {
  SECONDS_TOAST: 5,
  MS_FADE_OUT: 500,
  MS_VERTICAL_SLIDE: 200,
};
export const SPINNER_ID = {
  // Artwork Generation
  ITUNES: "artwork-generation_search-form",
  FILE_UPLOAD: "artwork-generation_file-upload",
  YOUTUBE_URL: "artwork-generation_youtube-url",

  // Lyrics
  LYRICS_SEARCH: "lyrics_search",
  LYRICS_SAVE: "lyrics_save",
}

/***************** CONFIG ****************/

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

export const ITUNES_URL = "https://itunes.apple.com";
export const BACKEND_URL = "http://localhost:8000";