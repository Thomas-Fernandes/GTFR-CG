import { ApiResponse, StateSetter } from "@/common/types";
import { LyricsPartType, PageMetadata } from "@/pages/Lyrics/types";

export type LyricsResponse = ApiResponse & Readonly<{
  data: {
    lyricsParts: LyricsPartType[];
  };
}>;

export type LyricsSearchProps = Readonly<{
  setIsFetching: StateSetter<boolean>;
  setLyricsParts: StateSetter<LyricsPartType[]>;
  setPageMetadata: StateSetter<PageMetadata>;
}>;

export type LyricsRequest = Readonly<{
  artist: string;
  songName: string;
}>;

export type HandleLyricsSearchSubmitProps = Readonly<{
  isFetching: boolean;
  setIsFetching: StateSetter<boolean>;
  setLyricsParts: StateSetter<LyricsPartType[]>;
  setPageMetadata: StateSetter<PageMetadata>;
  setDismissedParts: StateSetter<Set<number>>;
}>;