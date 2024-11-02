import { FormEvent } from "react";

import { showSpinner } from "@common/spinner";
import { sendToast } from "@common/toast";
import { ImageDownloadRequest } from "@common/types";
import { isFileExtensionAccepted } from "@common/utils/fileUtils";

import { FILE_UPLOAD } from "@constants/ArtworkGeneration";
import { SPINNER_ID } from "@constants/spinners";
import { TOAST, TOAST_TYPE } from "@constants/toasts";

import { postGenerateCards, postGenerateSingleCard } from "./requests";
import { CardData, CardsGenerationRequest, HandleGenerateCardsProps, HandleSaveModalProps } from "./types";
import { generateFormData } from "./utils";

export const handleSaveModal = (
  currentCard: CardData | null, isModalSaving: boolean,
  props: HandleSaveModalProps
) => {
  const { generationProps, newLyrics, generateSingleCardProps } = props;

  if (currentCard === null) {
    sendToast(TOAST.CARD_EDIT_FAILED, TOAST_TYPE.ERROR);
    return;
  }

  if (isModalSaving) {
    sendToast(TOAST.CARD_EDIT_IN_PROGRESS, TOAST_TYPE.WARN);
    return;
  }

  postGenerateSingleCard(generationProps, newLyrics, generateSingleCardProps);
};

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

export const handleGenerateCards = (
  e: FormEvent<HTMLFormElement>, body: CardsGenerationRequest,
  props: HandleGenerateCardsProps
) => {
  const { generationInProgress, setGenerationInProgress, setCardPaths, setCards } = props;

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

  postGenerateCards(body, formData, { setGenerationInProgress, setCardPaths, setCards });
};

export const handleUnauthorizedCheckbox = () => {
  sendToast(TOAST.UNAUTHORIZED_OUTRO, TOAST_TYPE.WARN);
};
