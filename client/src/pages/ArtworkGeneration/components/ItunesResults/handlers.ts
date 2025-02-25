import { sendToast } from "@/common/Toast";
import { Toast, ToastType } from "@/constants/toasts";
import { HandleSubmitArtworkGenerationProps } from "@/pages/ArtworkGeneration/types";

import { postItunesResult } from "./requests";
import { ItunesResult } from "./types";

export const handleSelectItunesImage = (
  item: ItunesResult, key: number,
  props: HandleSubmitArtworkGenerationProps
) => {
  const { isProcessingLoading, setIsProcessingLoading, navigate } = props;

  if (isProcessingLoading) {
    sendToast(Toast.ProcessingInProgress, ToastType.Warn);
    return;
  }

  const body = {
    url: item.artworkUrl100,
  };

  postItunesResult(body, key, {setIsProcessingLoading, navigate});
};