import { is2xxSuccessful, sendRequest } from "@/common/requests";
import { hideSpinner, showSpinner } from "@/common/Spinner";
import { sendToast } from "@/common/Toast";
import { ApiResponse, RestVerb } from "@/common/types";
import { SessionStorage } from "@/constants/browser";
import { API, BACKEND_URL } from "@/constants/paths";
import { HttpStatus } from "@/constants/requests";
import { SpinnerId } from "@/constants/spinners";
import { ToastType } from "@/constants/toasts";
import { getToasts } from "@/contexts";

import { OUTRO_FILENAME, PROCESSED_CARDS_PATH } from "./constants";
import {
  CardsGenerationRequest,
  CardsGenerationResponse,
  GenerateCardsProps
} from "./types";
import { deduceNewCards } from "./utils";

export const postGenerateCards = (
  body: CardsGenerationRequest, formData: FormData,
  props: GenerateCardsProps
) => {
  const toasts = getToasts();
  const { setGenerationInProgress, setCardPaths, setCards, setColorPick } = props;

  setGenerationInProgress(true);
  showSpinner(SpinnerId.CardsGenerate);
  setCardPaths([]);

  sendRequest(
    RestVerb.Post,
    BACKEND_URL + API.CARDS_GENERATION.GENERATE_CARDS,
    formData
  ).then((response: CardsGenerationResponse) => {
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
    sendToast(toasts.CardGen.CardsGenerated, ToastType.Success);
  }).catch((error: ApiResponse) => {
    if (error.status === HttpStatus.PreconditionFailed)
      sendToast(toasts.CardGen.NoCardsContents, ToastType.Error);
    else
      sendToast(error.message, ToastType.Error);
  }).finally(() => {
    hideSpinner(SpinnerId.CardsGenerate);
    setGenerationInProgress(false);
  });
};
