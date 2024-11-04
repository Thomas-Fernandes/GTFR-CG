import { NavigateFunction } from "react-router-dom";

import { createNewContext } from "@common/contextCreator";
import { StateSetter } from "@common/types";

import { LyricsPartType, PageMetadata } from "./types";

interface LyricsContextType {
  isFetching: boolean;
  setIsFetching: StateSetter<boolean>;
  artist: string;
  setArtist: StateSetter<string>;
  songName: string;
  setSongName: StateSetter<string>;
  pageMetadata: PageMetadata;
  setPageMetadata: StateSetter<PageMetadata>;
  lyricsParts: LyricsPartType[];
  setLyricsParts: StateSetter<LyricsPartType[]>;
  dismissedParts: Set<number>;
  setDismissedParts: StateSetter<Set<number>>;
  isManual: boolean;
  setIsManual: StateSetter<boolean>;
  navigate: NavigateFunction;
}
const {
  context: LyricsContext,
  useContext: useLyricsContext
} = createNewContext<LyricsContextType>();

export { LyricsContext, useLyricsContext };

