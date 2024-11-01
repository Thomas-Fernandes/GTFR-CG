export const PROCESSED_IMAGES_PATH = "./processed-images";
export const COVER_ART_FILENAME = "ProcessedArtwork.png";
export const OUTRO_FILENAME = "outro.png";
export const PROCESSED_CARDS_PATH = "./processed-cards";

export const VIEW_PATHS = {
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
    ITUNES_SEARCH: VIEW_PATHS.artworkGeneration + "/search-itunes",
    ITUNES: VIEW_PATHS.artworkGeneration + "/use-itunes-image",
    FILE_UPLOAD: VIEW_PATHS.artworkGeneration + "/use-local-image",
    YOUTUBE_THUMBNAIL: VIEW_PATHS.artworkGeneration + "/use-youtube-thumbnail",
  },

  PROCESSED_IMAGES: {
    PROCESS_IMAGES: VIEW_PATHS.processedImages + "/process-images",
  },

  LYRICS: {
    GET_LYRICS: VIEW_PATHS.lyrics + "/get-genius-lyrics",
  },

  CARDS_GENERATION: {
    SAVE_CARDS_CONTENTS: VIEW_PATHS.cardsGeneration + "/save-cards-contents",
    GENERATE_CARDS: VIEW_PATHS.cardsGeneration + "/generate",
    GENERATE_SINGLE_CARD: VIEW_PATHS.cardsGeneration + "/generate-single",
  },
};

export const ITUNES_URL = "https://itunes.apple.com"; // TODO remove this and Tests.tsx when backend unit tests are implemented
export const BACKEND_URL = "http://localhost:8000/api";