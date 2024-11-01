import { RESPONSE_STATUS } from "./requests";

export const TOAST: Record<string, string> = {
  DEFAULT: "An unknown error occurred.\n"
    + "Please try again later or open an issue.",
  SERVER_UNAVAILABLE: "Server unavailable.\n"
    + "Please check that the Python server is running.",
  NO_SPINNER_ID: "HTML Spinner id is required.",
  NO_SPINNER_CONTAINER: "Spinner container not found.",
  PROCESSING_IN_PROGRESS: "Processing already in progress.",
  NO_LATEST_COLOR: "No latest color found.",

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
    NO_LAST_GENERATION: "No last generation found.",

  // Cards Generation
    NO_CARDS: "No cards were generated.",
    UNAUTHORIZED_OUTRO: "The outro card cannot be generated\n"
      + "since the card creation was manual.",
    CARDS_GENERATED: "Cards generated successfully.",
    CARD_NOT_EDITABLE: "The contents of this card cannot be edited.",
    CARD_EDIT_IN_PROGRESS: "Card edit already in progress.",
    CARD_EDIT_FAILED: "Failed to edit card.",
    CARD_EDITED: "Card edited successfully", // no full stop on purpose
};

export const TOAST_TYPE = RESPONSE_STATUS;

export const DEFAULT_EVENT_DURATION = {
  SECONDS_TOAST: 5,
  MS_FADE_OUT: 500,
  MS_VERTICAL_SLIDE: 200,
  MS_PROGRESS_UPDATE: 10,
};
