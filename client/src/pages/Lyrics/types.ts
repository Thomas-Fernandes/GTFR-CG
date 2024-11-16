import { NavigateFunction } from "react-router-dom";

import { ApiResponse, SongPartsCards, StateSetter } from "@/common/types";

export type PageMetadata = {
  artist: string;
  title: string;
  id: string;
  contributors: string[];
};
export type HandleLyricsSaveSubmitProps = {
  isSavingCardsContent: boolean;
  setIsSavingCardsContent: StateSetter<boolean>;
  pageMetadata: PageMetadata;
  isManual: boolean;
  lyricsParts: LyricsPartType[];
  dismissedParts: Set<number>;
  navigate: NavigateFunction;
};
export type LyricsPartProps = {
  part: LyricsPartType;
  idx: number;
};
export type LyricsPartType = {
  section: string;
  lyrics: string;
};

export type LyricsSaveRequest = {
  cardsContents: SongPartsCards;
};
export type LyricsSaveProps = {
  pageMetadata: PageMetadata;
  isManual: boolean;
  lyricsParts: LyricsPartType[];
  dismissedParts: Set<number>;
  navigate: NavigateFunction;
  setIsSavingCardsContent: StateSetter<boolean>;
};

export type HandleSetLyricsPartsProps = {
  lyricsParts: LyricsPartType[];
  setLyricsParts: StateSetter<LyricsPartType[]>;
};
export type LyricsResponse = ApiResponse & {
  data: {
    lyricsParts: LyricsPartType[];
  };
};
export type LyricsRequest = {
  artist: string;
  songName: string;
};
export type LyricsSearchProps = {
  setIsFetching: StateSetter<boolean>;
  setLyricsParts: StateSetter<LyricsPartType[]>;
  setPageMetadata: StateSetter<PageMetadata>;
};
export type HandleLyricsSearchSubmitProps = {
  isFetching: boolean;
  setIsFetching: StateSetter<boolean>;
  setLyricsParts: StateSetter<LyricsPartType[]>;
  setPageMetadata: StateSetter<PageMetadata>;
  setDismissedParts: StateSetter<Set<number>>;
};

export type LyricsPartsFormProps = {
  lyricsParts: LyricsPartType[];
};

export type LyricsContents = {
  pageMetadata: PageMetadata;
  lyricsParts: LyricsPartType[];
  dismissedParts: number[];
};
export type HandleLoadLastContentsProps = {
  lastContents: LyricsContents;
  setPageMetadata: StateSetter<PageMetadata>;
  setLyricsParts: StateSetter<LyricsPartType[]>;
  setDismissedParts: StateSetter<Set<number>>;
};