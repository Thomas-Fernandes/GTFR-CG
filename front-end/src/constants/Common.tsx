import { ResponseStatus } from "../common/Types";

/**************** GENERIC ****************/

export const TOAST: Record<string, string> = {
  DEFAULT: "An unknown error occurred.\n"
    + "Please try again later or open an issue.",
  SERVER_UNAVAILABLE: "Server unavailable.\n"
    + "Please check that the Python server is running.",
  NO_SPINNER_ID: "HTML Spinner id is required.",
  NO_SPINNER_CONTAINER: "Spinner container not found.",
  PROCESSING_IN_PROGRESS: "Processing already in progress.",

  // Redirect
    NO_PROCESSED_IMAGE: "No processed image found.",
    NO_GENIUS_TOKEN: "Genius API token not found.",
    NO_CARDS_CONTENTS: "No cards contents found.\n"
      + "Please generate contents via the Lyrics page first.",

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
    FETCH_IN_PROGRESS: "Lyrics fetch already in progress.",
    LYRICS_NOT_FOUND: "Lyrics not found.",
    SAVING_IN_PROGRESS: "Lyrics saving already in progress.",

  // Cards Generation
    NO_CARDS: "No cards were generated.",
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
    STATISTICS_CARDS_GENERATION: "home_statistics_cards-generation",

  // Artwork Generation
    ITUNES: "artwork-generation_search-form",
    ITUNES_OPTION: "artwork-generation_itunes-result",
    FILE_UPLOAD: "artwork-generation_file-upload",
    YOUTUBE_URL: "artwork-generation_youtube-url",

  // Lyrics
    LYRICS_SEARCH: "lyrics_search",
    LYRICS_SAVE: "lyrics_save",

  // Cards Generation
    CARDS_GENERATE: "cards-generation_generate",
}

/***************** CONFIG ****************/

export const TITLE = {
  PREFIX: "GTFR-CG - ",

  REDIRECT: "Redirect",
  TESTS: "Tests",
  HOME: "Home",
  ARTWORK_GENERATION: "Artwork Generation",
  PROCESSED_IMAGES: "Processed Images",
  LYRICS: "Lyrics",
  CARDS_GENERATION: "Cards Generation",
};

export const PATHS = {
  redirect: "/redirect",
  home: "/home",
  tests: "/tests",
  artworkGeneration: "/artwork-generation",
  processedImages: "/processed-images",
  lyrics: "/lyrics",
  cardsGeneration: "/cards-generation",
  processedCards: "/processed-cards",
};

export const API = {
  STATISTICS: "/statistics",
  GENIUS_TOKEN: "/genius-token",

  ARTWORK_GENERATION: {
    ITUNES: PATHS.artworkGeneration + "/use-itunes-image",
    FILE_UPLOAD: PATHS.artworkGeneration + "/use-local-image",
    YOUTUBE_THUMBNAIL: PATHS.artworkGeneration + "/use-youtube-thumbnail",
  },

  PROCESSED_IMAGES: {
    PROCESS_IMAGES: PATHS.processedImages + "/process-images",
  },

  LYRICS: {
    GET_LYRICS: PATHS.lyrics + "/get-genius-lyrics",
  },

  CARDS_GENERATION: {
    SAVE_CARDS_CONTENTS: PATHS.cardsGeneration + "/save-contents",
    GENERATE_CARDS: PATHS.cardsGeneration + "/generate",
  },
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
  PRECONDITION_FAILED: 412,

  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVER_UNAVAILABLE: 503,
};

export const ITUNES_URL = "https://itunes.apple.com";
export const BACKEND_URL = "http://localhost:8000/api";