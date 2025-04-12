export type PageMetadata = Readonly<{
  artist: string;
  title: string;
  id: string;
  contributors: string[];
}>;
export type LyricsPartType = {
  section: string;
  lyrics: string;
};

export type LyricsContents = Readonly<{
  pageMetadata: PageMetadata;
  lyricsParts: LyricsPartType[];
  dismissedParts: number[];
}>;