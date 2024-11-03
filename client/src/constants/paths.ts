export enum VIEW_PATHS {
  ROOT = "/",
  REDIRECT = "/redirect",
  HOME = "/home",
  TESTS = "/tests",
  ARTWORK_GENERATION = "/artwork-generation",
  ARTWORK_PROCESSING = "/artwork-processing",
  LYRICS = "/lyrics",
  CARDS_GENERATION = "/cards-generation",
}

export const API = {
  STATISTICS: "/statistics",
  GENIUS_TOKEN: "/genius-token",

  ARTWORK_GENERATION: {
    ITUNES_SEARCH: VIEW_PATHS.ARTWORK_GENERATION + "/search-itunes",
    ITUNES: VIEW_PATHS.ARTWORK_GENERATION + "/use-itunes-image",
    FILE_UPLOAD: VIEW_PATHS.ARTWORK_GENERATION + "/use-local-image",
    YOUTUBE_THUMBNAIL: VIEW_PATHS.ARTWORK_GENERATION + "/use-youtube-thumbnail",
  },

  ARTWORK_PROCESSING: {
    PROCESS_ARTWORKS: VIEW_PATHS.ARTWORK_PROCESSING + "/process-artworks",
  },

  LYRICS: {
    GET_LYRICS: VIEW_PATHS.LYRICS + "/get-genius-lyrics",
  },

  CARDS_GENERATION: {
    SAVE_CARDS_CONTENTS: VIEW_PATHS.CARDS_GENERATION + "/save-cards-contents",
    GENERATE_CARDS: VIEW_PATHS.CARDS_GENERATION + "/generate",
    GENERATE_SINGLE_CARD: VIEW_PATHS.CARDS_GENERATION + "/generate-single",
  },
};

export const ITUNES_URL = "https://itunes.apple.com"; // TODO remove this when backend unit tests are implemented
export const BACKEND_URL = "http://localhost:8000/api";