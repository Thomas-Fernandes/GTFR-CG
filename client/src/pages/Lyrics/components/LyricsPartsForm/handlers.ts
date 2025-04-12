import { FormEvent } from "react";

import { sendToast } from "@/common/Toast";
import { SongPartsCards } from "@/common/types";
import { ToastType } from "@/constants/toasts";
import { getToasts } from "@/contexts";

import { METADATA_IDENTIFIER, METADATA_SEPARATOR } from "./constants";
import { postLyricsSave } from "./requests";
import {
  HandleLyricsSaveSubmitProps,
  LyricsSaveRequest
} from "./types";
import { validateSongParts } from "./utils";

export const handleLyricsSaveSubmit = (
  e: FormEvent<HTMLFormElement>, body: SongPartsCards,
  props: HandleLyricsSaveSubmitProps
) => {
  const toasts = getToasts();
  const {
    isSavingCardsContent,
    setIsSavingCardsContent,
    pageMetadata,
    isManual,
    lyricsParts,
    dismissedParts,
    navigate
  } = props;

  e.preventDefault();

  if (isSavingCardsContent) {
    sendToast(toasts.ProcessingInProgress, ToastType.Warn);
    return;
  }

  const errors = validateSongParts(body, lyricsParts);
  const onlyWarnings = !errors.some(e => e.what?.startsWith("Err"));

  if (errors.length > 0 && !onlyWarnings) {
    // If there are errors, show everything; if there are only warnings, proceed
    errors.forEach(e => {
      const toastType = e.what.startsWith("Err") ? ToastType.Error : ToastType.Warn;
      if (e.message)
        sendToast(e.message, toastType, 10);
    });
    const firstInconvenienceLocation = document.getElementById(errors[0].where);
    if (firstInconvenienceLocation)
      firstInconvenienceLocation.scrollIntoView({ behavior: "smooth" });
    return; // cancel saving
  }

  const metadata = METADATA_IDENTIFIER + Object.entries(pageMetadata).map(
    ([key, value]) => `${key}: ${value}`
  ).join(METADATA_SEPARATOR);

  const data: LyricsSaveRequest = {
    cardsContents: [[metadata]].concat(body),
  };

  postLyricsSave(data, { pageMetadata, isManual, lyricsParts, dismissedParts, navigate, setIsSavingCardsContent });
};