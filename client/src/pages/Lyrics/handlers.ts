import { FormEvent } from "react";
import { NavigateFunction } from "react-router-dom";

import { sendToast } from "../../common/Toast";
import { LyricsContents, LyricsPart, LyricsRequest, PageMetadata, SongPartsCards, StateSetter } from "../../common/Types";

import { TOAST, TOAST_TYPE } from "../../constants/Toast";
import { postLyricsSave, postLyricsSearch } from "./requests";

type HandleLyricsSaveSubmitProps = {
  isSavingCardsContent: boolean;
  setIsSavingCardsContent: StateSetter<boolean>;
  pageMetadata: PageMetadata;
  isManual: boolean;
  lyricsParts: LyricsPart[];
  dismissedParts: Set<number>;
  navigate: NavigateFunction;
};
export const handleLyricsSaveSubmit = (
  e: FormEvent<HTMLFormElement>, body: SongPartsCards,
  props: HandleLyricsSaveSubmitProps
) => {
  const { isSavingCardsContent, setIsSavingCardsContent, pageMetadata, isManual, lyricsParts, dismissedParts, navigate } = props;

  e.preventDefault();

  if (isSavingCardsContent) {
    sendToast(TOAST.PROCESSING_IN_PROGRESS, TOAST_TYPE.WARN);
    return;
  }

  const metadata = "Metadata | " + Object.entries(pageMetadata).map(([key, value]) => `${key}: ${value}`).join(" ;;; ");
  const data = {
    cardsContents: [[metadata]].concat(body),
  };

  postLyricsSave(data, { pageMetadata, isManual, lyricsParts, dismissedParts, navigate, setIsSavingCardsContent });
};

export type HandleSetLyricsPartsProps = {
  lyricsParts: LyricsPart[];
  setLyricsParts: StateSetter<LyricsPart[]>;
};
export const handleSetLyricsParts = (
  lyrics: string, idx: number,
  props: HandleSetLyricsPartsProps
) => {
  const { lyricsParts, setLyricsParts } = props;
  const updatedLyricsParts = [...lyricsParts];
  updatedLyricsParts[idx].lyrics = lyrics;
  setLyricsParts(updatedLyricsParts);
};

type HandleLyricsSearchSubmitProps = {
  isFetching: boolean;
  setIsFetching: StateSetter<boolean>;
  setLyricsParts: StateSetter<LyricsPart[]>;
  setPageMetadata: StateSetter<PageMetadata>;
};
export const handleLyricsSearchSubmit = (
  e: FormEvent<HTMLFormElement>, body: LyricsRequest,
  props: HandleLyricsSearchSubmitProps
) => {
  const { isFetching, setIsFetching, setLyricsParts, setPageMetadata } = props;

  e.preventDefault();

  if (isFetching) {
    sendToast(TOAST.FETCH_IN_PROGRESS, TOAST_TYPE.WARN);
    return;
  }

  if (body.artist.trim() === "" || body.songName.trim() === "") {
    sendToast(TOAST.MISSING_FIELDS, TOAST_TYPE.WARN);
    return;
  }

  postLyricsSearch(body, { setIsFetching, setLyricsParts, setPageMetadata });
};

type HandleLoadLastContentsProps = {
  lastContents: LyricsContents;
  setPageMetadata: StateSetter<PageMetadata>;
  setLyricsParts: StateSetter<LyricsPart[]>;
  setDismissedParts: StateSetter<Set<number>>;
};
export const handleLoadLastContents = (
  props: HandleLoadLastContentsProps
) => {
  const { lastContents, setPageMetadata, setLyricsParts, setDismissedParts } = props;

  if (lastContents?.pageMetadata?.id === undefined) {
    sendToast(TOAST.NO_LAST_GENERATION, TOAST_TYPE.WARN);
    return;
  }
  setPageMetadata(lastContents.pageMetadata);
  setLyricsParts(lastContents.lyricsParts);
  setDismissedParts(new Set(lastContents.dismissedParts));
};
