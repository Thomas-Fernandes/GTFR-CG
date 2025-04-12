import { Statistics } from "./types";

export const defaultStatistics = {
  dateFirstOperation: "N/A",
  dateLastOperation: "N/A",
  artworkGenerations: "-1",
  lyricsFetches: "-1",
  cardsGenerated: "-1",
} satisfies Statistics;

export enum StatName {
  DateFirstOperation = "Date of First Operation",
  DateLastOperation = "Date of Last Operation",
  ArtworkGenerations = "Artwork Generations",
  LyricsFetches = "Genius Lyrics Fetches",
  CardsGenerated = "Cards Generated",
}
