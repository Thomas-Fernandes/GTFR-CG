import { sendToast } from "@/common/Toast";
import { Toast, ToastType } from "@/constants/toasts";

import { COVER_ART_FILENAME, DEFAULT_DOWNLOAD_FILENAME, DOWNLOAD_BG_IMG_FILENAME, PROCESSED_ARTWORKS_PATH } from "./constants";

export const handleSubmitDownloadImage = (path: string) => {
  if (!path) {
    sendToast(Toast.NoImgSelection, ToastType.Error);
    return;
  }

  const filepath = `${PROCESSED_ARTWORKS_PATH}/${path}`;
  const filename = filepath.split('/').pop();
  const outputFilename = filename === COVER_ART_FILENAME ? DOWNLOAD_BG_IMG_FILENAME : filename;

  const linkElement = document.createElement("a");
  linkElement.download = outputFilename ?? DEFAULT_DOWNLOAD_FILENAME;
  linkElement.href = filepath;
  document.body.appendChild(linkElement);

  try {
    linkElement.click();
  } catch (err) {
    sendToast((err as Error).message, ToastType.Error);
  } finally {
    document.body.removeChild(linkElement);
  }
};