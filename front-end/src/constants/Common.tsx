import { Context, ResponseStatus } from "../common/Types";

/**************** GENERIC ****************/

export const TOAST: Record<string, string> = {
  DEFAULT: "An unknown error occurred.\n"
    + "Please try again later or open an issue.",

  // Home
    WELCOME: "Welcome to GTFR-CG!\n"
      + "Application started successfully.",
    GENIUS_TOKEN_NOT_FOUND: "Genius API token not found.\n"
      + "Lyrics fetch is disabled.",
    ADD_GENIUS_TOKEN: "Add your Genius API token to your\n"
      + ".env file and restart the application\n"
      + "to enable lyrics fetch.",

  // Artwork Generation
    NO_RESULTS_FOUND: "No results found.",
    NO_IMG: "Please select an image file.",
    INVALID_FILE_TYPE: "Please select a valid image file.",
    INVALID_URL: "Please enter a valid URL.",

  // Lyrics
    MISSING_FIELDS: "Please fill out all the required fields.",
    LYRICS_NOT_FOUND: "Lyrics not found.",
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
  // Redirect
  error_text: "",
  redirect_to: PATHS.home,
  plural: "s",
};

export const ITUNES_URL = "https://itunes.apple.com";
export const BACKEND_URL = "http://localhost:8000/api";