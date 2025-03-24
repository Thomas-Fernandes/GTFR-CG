import { FormEvent } from "react";

import { showSpinner } from "@/common/Spinner";
import { sendToast } from "@/common/Toast";
import { isFileExtensionAccepted } from "@/common/utils/fileUtils";
import { ACCEPTED_IMG_EXTENSIONS } from "@/constants/files";
import { SpinnerId } from "@/constants/spinners";
import { ToastType } from "@/constants/toasts";
import { getToasts } from "@/contexts";

import { postGenerateCards, postGenerateSingleCard } from "./requests";
import { CardData, CardsGenerationRequest, HandleGenerateCardsProps, HandleSaveModalProps } from "./types";
import { generateFormData } from "./utils";

export const handleSaveModal = (
  currentCard: CardData | null, isModalSaving: boolean,
  props: HandleSaveModalProps
) => {
  const toasts = getToasts();
  const { generationProps, newLyrics, generateSingleCardProps } = props;

  if (currentCard === null) {
    sendToast(toasts.CardGen.CardEditFailed, ToastType.Error);
    return;
  }

  if (isModalSaving) {
    sendToast(toasts.CardGen.CardEditInProgress, ToastType.Warn);
    return;
  }

  if (generationProps.colorPick === "")
    generationProps.colorPick = generationProps.cardBottomColor;
  postGenerateSingleCard(generationProps, newLyrics, generateSingleCardProps);
};

export const handleGenerateCards = (
  e: FormEvent<HTMLFormElement>, body: CardsGenerationRequest,
  props: HandleGenerateCardsProps
) => {
  const toasts = getToasts();
  const { generationInProgress, setGenerationInProgress, setCardPaths, setCards, setColorPick } = props;

  e.preventDefault();

  if (generationInProgress) {
    sendToast(toasts.ProcessingInProgress, ToastType.Warn);
    return;
  }

  if (body.bgImg) {
    const fileExtensionIsAccepted = isFileExtensionAccepted(body.bgImg.name, ACCEPTED_IMG_EXTENSIONS);
    if (!fileExtensionIsAccepted) {
      sendToast(toasts.ArtGen.InvalidFileType, ToastType.Error);
      return;
    }
  }

  const formData = new FormData();
  generateFormData(body, formData);

  setGenerationInProgress(true);
  showSpinner(SpinnerId.CardsGenerate);

  postGenerateCards(body, formData, { setGenerationInProgress, setCardPaths, setCards, setColorPick });
};

export const handleUnauthorizedCheckbox = () => {
  const toasts = getToasts();
  sendToast(toasts.CardGen.UnauthorizedOutro, ToastType.Warn);
};
