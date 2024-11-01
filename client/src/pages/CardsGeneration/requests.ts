import { is2xxSuccessful, sendRequest } from "../../common/Requests";
import { hideSpinner, showSpinner } from "../../common/Spinner";
import { sendToast } from "../../common/Toast";
import { ApiResponse, CardsGenerationRequest, CardsGenerationResponse, StateSetter } from "../../common/Types";
import { CardData } from "../../components/CardsGallery/CardsGallery";

import { SESSION_STORAGE } from "../../constants/Common";
import { API, BACKEND_URL, PROCESSED_CARDS_PATH } from "../../constants/Paths";
import { HTTP_STATUS } from "../../constants/Requests";
import { SPINNER_ID } from "../../constants/Spinner";
import { TOAST, TOAST_TYPE } from "../../constants/Toast";

import { deduceNewCards } from "./utils";

type GenerateCardsProps = {
  setGenerationInProgress: StateSetter<boolean>;
  setCardPaths: StateSetter<string[]>;
  setCards: StateSetter<CardData[]>;
  setColorPick: StateSetter<string>;
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
      cardPaths.push(`${PROCESSED_CARDS_PATH}/outro.png`);
    const pathsWithCacheBuster = cardPaths.map((path) => `${path}?t=${Date.now()}`); // busting cached images with the same name thanks to timestamp
    setCardPaths(pathsWithCacheBuster);
    const newCards = deduceNewCards(pathsWithCacheBuster, response.data.cardsLyrics, body.generateOutro ?? false);
    setCards(newCards);
    setColorPick(response.data.cardBottomColor);
    sendToast(TOAST.CARDS_GENERATED, TOAST_TYPE.SUCCESS);
  }).catch((error: ApiResponse) => {
    if (error.status === HTTP_STATUS.PRECONDITION_FAILED)
      sendToast(TOAST.NO_CARDS_CONTENTS, TOAST_TYPE.ERROR);
    else
      sendToast(error.message, TOAST_TYPE.ERROR);
  }).finally(() => {
    hideSpinner(SPINNER_ID.CARDS_GENERATE);
    setGenerationInProgress(false);
    sessionStorage.setItem(SESSION_STORAGE.CARD_METANAME, body.cardMetaname);
    sessionStorage.setItem(SESSION_STORAGE.CARD_BOTTOM_COLOR, body.colorPick);
  });
};
