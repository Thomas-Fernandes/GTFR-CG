import { sendToast } from "@/common/Toast";
import { StateSetter } from "@/common/types";
import { ToastType } from "@/constants/toasts";
import { getToasts } from "@/contexts";

import { HandleLoadLastContentsProps, HandleSetLyricsPartsProps } from "./types";

export const handleRestorePart = (
  dismissedParts: Set<number>,
  idx: number,
  setDismissedParts: StateSetter<Set<number>>
) => {
  const n = new Set(dismissedParts);
  n.delete(idx);
  setDismissedParts(n);
};

export const handleSetDismissedParts = (
  dismissedParts: Set<number>,
  idx: number,
  setDismissedParts: StateSetter<Set<number>>
) => {
  const n = new Set(dismissedParts);
  n.add(idx);
  setDismissedParts(n);
};

export const handleSetLyricsParts = (lyrics: string, idx: number, props: HandleSetLyricsPartsProps) => {
  const { lyricsParts, setLyricsParts } = props;

  const updatedLyricsParts = [...lyricsParts];
  updatedLyricsParts[idx].lyrics = lyrics;

  setLyricsParts(updatedLyricsParts);
};

export const handleLoadLastContents = (props: HandleLoadLastContentsProps) => {
  const toasts = getToasts();
  const { lastContents, setPageMetadata, setLyricsParts, setDismissedParts } = props;

  if (lastContents?.pageMetadata?.id === undefined) {
    sendToast(toasts.Lyrics.NoLastGeneration, ToastType.Warn);
    return;
  }
  setPageMetadata(lastContents.pageMetadata);
  setLyricsParts(lastContents.lyricsParts);
  setDismissedParts(new Set(lastContents.dismissedParts));
};
