import { FormEvent } from "react";

import { sendToast } from "@/common/Toast";
import { Toast, ToastType } from "@/constants/toasts";
import { HandleSubmitArtworkGenerationProps } from "@/pages/ArtworkGeneration/types";

import { postYoutubeUrl } from "./requests";
import { YoutubeRequest } from "./types";
import { isValidYoutubeUrl } from "./utils";

export const handleSubmitYoutubeUrl = (
  e: FormEvent<HTMLFormElement>, body: YoutubeRequest,
  props: HandleSubmitArtworkGenerationProps
) => {
  const { isProcessingLoading, setIsProcessingLoading, navigate } = props;

  e.preventDefault();

  if (isProcessingLoading) {
    sendToast(Toast.ProcessingInProgress, ToastType.Warn);
    return;
  }

  if (!isValidYoutubeUrl(body.url)) {
    sendToast(Toast.InvalidUrl, ToastType.Error);
    return;
  }

  postYoutubeUrl(body, {setIsProcessingLoading, navigate});
};