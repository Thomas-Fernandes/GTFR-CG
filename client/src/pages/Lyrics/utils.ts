import { Dict, SongPartsCards, ValidationError, ValidationInconvenience, ValidationWarning } from "@/common/types";

import { CONTENT_THRESHOLDS } from "./constants";
import { LyricsPartType, PageMetadata } from "./types";

export const getLinePixelLength = (line: string) => {
  const span = document.createElement("span");
  span.style.font = "16px Arial";
  span.style.visibility = "hidden";
  span.textContent = line;
  document.body.appendChild(span);
  const width = span.offsetWidth;
  document.body.removeChild(span);
  return width;
};

export const validateSongParts = (songParts: SongPartsCards, lyricsParts: LyricsPartType[]) => {
  const errors: ValidationInconvenience[] = [];

  songParts.forEach((sectionCards, sectionIdx) => {
    const lyricsPartIdx = lyricsParts.findIndex(part => part.lyrics === sectionCards.join("\n"));

    sectionCards.forEach((card, cardIdx) => {
      if (errors.length >= CONTENT_THRESHOLDS.DISPLAY_LIMIT) return;

      const lines = card.split("\n");
      const linesCount = lines.length;
      if (linesCount > CONTENT_THRESHOLDS.LINES.ERROR) {
        errors.push({
          where: `lyrics-part_${lyricsPartIdx}`,
          what: ValidationError.VerticalOverflow,
          message: `Card ${cardIdx + 1} in section ${sectionIdx + 1} has more than ${CONTENT_THRESHOLDS.LINES.ERROR} lines.`
        });
      } else if (linesCount > CONTENT_THRESHOLDS.LINES.WARNING) {
        errors.push({
          where: `lyrics-part_${sectionIdx}`,
          what: ValidationWarning.VerticalOverflow,
          message: `Card ${cardIdx + 1} in section ${sectionIdx + 1} has more than ${CONTENT_THRESHOLDS.LINES.WARNING} lines.`
        });
      }

      const allTooLongLines = lines.filter(line => getLinePixelLength(line) > CONTENT_THRESHOLDS.LINE_PX_LENGTH.ERROR);
      allTooLongLines.forEach(line => {
        errors.push({
          where: `lyrics-part_${sectionIdx}`,
          what: ValidationError.HorizontalOverflow,
          message: `Card ${cardIdx + 1} in section ${sectionIdx + 1} has a very long line (${getLinePixelLength(line)}px).`
        });
      });
      const allLongLines = lines.filter(line => getLinePixelLength(line) > CONTENT_THRESHOLDS.LINE_PX_LENGTH.WARNING)
        .filter(line => !allTooLongLines.includes(line));
      allLongLines.forEach(line => {
        errors.push({
          where: `lyrics-part_${sectionIdx}`,
          what: ValidationWarning.HorizontalOverflow,
          message: `Card ${cardIdx + 1} in section ${sectionIdx + 1} has a long line (${getLinePixelLength(line)}px).`
        });
      });
    });
  });

  if (errors.length > CONTENT_THRESHOLDS.DISPLAY_LIMIT) {
    errors.splice(CONTENT_THRESHOLDS.DISPLAY_LIMIT); // Only show the first x errors
    errors.push({ where: "", what: ValidationError.More, message: "and more..." });
  }
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