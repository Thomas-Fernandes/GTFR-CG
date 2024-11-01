import { LyricsPart, SongPartsCards } from "@common/types";

export const convertToCardContents = (lyricsParts: LyricsPart[], dismissedParts: Set<number>): SongPartsCards => {
  // Input: [{section: "Verse 1", lyrics: "The whole lyrics\nOf the section\nAre here as is\nTotally disorganized"}, ...]
  // Output: [["The whole lyrics\nOf the section", "Are here as is\nTotally disorganized"], ...]
  //   -> Each inner array is a section, each string is a card
  return lyricsParts.filter((_, idx) => !dismissedParts.has(idx)).map(part => part.lyrics.trim().split("\n\n"));
};