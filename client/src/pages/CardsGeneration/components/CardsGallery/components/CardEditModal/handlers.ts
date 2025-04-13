import { sendToast } from "@/common/Toast";
import { ToastType } from "@/constants/toasts";
import { getToasts } from "@/contexts";
import { CardData } from "@/pages/CardsGeneration/types";

import { postGenerateSingleCard } from "./requests";
import { HandleSaveModalProps } from "./types";

export const handleSaveModal = (currentCard: CardData | null, isModalSaving: boolean, props: HandleSaveModalProps) => {
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

  if (generationProps.colorPick === "") {
    generationProps.colorPick = generationProps.cardBottomColor;
  }
  postGenerateSingleCard(generationProps, newLyrics, generateSingleCardProps);
};
