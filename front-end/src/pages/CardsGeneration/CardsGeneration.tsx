import { FormEvent, JSX, useState } from "react";
import { useNavigate } from "react-router-dom";

import { is2xxSuccessful, sendRequest } from "../../common/Requests";
import { hideSpinner, showSpinner } from "../../common/Spinner";
import { sendToast } from "../../common/Toast";
import { ApiResponse, CardsGenerationRequest, CardsGenerationResponse, ImageDownloadRequest } from "../../common/Types";
import useTitle from "../../common/UseTitle";
import { PROCESSED_CARDS_PATH } from "../../constants/CardsGeneration";
import { API, BACKEND_URL, HTTP_STATUS, PATHS, SPINNER_ID, TITLE, TOAST, TOAST_TYPE } from "../../constants/Common";

import "./CardsGeneration.css";

const CardsGeneration = (): JSX.Element => {
  useTitle(TITLE.CARDS_GENERATION);

  const navigate = useNavigate();

  const [generateOutro, setGenerateOutro] = useState(true);
  const [includeBackgroundImg, setIncludeBackgroundImg] = useState(true);

  const [generationInProgress, setGenerationInProgress] = useState(false);

  const [cardPaths, setCardPaths] = useState([] as string[]);

  const handleSubmitDownloadCard = (e: FormEvent<HTMLFormElement> | undefined, body: ImageDownloadRequest) => {
    if (e)
      e.preventDefault();

    if (!body.selectedImage) {
      sendToast(TOAST.NO_IMG_SELECTION, TOAST_TYPE.ERROR);
      return;
    }

    const filename = body.selectedImage.split('/').pop();

    const link = document.createElement("a");
    link.download = filename ?? "card.png";
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
  const handleDownloadAllCards = () => {
    if (cardPaths.length === 0) {
      sendToast(TOAST.NO_CARDS, TOAST_TYPE.WARN);
      return;
    }

    for (const cardPath of cardPaths)
      handleSubmitDownloadCard(undefined, {selectedImage: cardPath});
  };

  const renderCard = (cardPath: string, nb: number): JSX.Element => {
    const cardFileName = cardPath.split('/').pop() ?? "";
    const alt = "card" + "-" + nb.toString() + "_" + cardFileName;
    return (
      <div className="card" key={alt}>
        <img src={cardPath} alt={alt} />
        <form onSubmit={(e) => handleSubmitDownloadCard(e, {selectedImage: cardPath})}>
          <input type="submit" value="Download" className="button" />
        </form>
      </div>
    );
  };

  const handleGenerateCards = (e: FormEvent<HTMLFormElement>, body: CardsGenerationRequest) => {
    e.preventDefault();

    if (generationInProgress) {
      sendToast(TOAST.PROCESSING_IN_PROGRESS, TOAST_TYPE.WARN);
      return;
    }

    setGenerationInProgress(true);
    showSpinner(SPINNER_ID.CARDS_GENERATE);
    setCardPaths([]);

    const data = {
      generate_outro: body.generateOutro.toString(),
      include_background_img: body.includeBackgroundImg.toString(),
    };

    sendRequest("POST", BACKEND_URL + API.CARDS_GENERATION.GENERATE_CARDS, data).then((response: CardsGenerationResponse) => {
      if (!is2xxSuccessful(response.status)) {
        throw new Error(response.message);
      }

      const nbGenerated = response.data.generated;
      const cardPaths = [];
      for (let i = 0; i < nbGenerated; i++)
        cardPaths.push(`${PROCESSED_CARDS_PATH}/${i.toString().padStart(2, "0")}.png`);
      if (body.generateOutro)
        cardPaths.push(`${PROCESSED_CARDS_PATH}/outro.png`);
      setCardPaths(cardPaths);
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

  return (
    <div id="cards-generation">
      <div id="toast-container"></div>
      <span className="top-bot-spacer" />

      <div className="navbar">
        <button type="button" onClick={() => navigate(PATHS.home)}>
          <span className="left">{TITLE.HOME}</span>
        </button>
        <button type="button" onClick={() => navigate(PATHS.artworkGeneration)}>
          <span className="left">{TITLE.ARTWORK_GENERATION}</span>
        </button>
        <button type="button" onClick={() => navigate(PATHS.lyrics)}>
          <span className="left">{TITLE.LYRICS}</span>
        </button>
      </div>

      <h1>{TITLE.CARDS_GENERATION}</h1>

      <form id="settings" onSubmit={(e) => handleGenerateCards(e, {generateOutro, includeBackgroundImg})}>
        <div className="settings flexbox flex-row">
          <label className="checkbox" htmlFor="generate_outro">
            <input
              type="checkbox" name="generate_outro" id="generate_outro" defaultChecked
              onChange={(e) => setGenerateOutro(e.target.checked)}
            />
            <p className="checkbox-label italic">Generate outro image</p>
          </label>
          <label className="checkbox" htmlFor="include_background">
            <input
              type="checkbox" name="include_background" id="include_background" defaultChecked
              onChange={(e) => setIncludeBackgroundImg(e.target.checked)}
            />
            <p className="checkbox-label italic">Include background image</p>
          </label>
        </div>

        <div className="action-button" id={SPINNER_ID.CARDS_GENERATE}>
          <input type="submit" value="GENERATE" className="action-button" />
        </div>
      </form>

      { cardPaths.length > 0 &&
        <>
          <hr className="mv-2" />

          <button type="button" id="download-all" onClick={handleDownloadAllCards}>
            Download All Cards
          </button>
          <div id="cards">
            { cardPaths.map((cardPath, idx) =>
              renderCard(cardPath, idx + 1))
            }
          </div>
        </>
      }

      <span className="top-bot-spacer" />
    </div>
  )
};

export default CardsGeneration;