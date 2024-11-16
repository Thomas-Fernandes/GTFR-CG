import { Dict, SongPartsCards } from "@/common/types";

import { LyricsPartType, PageMetadata } from "./types";

export const strArrToMetadata = (metadata: string[]): PageMetadata => {
  return metadata.reduce((acc: PageMetadata, curr) => {
    const [key, value] = curr.split(": ");
    (acc as Dict)[key] = value;
    return acc;
  }, {} as PageMetadata);
};

export const convertToCardContents = (lyricsParts: LyricsPartType[], dismissedParts: Set<number>): SongPartsCards => {
  // Input: [{section: "Verse 1", lyrics: "The whole lyrics\nOf the section\nAre here as is\nTotally disorganized"}, ...]
  // Output: [["The whole lyrics\nOf the section", "Are here as is\nTotally disorganized"], ...]
  //   -> Each inner array is a section, each string is a card
  return lyricsParts.filter((_, idx) => !dismissedParts.has(idx)).map(part => part.lyrics.trim().split("\n\n"));
};