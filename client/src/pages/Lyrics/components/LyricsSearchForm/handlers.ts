import { FormEvent } from "react";

import { sendToast } from "@/common/Toast";
import { ToastType } from "@/constants/toasts";
import { getToasts } from "@/contexts";

import { postLyricsSearch } from "./requests";
import { HandleLyricsSearchSubmitProps, LyricsRequest } from "./types";

export const handleLyricsSearchSubmit = (
  e: FormEvent<HTMLFormElement>,
  body: LyricsRequest,
  props: HandleLyricsSearchSubmitProps
) => {
  const toasts = getToasts();
  const { isFetching, setIsFetching, setLyricsParts, setPageMetadata, setDismissedParts } = props;

  e.preventDefault();

  if (isFetching) {
    sendToast(toasts.Lyrics.FetchInProgress, ToastType.Warn);
    return;
  }

  if (body.artist.trim() === "" || body.songName.trim() === "") {
    sendToast(toasts.Lyrics.MissingFields, ToastType.Warn);
    return;
  }

  setDismissedParts(new Set<number>());
  postLyricsSearch(body, { setIsFetching, setLyricsParts, setPageMetadata });
};
