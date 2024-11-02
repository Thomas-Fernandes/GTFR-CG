import { ApiResponse } from "@common/types";

export type LyricsContents = {
  pageMetadata: PageMetadata;
  lyricsParts: LyricsPartType[];
  dismissedParts: number[];
};

export type PageMetadata = {
  artist: string;
  title: string;
  id: string;
  contributors: string[];
};
export type LyricsPartType = {
  section: string;
  lyrics: string;
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