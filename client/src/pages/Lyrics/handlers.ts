import { FormEvent } from "react";
import { NavigateFunction } from "react-router-dom";

import { sendToast } from "@common/toast";
import { StateSetter } from "@common/types";

import { TOAST, TOAST_TYPE } from "@constants/toasts";

import { SongPartsCards } from "@pages/CardsGeneration/types";

import { postLyricsSave, postLyricsSearch } from "./requests";
import { LyricsContents, LyricsPartType, LyricsRequest, PageMetadata } from "./types";

type HandleLyricsSaveSubmitProps = {
  isSavingCardsContent: boolean;
  setIsSavingCardsContent: StateSetter<boolean>;
  pageMetadata: PageMetadata;
  isManual: boolean;
  lyricsParts: LyricsPartType[];
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
  lyricsParts: LyricsPartType[];
  setLyricsParts: StateSetter<LyricsPartType[]>;
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
  setLyricsParts: StateSetter<LyricsPartType[]>;
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
  setLyricsParts: StateSetter<LyricsPartType[]>;
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
