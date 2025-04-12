export interface PageMetadata {
  artist: string;
  title: string;
  id: string;
  contributors: string[];
}
export interface LyricsPartType {
  section: string;
  lyrics: string;
}

export interface LyricsContents {
  pageMetadata: PageMetadata;
  lyricsParts: LyricsPartType[];
  dismissedParts: number[];
}