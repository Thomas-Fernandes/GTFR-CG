import { is2xxSuccessful, sendRequest } from "@/common/requests";
import { hideSpinner, showSpinner } from "@/common/Spinner";
import { sendToast } from "@/common/Toast";
import { ApiResponse, RestVerb } from "@/common/types";
import { API, BACKEND_URL } from "@/constants/paths";
import { SpinnerId } from "@/constants/spinners";
import { ToastType } from "@/constants/toasts";
import { getToasts } from "@/contexts";
import {
  CardsGenerationRequest,
  SingleCardGenerationRequest
} from "@/pages/CardsGeneration/components/CardsGenerationForm/types";
import { generateFormData } from "@/pages/CardsGeneration/utils";

import { GenerateSingleCardProps } from "./types";
import { updateCard } from "./utils";

export const postGenerateSingleCard = (
  generationProps: CardsGenerationRequest, newLyrics: string,
  props: GenerateSingleCardProps
) => {
  const toasts = getToasts();
  const { setIsModalSaving, currentCard, setCards, closeModal } = props;

  setIsModalSaving(true);
  showSpinner(SpinnerId.CardsGenerateSingle);

  const cardFilename = currentCard.imgSrc.split('?')[0] ?? "card";
  const body: SingleCardGenerationRequest = {
    ...generationProps,
    cardsContents: newLyrics.split("\n"),
    cardFilename: cardFilename,
  }
  const formData = new FormData();
  generateFormData(body, formData);

  sendRequest(
    RestVerb.Post,
    BACKEND_URL + API.CARDS_GENERATION.GENERATE_SINGLE_CARD,
    formData
  ).then((response: ApiResponse) => {
    if (!is2xxSuccessful(response.status)) {
      console.error(response.message);
      sendToast(response.message, ToastType.Error);
      return;
    }

    updateCard(setCards, currentCard, newLyrics, cardFilename);

    const toastMsg = `${toasts.CardGen.CardEdited}: ${(currentCard.id < 10 ? "0" : "")}${currentCard.id}.png`;
    sendToast(toastMsg, ToastType.Success);
  }).catch((error) => {
    console.error("Failed to upload text:", error);
    sendToast(toasts.CardGen.CardEditFailed, ToastType.Error);
  }).finally(() => {
    hideSpinner(SpinnerId.CardsGenerateSingle);
    setIsModalSaving(false);
    closeModal();
  });
};