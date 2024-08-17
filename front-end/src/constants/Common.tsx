import { ResponseStatus } from "../common/Types";

/**************** GENERIC ****************/

export const TOAST: Record<string, string> = {
  DEFAULT: "An unknown error occurred.\n"
    + "Please try again later or open an issue.",
  SERVER_UNAVAILABLE: "Server unavailable.\n"
    + "Please check that the Python server is running.",
  NO_SPINNER_ID: "HTML Spinner id is required.",
  NO_SPINNER_CONTAINER: "Spinner container not found.",

  // Redirect
    NO_PROCESSED_IMAGE: "No processed image found.",
    NO_GENIUS_TOKEN: "Genius API token not found.",

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

  // Processed Images
    NO_IMG_SELECTION: "Please select an image to download.",

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
  MS_PROGRESS_UPDATE: 10,
};
export const SPINNER_ID = {
  // Home
    STATISTICS_FIRST_OPERATION: "home_statistics_first-operation",
    STATISTICS_LAST_OPERATION: "home_statistics_last-operation",
    STATISTICS_ARTWORK_GENERATION: "home_statistics_artwork-generation",
    STATISTICS_LYRICS_FETCHES: "home_statistics_lyrics-fetches",

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

  REDIRECT: "Redirect",
  HOME: "Home",
  ARTWORK_GENERATION: "Artwork Generation",
  PROCESSED_IMAGES: "Processed Images",
  LYRICS: "Lyrics",
};

export const PATHS = {
  redirect: "/redirect",
  home: "/home",
  artworkGeneration: "/artwork-generation",
  processedImages: "/processed-images",
  lyrics: "/lyrics",
};

export const DEFAULT_REDIRECTION = {
  error_text: "",
  redirect_to: PATHS.home,
  plural: "s",
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,

  MULTIPLE_CHOICES: 300,
  REDIRECTION: 301,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,

  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVER_UNAVAILABLE: 503,
};

export const ITUNES_URL = "https://itunes.apple.com";
export const BACKEND_URL = "http://localhost:8000/api";