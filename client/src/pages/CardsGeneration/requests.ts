import { is2xxSuccessful, sendRequest } from "@common/requests";
import { hideSpinner, showSpinner } from "@common/spinner";
import { sendToast } from "@common/toast";
import { ApiResponse } from "@common/types";

import { SESSION_STORAGE } from "@constants/browser";
import { API, BACKEND_URL } from "@constants/paths";
import { HTTP_STATUS } from "@constants/requests";
import { SPINNER_ID } from "@constants/spinners";
import { TOAST, TOAST_TYPE } from "@constants/toasts";

import { OUTRO_FILENAME, PROCESSED_CARDS_PATH } from "./constants";
import { CardsGenerationRequest, CardsGenerationResponse, GenerateCardsProps, GenerateSingleCardProps, SingleCardGenerationRequest } from "./types";
import { deduceNewCards, generateFormData, updateCard } from "./utils";

export const postGenerateSingleCard = (
  generationProps: CardsGenerationRequest, newLyrics: string,
  props: GenerateSingleCardProps
) => {
  const { setIsModalSaving, currentCard, setCards, closeModal } = props;

  setIsModalSaving(true);
  showSpinner(SPINNER_ID.CARDS_GENERATE_SINGLE);

  const cardFilename = currentCard.src.split('?')[0] ?? "card";
  const body: SingleCardGenerationRequest = {
    ...generationProps,
    cardsContents: newLyrics.split("\n"),
    cardFilename: cardFilename,
  }
  const formData = new FormData();
  generateFormData(body, formData);

  sendRequest("POST", BACKEND_URL + API.CARDS_GENERATION.GENERATE_SINGLE_CARD, formData).then((response: ApiResponse) => {
    if (!is2xxSuccessful(response.status)) {
      console.error(response.message);
      sendToast(response.message, TOAST_TYPE.ERROR);
      return;
    }

    updateCard(setCards, currentCard, newLyrics, cardFilename);

    const toastMsg = TOAST.CARD_EDITED + `: ${(currentCard.id < 10 ? "0" : "")}${currentCard.id}.png`;
    sendToast(toastMsg, TOAST_TYPE.SUCCESS);
  }).catch((error) => {
    console.error("Failed to upload text:", error);
    sendToast(TOAST.CARD_EDIT_FAILED, TOAST_TYPE.ERROR);
  }).finally(() => {
    hideSpinner(SPINNER_ID.CARDS_GENERATE_SINGLE);
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
  showSpinner(SPINNER_ID.CARDS_GENERATE);
  setCardPaths([]);

  sendRequest("POST", BACKEND_URL + API.CARDS_GENERATION.GENERATE_CARDS, formData).then((response: CardsGenerationResponse) => {
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
    sessionStorage.setItem(SESSION_STORAGE.CARD_METANAME, body.cardMetaname);
    sessionStorage.setItem(SESSION_STORAGE.CARD_BOTTOM_COLOR, body.colorPick);
    sendToast(TOAST.CARDS_GENERATED, TOAST_TYPE.SUCCESS);
  }).catch((error: ApiResponse) => {
    if (error.status === HTTP_STATUS.PRECONDITION_FAILED)
      sendToast(TOAST.NO_CARDS_CONTENTS, TOAST_TYPE.ERROR);
    else
      sendToast(error.message, TOAST_TYPE.ERROR);
  }).finally(() => {
    hideSpinner(SPINNER_ID.CARDS_GENERATE);
    setGenerationInProgress(false);
  });
};
