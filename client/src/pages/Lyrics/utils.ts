import { Dict, SongPartsCards, ValidationError, ValidationInconvenience, ValidationWarning } from "@/common/types";

import { CONSECUTIVE_LINES_THRESHOLD } from "./constants";
import { LyricsPartType, PageMetadata } from "./types";

export const validateSongParts = (songParts: SongPartsCards) => {
  const errors: ValidationInconvenience[] = [];

  songParts.forEach((sectionCards, sectionIdx) => {
    sectionCards.forEach((card, cardIdx) => {
      if (errors.length >= 6) return; // Only show the first 6 errors

      const lines = card.split("\n");
      const linesCount = lines.length;
      if (linesCount > CONSECUTIVE_LINES_THRESHOLD.ERROR) {
        errors.push({
          where: sectionIdx,
          what: ValidationError.VerticalOverflow,
          message: `Card ${cardIdx + 1} in section ${sectionIdx + 1} has more than 7 lines.`
        });
      } else if (linesCount > CONSECUTIVE_LINES_THRESHOLD.WARNING) {
        errors.push({
          where: sectionIdx,
          what: ValidationWarning.VerticalOverflow,
          message: `Card ${cardIdx + 1} in section ${sectionIdx + 1} has more than 5 lines.`
        });
      }
      if (lines.some(line => line.length > 50)) {
        errors.push({
          where: sectionIdx,
          what: ValidationError.HorizontalOverflow,
          message: `Card ${cardIdx + 1} in section ${sectionIdx + 1} has a line that is too long.`
        });
      }
    });
  });
  return errors;
};

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