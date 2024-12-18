import { FormEvent } from "react";

import { showSpinner } from "@/common/spinner";
import { sendToast } from "@/common/toast";
import { isFileExtensionAccepted } from "@/common/utils/fileUtils";
import { ACCEPTED_IMG_EXTENSIONS } from "@/constants/files";
import { SpinnerId } from "@/constants/spinners";
import { Toast, ToastType } from "@/constants/toasts";

import { postGenerateCards, postGenerateSingleCard } from "./requests";
import { CardData, CardsGenerationRequest, HandleGenerateCardsProps, HandleSaveModalProps } from "./types";
import { generateFormData } from "./utils";

export const handleSaveModal = (
  currentCard: CardData | null, isModalSaving: boolean,
  props: HandleSaveModalProps
) => {
  const { generationProps, newLyrics, generateSingleCardProps } = props;

  if (currentCard === null) {
    sendToast(Toast.CardEditFailed, ToastType.Error);
    return;
  }

  if (isModalSaving) {
    sendToast(Toast.CardEditInProgress, ToastType.Warn);
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
  const { generationInProgress, setGenerationInProgress, setCardPaths, setCards, setColorPick } = props;

  e.preventDefault();

  if (generationInProgress) {
    sendToast(Toast.ProcessingInProgress, ToastType.Warn);
    return;
  }

  if (body.bgImg) {
    const fileExtensionIsAccepted = isFileExtensionAccepted(body.bgImg.name, ACCEPTED_IMG_EXTENSIONS);
    if (!fileExtensionIsAccepted) {
      sendToast(
        Toast.InvalidFileType + "\n" +
          "Accepted file extensions: " + ACCEPTED_IMG_EXTENSIONS.join(", ") + ".",
        ToastType.Error
      );
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
  sendToast(Toast.UnauthorizedOutro, ToastType.Warn);
};
