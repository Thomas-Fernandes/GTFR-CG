import { NavigateFunction } from "react-router-dom";

import { SongPartsCards, StateSetter } from "@/common/types";
import { LyricsPartType, PageMetadata } from "@/pages/Lyrics/types";

export type LyricsPartsFormProps = Readonly<{
  lyricsParts: LyricsPartType[];
}>;

export type LyricsSaveRequest = Readonly<{
  cardsContents: SongPartsCards;
}>;
export type LyricsSaveProps = Readonly<{
  pageMetadata: PageMetadata;
  isManual: boolean;
  lyricsParts: LyricsPartType[];
  dismissedParts: Set<number>;
  navigate: NavigateFunction;
  setIsSavingCardsContent: StateSetter<boolean>;
}>;
export type HandleLyricsSaveSubmitProps = Readonly<{
  isSavingCardsContent: boolean;
  setIsSavingCardsContent: StateSetter<boolean>;
  pageMetadata: PageMetadata;
  isManual: boolean;
  lyricsParts: LyricsPartType[];
  dismissedParts: Set<number>;
  navigate: NavigateFunction;
}>;