import { StateSetter } from "@/common/types";
import { LyricsContents, LyricsPartType, PageMetadata } from "@/pages/Lyrics/types";

export interface LyricsPartProps {
  part: LyricsPartType;
  idx: number;
}

export interface HandleSetLyricsPartsProps {
  lyricsParts: LyricsPartType[];
  setLyricsParts: StateSetter<LyricsPartType[]>;
}

export interface HandleLoadLastContentsProps {
  lastContents: LyricsContents;
  setPageMetadata: StateSetter<PageMetadata>;
  setLyricsParts: StateSetter<LyricsPartType[]>;
  setDismissedParts: StateSetter<Set<number>>;
}
