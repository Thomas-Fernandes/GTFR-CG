import { StateSetter } from "@/common/types";
import { LyricsContents, LyricsPartType, PageMetadata } from "@/pages/Lyrics/types";

export type LyricsPartProps = Readonly<{
  part: LyricsPartType;
  idx: number;
}>;

export type HandleSetLyricsPartsProps = Readonly<{
  lyricsParts: LyricsPartType[];
  setLyricsParts: StateSetter<LyricsPartType[]>;
}>;

export type HandleLoadLastContentsProps = Readonly<{
  lastContents: LyricsContents;
  setPageMetadata: StateSetter<PageMetadata>;
  setLyricsParts: StateSetter<LyricsPartType[]>;
  setDismissedParts: StateSetter<Set<number>>;
}>;