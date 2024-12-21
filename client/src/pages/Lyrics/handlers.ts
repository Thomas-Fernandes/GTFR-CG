import { FormEvent } from "react";

import { sendToast } from "@/common/Toast";
import { SongPartsCards, StateSetter } from "@/common/types";
import { Toast, ToastType } from "@/constants/toasts";

import { METADATA_IDENTIFIER, METADATA_SEPARATOR } from "./constants";
import { postLyricsSave, postLyricsSearch } from "./requests";
import { HandleLoadLastContentsProps, HandleLyricsSaveSubmitProps, HandleLyricsSearchSubmitProps, HandleSetLyricsPartsProps, LyricsRequest, LyricsSaveRequest } from "./types";

export const handleLyricsSaveSubmit = (
  e: FormEvent<HTMLFormElement>, body: SongPartsCards,
  props: HandleLyricsSaveSubmitProps
) => {
  const { isSavingCardsContent, setIsSavingCardsContent, pageMetadata, isManual, lyricsParts, dismissedParts, navigate } = props;

  e.preventDefault();

  if (isSavingCardsContent) {
    sendToast(Toast.ProcessingInProgress, ToastType.Warn);
    return;
  }

  const metadata = METADATA_IDENTIFIER + Object.entries(pageMetadata).map(([key, value]) => `${key}: ${value}`).join(METADATA_SEPARATOR);
  const data: LyricsSaveRequest = {
    cardsContents: [[metadata]].concat(body),
  };

  postLyricsSave(data, { pageMetadata, isManual, lyricsParts, dismissedParts, navigate, setIsSavingCardsContent });
};

export const handleRestorePart = (dismissedParts: Set<number>, idx: number, setDismissedParts: StateSetter<Set<number>>) => {
  const n = new Set(dismissedParts);
  n.delete(idx);
  setDismissedParts(n);
};

export const handleSetDismissedParts = (dismissedParts: Set<number>, idx: number, setDismissedParts: StateSetter<Set<number>>) => {
  const n = new Set(dismissedParts);
  n.add(idx);
  setDismissedParts(n);
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

export const handleLyricsSearchSubmit = (
  e: FormEvent<HTMLFormElement>, body: LyricsRequest,
  props: HandleLyricsSearchSubmitProps
) => {
  const { isFetching, setIsFetching, setLyricsParts, setPageMetadata, setDismissedParts } = props;

  e.preventDefault();

  if (isFetching) {
    sendToast(Toast.FetchInProgress, ToastType.Warn);
    return;
  }

  if (body.artist.trim() === "" || body.songName.trim() === "") {
    sendToast(Toast.MissingFields, ToastType.Warn);
    return;
  }

  setDismissedParts(new Set<number>());
  postLyricsSearch(body, { setIsFetching, setLyricsParts, setPageMetadata });
};

export const handleLoadLastContents = (
  props: HandleLoadLastContentsProps
) => {
  const { lastContents, setPageMetadata, setLyricsParts, setDismissedParts } = props;

  if (lastContents?.pageMetadata?.id === undefined) {
    sendToast(Toast.NoLastGeneration, ToastType.Warn);
    return;
  }
  setPageMetadata(lastContents.pageMetadata);
  setLyricsParts(lastContents.lyricsParts);
  setDismissedParts(new Set(lastContents.dismissedParts));
};
