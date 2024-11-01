import { FormEvent } from "react";

import { sendToast } from "@common/Toast";
import { ImageDownloadRequest } from "@common/Types";

import { COVER_ART_FILENAME, PROCESSED_IMAGES_PATH } from "@constants/Paths";
import { TOAST, TOAST_TYPE } from "@constants/Toast";

export const handleSubmitDownloadImage = (e: FormEvent<HTMLFormElement>, body: ImageDownloadRequest) => {
  e.preventDefault();

  if (!body.selectedImage) {
    sendToast(TOAST.NO_IMG_SELECTION, TOAST_TYPE.ERROR);
    return;
  }

  const filepath = `${PROCESSED_IMAGES_PATH}/${body.selectedImage}`;
  const filename = filepath.split('/').pop();
  const outputFilename = filename === COVER_ART_FILENAME ? "background.png" : filename;

  const link = document.createElement("a");
  link.download = outputFilename ?? "download.png";
  link.href = filepath;
  document.body.appendChild(link);

  try {
    link.click();
  } catch (err) {
    sendToast((err as Error).message, TOAST_TYPE.ERROR);
  } finally {
    document.body.removeChild(link);
  }
};