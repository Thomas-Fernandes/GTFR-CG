import { FormEvent } from "react";

import { showSpinner } from "@common/Spinner";
import { sendToast } from "@common/Toast";
import { CardsGenerationRequest, ImageDownloadRequest, StateSetter } from "@common/Types";
import { isFileExtensionAccepted } from "@common/utils/FileUtils";

import { CardData } from "@components/CardsGallery/CardsGallery";

import { FILE_UPLOAD } from "@constants/ArtworkGeneration";
import { SPINNER_ID } from "@constants/Spinner";
import { TOAST, TOAST_TYPE } from "@constants/Toast";

import { postGenerateCards } from "./requests";
import { generateFormData } from "./utils";

export const handleSubmitDownloadCard = (e: FormEvent<HTMLFormElement> | undefined, body: ImageDownloadRequest) => {
  e?.preventDefault();

  if (!body.selectedImage) {
    sendToast(TOAST.NO_IMG_SELECTION, TOAST_TYPE.ERROR);
    return;
  }

  const filename = body.selectedImage.split('/').pop();

  const link = document.createElement("a");
  link.download = filename ? filename.split("?")[0] : "card.png";
  link.href = body.selectedImage;
  document.body.appendChild(link);

  try {
    console.log("Downloading", body.selectedImage);
    link.click();
  } catch (err) {
    sendToast((err as Error).message, TOAST_TYPE.ERROR);
  } finally {
    document.body.removeChild(link);
  }
};

type HandleGenerateCardsProps = {
  generationInProgress: boolean;
  setGenerationInProgress: StateSetter<boolean>;
  setCardPaths: StateSetter<string[]>;
  setCards: StateSetter<CardData[]>;
  setColorPick: StateSetter<string>;
};
export const handleGenerateCards = (
  e: FormEvent<HTMLFormElement>, body: CardsGenerationRequest,
  props: HandleGenerateCardsProps
) => {
  const { generationInProgress, setGenerationInProgress, setCardPaths, setCards, setColorPick } = props;

  e.preventDefault();

  if (generationInProgress) {
    sendToast(TOAST.PROCESSING_IN_PROGRESS, TOAST_TYPE.WARN);
    return;
  }

  if (body.bgImg) {
    const fileExtensionIsAccepted = isFileExtensionAccepted(body.bgImg.name, FILE_UPLOAD.ACCEPTED_IMG_EXTENSIONS);
    if (!fileExtensionIsAccepted) {
      sendToast(
        TOAST.INVALID_FILE_TYPE + "\n" +
          "Accepted file extensions: " + FILE_UPLOAD.ACCEPTED_IMG_EXTENSIONS.join(", ") + ".",
        TOAST_TYPE.ERROR
      );
      return;
    }
  }

  const formData = new FormData();
  generateFormData(body, formData);

  setGenerationInProgress(true);
  showSpinner(SPINNER_ID.CARDS_GENERATE);
  setCardPaths([]);

  postGenerateCards(body, formData, { setGenerationInProgress, setCardPaths, setCards, setColorPick });
};

export const handleUnauthorizedCheckbox = (cardMethod: string) => {
  if (cardMethod === "manual")
    sendToast(TOAST.UNAUTHORIZED_OUTRO, TOAST_TYPE.WARN);
};
