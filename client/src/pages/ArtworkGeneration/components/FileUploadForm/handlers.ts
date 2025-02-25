import { FormEvent } from "react";

import { sendToast } from "@/common/Toast";
import { isFileExtensionAccepted } from "@/common/utils/fileUtils";
import { ACCEPTED_IMG_EXTENSIONS } from "@/constants/files";
import { Toast, ToastType } from "@/constants/toasts";
import { HandleSubmitArtworkGenerationProps } from "@/pages/ArtworkGeneration/types";

import { postFileUpload } from "./requests";
import { FileUploadRequest } from "./types";

export const handleSubmitFileUpload = (
  e: FormEvent<HTMLFormElement>, body: FileUploadRequest,
  props: HandleSubmitArtworkGenerationProps
) => {
  const { isProcessingLoading, setIsProcessingLoading, navigate } = props;

  e.preventDefault();

  if (isProcessingLoading) {
    sendToast(Toast.ProcessingInProgress, ToastType.Warn);
    return;
  }

  if (!body.localFile) {
    sendToast(Toast.NoImgFile, ToastType.Warn);
    return;
  }

  const formData = new FormData();
  formData.append("file", body.localFile);
  formData.append("includeCenterArtwork", body.includeCenterArtwork.toString());

  const fileExtensionIsAccepted = isFileExtensionAccepted(body.localFile.name, ACCEPTED_IMG_EXTENSIONS);
  if (!fileExtensionIsAccepted) {
    sendToast(
      Toast.InvalidFileType + "\n" +
        "Accepted file extensions: " + ACCEPTED_IMG_EXTENSIONS.join(", ") + ".",
      ToastType.Error
    );
    return;
  }

  postFileUpload(formData, {setIsProcessingLoading, navigate});
};