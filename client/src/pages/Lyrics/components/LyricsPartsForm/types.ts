import { NavigateFunction } from "react-router-dom";

import { SongPartsCards, StateSetter } from "@/common/types";
import { LyricsPartType, PageMetadata } from "@/pages/Lyrics/types";

export interface LyricsPartsFormProps {
  lyricsParts: LyricsPartType[];
}

export interface LyricsSaveRequest {
  cardsContents: SongPartsCards;
}
export interface LyricsSaveProps {
  pageMetadata: PageMetadata;
  isManual: boolean;
  lyricsParts: LyricsPartType[];
  dismissedParts: Set<number>;
  navigate: NavigateFunction;
  setIsSavingCardsContent: StateSetter<boolean>;
}
export interface HandleLyricsSaveSubmitProps {
  isSavingCardsContent: boolean;
  setIsSavingCardsContent: StateSetter<boolean>;
  pageMetadata: PageMetadata;
  isManual: boolean;
  lyricsParts: LyricsPartType[];
  dismissedParts: Set<number>;
  navigate: NavigateFunction;
}