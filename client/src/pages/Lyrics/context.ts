import { createNewContext } from "@common/contextProvider";
import { LyricsPart, StateSetter } from "@common/types";

export interface LyricsContextType {
  lyricsParts: LyricsPart[];
  setLyricsParts: StateSetter<LyricsPart[]>;
  dismissedParts: Set<number>;
  setDismissedParts: StateSetter<Set<number>>;
}

const { context: LyricsContext, useContext: useLyricsContext } = createNewContext<LyricsContextType>();

export { LyricsContext, useLyricsContext };

