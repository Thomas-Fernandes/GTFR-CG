import { ComponentPropsWithoutRef } from "react";
import { NavigateFunction } from "react-router-dom";

import { ApiResponse, SongPartsCards, StateSetter } from "@/common/types";

export type PageMetadata = Readonly<{
  artist: string;
  title: string;
  id: string;
  contributors: string[];
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
export type LyricsPartProps = Readonly<{
  part: LyricsPartType;
  idx: number;
}>;
export type LyricsPartType = {
  section: string;
  lyrics: string;
};

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

export type GenerationModeFlipperProps = ComponentPropsWithoutRef<"button"> & Readonly<{
  className?: string;
}>;

export type HandleSetLyricsPartsProps = Readonly<{
  lyricsParts: LyricsPartType[];
  setLyricsParts: StateSetter<LyricsPartType[]>;
}>;
export type LyricsResponse = ApiResponse & Readonly<{
  data: {
    lyricsParts: LyricsPartType[];
  };
}>;
export type LyricsRequest = Readonly<{
  artist: string;
  songName: string;
}>;
export type LyricsSearchProps = Readonly<{
  setIsFetching: StateSetter<boolean>;
  setLyricsParts: StateSetter<LyricsPartType[]>;
  setPageMetadata: StateSetter<PageMetadata>;
}>;
export type HandleLyricsSearchSubmitProps = Readonly<{
  isFetching: boolean;
  setIsFetching: StateSetter<boolean>;
  setLyricsParts: StateSetter<LyricsPartType[]>;
  setPageMetadata: StateSetter<PageMetadata>;
  setDismissedParts: StateSetter<Set<number>>;
}>;

export type LyricsPartsFormProps = Readonly<{
  lyricsParts: LyricsPartType[];
}>;

export type LyricsContents = Readonly<{
  pageMetadata: PageMetadata;
  lyricsParts: LyricsPartType[];
  dismissedParts: number[];
}>;
export type HandleLoadLastContentsProps = Readonly<{
  lastContents: LyricsContents;
  setPageMetadata: StateSetter<PageMetadata>;
  setLyricsParts: StateSetter<LyricsPartType[]>;
  setDismissedParts: StateSetter<Set<number>>;
}>;