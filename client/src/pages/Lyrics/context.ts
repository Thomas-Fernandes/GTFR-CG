import { createNewContext } from "@common/ContextProvider";
import { LyricsPart, StateSetter } from "@common/Types";

export interface LyricsContextType {
  lyricsParts: LyricsPart[];
  setLyricsParts: StateSetter<LyricsPart[]>;
  dismissedParts: Set<number>;
  setDismissedParts: StateSetter<Set<number>>;
}

const { context: LyricsContext, useContext: useLyricsContext } = createNewContext<LyricsContextType>();

export { LyricsContext, useLyricsContext };

