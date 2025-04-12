import { ApiResponse, StateSetter } from "@/common/types";
import { LyricsPartType, PageMetadata } from "@/pages/Lyrics/types";

export interface LyricsResponse extends ApiResponse {
  data: {
    lyricsParts: LyricsPartType[];
  };
}

export interface LyricsSearchProps {
  setIsFetching: StateSetter<boolean>;
  setLyricsParts: StateSetter<LyricsPartType[]>;
  setPageMetadata: StateSetter<PageMetadata>;
}

export interface LyricsRequest {
  artist: string;
  songName: string;
}

export interface HandleLyricsSearchSubmitProps {
  isFetching: boolean;
  setIsFetching: StateSetter<boolean>;
  setLyricsParts: StateSetter<LyricsPartType[]>;
  setPageMetadata: StateSetter<PageMetadata>;
  setDismissedParts: StateSetter<Set<number>>;
}