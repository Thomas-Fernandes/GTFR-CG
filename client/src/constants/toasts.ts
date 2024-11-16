import { ResponseStatus } from "./requests";

export enum Toast {
  UnknownError = "An unknown error occurred.\n"
    + "Please try again later or open an issue.",
  ServerUnavailable = "Server unavailable.\n"
    + "Please check that the Python server is running.",
  NoSpinnerId = "HTML Spinner id is required.",
  NoSpinnerContainer = "Spinner container not found.",
  ProcessingInProgress = "Processing already in progress.",
  NoLatestColor = "No latest color found.",

  // Redirect
    NoProcessedImage = "No processed image found.",
    NoGeniusToken = "Genius API token not found.",
    NoCardsContents = "No cards contents found.\n"
      + "Please generate contents via the Lyrics page first.",

  // Home
    Welcome = "Welcome to GTFR-CG!\n"
      + "Application started successfully.",
    GeniusTokenNotFound = "Genius API token not found.\n"
      + "Lyrics fetch is disabled.",
    AddGeniusToken = "Add your Genius API token to your\n"
      + ".env file and restart the application\n"
      + "to enable lyrics fetch.",

    // Artwork Generation
    NoResultsFound = "No results found.",
    NoImgFile = "Please select an image file.",
    InvalidFileType = "Please select a valid image file.",
    InvalidUrl = "Please enter a valid URL.",

    // Processed Images
    NoImgSelection = "Please select an image to download.",

    // Lyrics
    MissingFields = "Please fill out all the required fields.",
    FetchInProgress = "Lyrics fetch already in progress.",
    LyricsNotFound = "Lyrics not found.",
    SavingInProgress = "Lyrics saving already in progress.",
    NoLastGeneration = "No last generation found.",

    // Cards Generation
    NoGeneratedCards = "No cards were generated.",
    UnauthorizedOutro = "The outro card cannot be generated\n"
      + "since the card creation was manual.",
    CardsGenerated = "Cards generated successfully.",
    CardNotEditable = "The contents of this card cannot be edited.",
    CardEditInProgress = "Card edit already in progress.",
    CardEditFailed = "Failed to edit card.",
    CardEdited = "Card edited successfully",
}

export const ToastType = ResponseStatus;

export const DEFAULT_EVENT_DURATION = {
  SECONDS_TOAST: 5,
  MS_FADE_OUT: 500,
  MS_VERTICAL_SLIDE: 200,
  MS_PROGRESS_UPDATE: 10,
};
