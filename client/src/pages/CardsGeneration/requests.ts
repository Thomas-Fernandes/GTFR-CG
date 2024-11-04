import { is2xxSuccessful, sendRequest } from "@common/requests";
import { hideSpinner, showSpinner } from "@common/spinner";
import { sendToast } from "@common/toast";
import { ApiResponse, RestVerb } from "@common/types";

import { SessionStorage } from "@constants/browser";
import { API, BACKEND_URL } from "@constants/paths";
import { HTTP_STATUS } from "@constants/requests";
import { SpinnerId } from "@constants/spinners";
import { Toast, ToastType } from "@constants/toasts";

import { OUTRO_FILENAME, PROCESSED_CARDS_PATH } from "./constants";
import { CardsGenerationRequest, CardsGenerationResponse, GenerateCardsProps, GenerateSingleCardProps, SingleCardGenerationRequest } from "./types";
import { deduceNewCards, generateFormData, updateCard } from "./utils";

export const postGenerateSingleCard = (
  generationProps: CardsGenerationRequest, newLyrics: string,
  props: GenerateSingleCardProps
) => {
  const { setIsModalSaving, currentCard, setCards, closeModal } = props;

  setIsModalSaving(true);
  showSpinner(SpinnerId.CardsGenerateSingle);

  const cardFilename = currentCard.src.split('?')[0] ?? "card";
  const body: SingleCardGenerationRequest = {
    ...generationProps,
    cardsContents: newLyrics.split("\n"),
    cardFilename: cardFilename,
  }
  const formData = new FormData();
  generateFormData(body, formData);

  sendRequest(RestVerb.Post, BACKEND_URL + API.CARDS_GENERATION.GENERATE_SINGLE_CARD, formData).then((response: ApiResponse) => {
    if (!is2xxSuccessful(response.status)) {
      console.error(response.message);
      sendToast(response.message, ToastType.Error);
      return;
    }

    updateCard(setCards, currentCard, newLyrics, cardFilename);

    const toastMsg = Toast.CardEdited + `: ${(currentCard.id < 10 ? "0" : "")}${currentCard.id}.png`;
    sendToast(toastMsg, ToastType.Success);
  }).catch((error) => {
    console.error("Failed to upload text:", error);
    sendToast(Toast.CardEditFailed, ToastType.Error);
  }).finally(() => {
    hideSpinner(SpinnerId.CardsGenerateSingle);
    setIsModalSaving(false);
    closeModal();
  });
};

export const postGenerateCards = (
  body: CardsGenerationRequest, formData: FormData,
  props: GenerateCardsProps
) => {
  const { setGenerationInProgress, setCardPaths, setCards, setColorPick } = props;

  setGenerationInProgress(true);
  showSpinner(SpinnerId.CardsGenerate);
  setCardPaths([]);

  sendRequest(RestVerb.Post, BACKEND_URL + API.CARDS_GENERATION.GENERATE_CARDS, formData).then((response: CardsGenerationResponse) => {
    if (!is2xxSuccessful(response.status)) {
      throw new Error(response.message);
    }

    const nbGenerated = response.data.cardsLyrics.length + 1;
    const cardPaths = [];
    for (let i = 0; i < nbGenerated; i++)
      cardPaths.push(`${PROCESSED_CARDS_PATH}/${i.toString().padStart(2, "0")}.png`); // 00.png, 01.png, ..., 09.png, 10.png, ...
    if (body.generateOutro === true)
      cardPaths.push(`${PROCESSED_CARDS_PATH}/${OUTRO_FILENAME}`);
    const pathsWithCacheBuster = cardPaths.map((path) => `${path}?t=${Date.now()}`); // busting cached images with the same name thanks to timestamp
    setCardPaths(pathsWithCacheBuster);
    const newCards = deduceNewCards(pathsWithCacheBuster, response.data.cardsLyrics, body.generateOutro ?? false);
    setCards(newCards);
    setColorPick(response.data.cardBottomColor);
    sessionStorage.setItem(SessionStorage.CardMetaname, body.cardMetaname);
    sessionStorage.setItem(SessionStorage.CardBottomColor, body.colorPick);
    sendToast(Toast.CardsGenerated, ToastType.Success);
  }).catch((error: ApiResponse) => {
    if (error.status === HTTP_STATUS.PRECONDITION_FAILED)
      sendToast(Toast.NoCardsContents, ToastType.Error);
    else
      sendToast(error.message, ToastType.Error);
  }).finally(() => {
    hideSpinner(SpinnerId.CardsGenerate);
    setGenerationInProgress(false);
  });
};
