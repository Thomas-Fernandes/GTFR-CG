import { Statistics } from "./types";

export const defaultStatistics = {
  dateFirstOperation: "N/A",
  dateLastOperation: "N/A",
  artworkGenerations: "0",
  lyricsFetches: "0",
  cardsGenerated: "0",
} satisfies Statistics;

export enum StatName {
  DateFirstOperation = "Date of First Operation",
  DateLastOperation = "Date of Last Operation",
  ArtworkGenerations = "Artwork Generations",
  LyricsFetches = "Genius Lyrics Fetches",
  CardsGenerated = "Cards Generated",
}