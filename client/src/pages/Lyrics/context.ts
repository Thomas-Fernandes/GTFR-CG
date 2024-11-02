import { NavigateFunction } from "react-router-dom";

import { createNewContext } from "@common/contextProvider";
import { LyricsPartType, PageMetadata, StateSetter } from "@common/types";

export interface LyricsContextType {
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

const { context: LyricsContext, useContext: useLyricsContext } = createNewContext<LyricsContextType>();

export { LyricsContext, useLyricsContext };

