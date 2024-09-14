import { FormEvent, JSX, useState } from "react";
import { useNavigate } from "react-router-dom";

import { is2xxSuccessful, sendRequest } from "../../common/Requests";
import { hideSpinner, showSpinner } from "../../common/Spinner";
import { sendToast } from "../../common/Toast";
import { ApiResponse, CardsGenerationRequest, CardsGenerationResponse, CardsProps, ImageDownloadRequest } from "../../common/Types";
import useTitle from "../../common/UseTitle";
import { doesFileExist } from "../../common/utils/FileUtils";
import { OUTRO_FILENAME, PROCESSED_CARDS_PATH } from "../../constants/CardsGeneration";
import { API, BACKEND_URL, PATHS, SPINNER_ID, TITLE, TOAST, TOAST_TYPE } from "../../constants/Common";

import "./CardsGeneration.css";

const CardsGeneration = (): JSX.Element => {
  useTitle(TITLE.CARDS_GENERATION);

  const navigate = useNavigate();

  const [metadata, setMetadata] = useState({} as CardsProps);
  const [generateOutro, setGenerateOutro] = useState(true);
  const [includeBackgroundImg, setIncludeBackgroundImg] = useState(true);

  const [generationInProgress, setGenerationInProgress] = useState(false);

  const [cardPaths, setCardPaths] = useState([] as string[]);

  const handleSubmitDownloadCard = (e: FormEvent<HTMLFormElement>, body: ImageDownloadRequest) => {
    e.preventDefault();

    if (!body.selectedImage) {
      sendToast(TOAST.NO_IMG_SELECTION, TOAST_TYPE.ERROR);
      return;
    }

    const filepath = `${PROCESSED_CARDS_PATH}/${body.selectedImage}`;
    const filename = filepath.split('/').pop();

    const link = document.createElement("a");
    link.download = filename ?? "card.png";
    link.href = filepath;
    document.body.appendChild(link);

    try {
      link.click();
    } catch (err) {
      sendToast((err as Error).message, TOAST_TYPE.ERROR);
    } finally {
      document.body.removeChild(link);
    }
  };

  const renderCard = (
    cardPath: string,
    idx: number
  ): JSX.Element => {
    const alt = "card" + "#" + idx.toString();
    return (
      <div id="card" key={alt}>
        <img src={cardPath} alt={alt} />
        <form onSubmit={(e) => handleSubmitDownloadCard(e, {selectedImage: cardPath})}>
          <input type="submit" value="Download" className="button" />
        </form>
      </div>
    );
  };

  const checkExistingCards = () => {
    doesFileExist(PROCESSED_CARDS_PATH + "/" + OUTRO_FILENAME);
    setCardPaths([]); // TODO get "./processed-cards/XX.png" etc. + "./processed-cards/outro.png"(?)
  };

  const handleGenerateCards = (e: FormEvent<HTMLFormElement>, body: CardsGenerationRequest) => {
    e.preventDefault();

    if (generationInProgress) {
      sendToast(TOAST.PROCESSING_IN_PROGRESS, TOAST_TYPE.WARN);
      return;
    }

    setGenerationInProgress(true);
    showSpinner(SPINNER_ID.CARDS_GENERATE);

    const data = {
      song_data: body.metadata,
      generate_outro: body.generateOutro.toString(),
      include_background_img: body.includeBackgroundImg.toString(),
    };

    sendRequest("POST", BACKEND_URL + API.CARDS_GENERATION.GENERATE_CARDS, data).then((response: CardsGenerationResponse) => {
      if (!is2xxSuccessful(response.status)) {
        throw new Error(response.message);
      }

      setMetadata(response.data.metadata);
      setCardPaths(response.data.cards);
    }).catch((error: ApiResponse) => {
      sendToast(error.message, TOAST_TYPE.ERROR);
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

    <form id="settings" onSubmit={(e) => handleGenerateCards(e, {metadata, generateOutro, includeBackgroundImg})}>
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

        <div id="cards">
          <button type="button" onClick={() => {}}>
            Download All Cards
          </button>
          { cardPaths.map((cardPath, idx) =>
            renderCard(cardPath, idx))
          }
        </div>
      </>
    }

    <span className="top-bot-spacer" />
  </div>
  )
};

export default CardsGeneration;