import { sendToast } from "@/common/Toast";
import { ToastType } from "@/constants/toasts";
import { getToasts } from "@/contexts";
import { HandleSubmitArtworkGenerationProps } from "@/pages/ArtworkGeneration/types";

import { postItunesResult } from "./requests";
import { ItunesResult } from "./types";

export const handleSelectItunesImage = (item: ItunesResult, key: number, props: HandleSubmitArtworkGenerationProps) => {
  const toasts = getToasts();

  const { isProcessingLoading, setIsProcessingLoading, navigate } = props;

  if (isProcessingLoading) {
    sendToast(toasts.ProcessingInProgress, ToastType.Warn);
    return;
  }

  const body = {
    url: item.artworkUrl100,
  };

  postItunesResult(body, key, { setIsProcessingLoading, navigate });
};
