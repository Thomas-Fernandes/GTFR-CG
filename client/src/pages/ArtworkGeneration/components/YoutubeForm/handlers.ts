import { FormEvent } from "react";

import { sendToast } from "@/common/Toast";
import { ToastType } from "@/constants/toasts";
import { HandleSubmitArtworkGenerationProps } from "@/pages/ArtworkGeneration/types";

import { getToasts } from "@/contexts";
import { postYoutubeUrl } from "./requests";
import { YoutubeRequest } from "./types";
import { isValidYoutubeUrl } from "./utils";

export const handleSubmitYoutubeUrl = (
  e: FormEvent<HTMLFormElement>,
  body: YoutubeRequest,
  props: HandleSubmitArtworkGenerationProps
) => {
  const toasts = getToasts();

  const { isProcessingLoading, setIsProcessingLoading, navigate } = props;

  e.preventDefault();

  if (isProcessingLoading) {
    sendToast(toasts.ProcessingInProgress, ToastType.Warn);
    return;
  }

  if (!isValidYoutubeUrl(body.url)) {
    sendToast(toasts.InvalidUrl, ToastType.Error);
    return;
  }

  postYoutubeUrl(body, { setIsProcessingLoading, navigate });
};
