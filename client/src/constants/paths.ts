export enum ViewPaths {
  Root = "/",
  Redirect = "/redirect",
  Home = "/home",
  Tests = "/tests",
  ArtworkGeneration = "/artwork-generation",
  ArtworkProcessing = "/artwork-processing",
  Lyrics = "/lyrics",
  CardsGeneration = "/cards-generation",
}

export const API = {
  STATISTICS: "/statistics",
  GENIUS_TOKEN: "/genius-token",

  ARTWORK_GENERATION: {
    ITUNES_SEARCH: ViewPaths.ArtworkGeneration + "/search-itunes",
    ITUNES: ViewPaths.ArtworkGeneration + "/use-itunes-image",
    FILE_UPLOAD: ViewPaths.ArtworkGeneration + "/use-local-image",
    YOUTUBE_THUMBNAIL: ViewPaths.ArtworkGeneration + "/use-youtube-thumbnail",
  },

  ARTWORK_PROCESSING: {
    PROCESS_ARTWORKS: ViewPaths.ArtworkProcessing + "/process-artworks",
  },

  LYRICS: {
    GET_LYRICS: ViewPaths.Lyrics + "/get-genius-lyrics",
  },

  CARDS_GENERATION: {
    SAVE_CARDS_CONTENTS: ViewPaths.CardsGeneration + "/save-cards-contents",
    GENERATE_CARDS: ViewPaths.CardsGeneration + "/generate",
    GENERATE_SINGLE_CARD: ViewPaths.CardsGeneration + "/generate-single",
  },
};

export const ITUNES_URL = "https://itunes.apple.com"; // TODO remove this when backend unit tests are implemented
export const BACKEND_URL = "http://localhost:8000/api";