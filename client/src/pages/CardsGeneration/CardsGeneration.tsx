import { FormEvent, JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { is2xxSuccessful, sendRequest } from "../../common/Requests";
import { hideSpinner, showSpinner } from "../../common/Spinner";
import { sendToast } from "../../common/Toast";
import { ApiResponse, CardsGenerationRequest, CardsGenerationResponse, ImageDownloadRequest } from "../../common/Types";
import useTitle from "../../common/UseTitle";
import { isFileExtensionAccepted } from "../../common/utils/FileUtils";

import CardsGallery, { CardData } from "../../components/CardsGallery/CardsGallery";
import ColorPicker from "../../components/ColorPicker";
import FileUploader from "../../components/FileUploader";
import ZipDownloadButton from "../../components/ZipDownloadButton";

import { FILE_UPLOAD } from "../../constants/ArtworkGeneration";
import { SESSION_STORAGE, TITLE } from "../../constants/Common";
import { API, BACKEND_URL, PROCESSED_CARDS_PATH, VIEW_PATHS } from "../../constants/Paths";
import { HTTP_STATUS } from "../../constants/Requests";
import { SPINNER_ID } from "../../constants/Spinner";
import { TOAST, TOAST_TYPE } from "../../constants/Toast";

import { deduceNewCards, generateFormData } from "./utils";

import "./CardsGeneration.css";

const CardsGeneration = (): JSX.Element => {
  useTitle(TITLE.CARDS_GENERATION);

  const [isComponentMounted, setIsComponentMounted] = useState(false);

  const navigate = useNavigate();

  const [cardMetaname, setCardMetaname] = useState("");
  const [outroContributors, setOutroContributors] = useState("");
  const cardMethod = sessionStorage.getItem(SESSION_STORAGE.CARD_METHOD) ?? "auto";
  const cardBottomColor = sessionStorage.getItem(SESSION_STORAGE.CARD_BOTTOM_COLOR) ?? "";

  const [bgImg, setBgImg] = useState<File>();
  const [colorPick, setColorPick] = useState<string>("");
  const [includeCenterArtwork, setIncludeCenterArtwork] = useState(true);
  const [generateOutro, setGenerateOutro] = useState(cardMethod === "auto");
  const [includeBackgroundImg, setIncludeBackgroundImg] = useState(true);

  const [generationInProgress, setGenerationInProgress] = useState(false);

  const [cardPaths, setCardPaths] = useState([] as string[]);
  const [cards, setCards] = useState([] as CardData[]);

  const handleSubmitDownloadCard = (e: FormEvent<HTMLFormElement> | undefined, body: ImageDownloadRequest) => {
    if (e)
      e.preventDefault();

    if (!body.selectedImage) {
      sendToast(TOAST.NO_IMG_SELECTION, TOAST_TYPE.ERROR);
      return;
    }

    const filename = body.selectedImage.split('/').pop();

    const link = document.createElement("a");
    link.download = filename ? filename.split("?")[0] : "card.png";
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

  const handleGenerateCards = (e: FormEvent<HTMLFormElement>, body: CardsGenerationRequest) => {
    e.preventDefault();

    if (generationInProgress) {
      sendToast(TOAST.PROCESSING_IN_PROGRESS, TOAST_TYPE.WARN);
      return;
    }

    if (body.bgImg) {
      const fileExtensionIsAccepted = isFileExtensionAccepted(body.bgImg.name, FILE_UPLOAD.ACCEPTED_IMG_EXTENSIONS);
      if (!fileExtensionIsAccepted) {
        sendToast(
          TOAST.INVALID_FILE_TYPE + "\n" +
            "Accepted file extensions: " + FILE_UPLOAD.ACCEPTED_IMG_EXTENSIONS.join(", ") + ".",
          TOAST_TYPE.ERROR
        );
        return;
      }
    }

    setGenerationInProgress(true);
    showSpinner(SPINNER_ID.CARDS_GENERATE);
    setCardPaths([]);

    const formData = new FormData();
    generateFormData(body, formData);

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

  const handleUnauthorizedCheckbox = () => {
    if (cardMethod === "manual")
      sendToast(TOAST.UNAUTHORIZED_OUTRO, TOAST_TYPE.WARN);
  };

  useEffect(() => {
    if (isComponentMounted)
      return;

    setCardMetaname(sessionStorage.getItem(SESSION_STORAGE.CARD_METANAME) ?? "");
    const storedOutroContributors = sessionStorage.getItem(SESSION_STORAGE.OUTRO_CONTRIBUTORS);
    setOutroContributors(storedOutroContributors ? JSON.parse(storedOutroContributors).join(", ") : "");
    setIsComponentMounted(true);
  }, [isComponentMounted, colorPick]);

  return (
    <div id="cards-generation">
      <div id="toast-container"></div>
      <span className="top-bot-spacer" />

      <div className="navbar">
        <button type="button" onClick={() => navigate(VIEW_PATHS.home)}>
          <span className="left">{TITLE.HOME}</span>
        </button>
        <button type="button" onClick={() => navigate(VIEW_PATHS.artworkGeneration)}>
          <span className="left">{TITLE.ARTWORK_GENERATION}</span>
        </button>
        <button type="button" onClick={() => navigate(VIEW_PATHS.lyrics)}>
          <span className="left">{TITLE.LYRICS}</span>
        </button>
      </div>

      <h1>{TITLE.CARDS_GENERATION}</h1>

      <form id="settings" onSubmit={(e) => handleGenerateCards(e, {cardMetaname, outroContributors, bgImg, colorPick, includeCenterArtwork, generateOutro, includeBackgroundImg})}>
        <div id="text-fields" className="settings flexbox">
          <input autoComplete="off"
            type="text" name="metaname" placeholder="if empty, the card metaname will be inferred"
            value={cardMetaname} onChange={(e) => setCardMetaname(e.target.value)}
            className={!cardMetaname ? "empty-text" : ""}
          />
          { generateOutro &&
            <input autoComplete="off"
              type="text" name="contributors" placeholder="contributors (comma-separated)"
              value={(outroContributors && "by: ") + outroContributors} onChange={(e) => setOutroContributors(e.target.value.replace("by: ", ""))}
              className={"contributors" + (!outroContributors ? " empty-text" : "")}
            />
          }
        </div>
        <div id="enforcers" className="settings flexbox flex-row">
          <FileUploader id="background-image" label="Select image" caption="Enforce background image?" accept="image/*" setter={setBgImg} />
          <ColorPicker id="bottom-bar" label="Enforce bottom color?" latest={cardBottomColor} setter={setColorPick} />
        </div>
        <div id="selectors" className="settings flexbox flex-row">
          { bgImg &&
            <label className="checkbox" htmlFor="include_center_artwork">
              <input
                type="checkbox" name="include_center_artwork" id="include_center_artwork" defaultChecked
                onChange={(e) => setIncludeCenterArtwork(e.target.checked)}
              />
              <p className="checkbox-label italic">Include center artwork</p>
            </label>
          }
          <div onClick={handleUnauthorizedCheckbox}>
            <label className="checkbox" htmlFor="generate_outro">
              <input
                type="checkbox" name="generate_outro" id="generate_outro" defaultChecked={cardMethod === "auto"}
                disabled={cardMethod === "manual"}
                onChange={(e) => setGenerateOutro(e.target.checked)}
              />
            <p className="checkbox-label italic">Generate outro image</p>
          </label>
          </div>
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
          <hr className="mv-1" />

          <ZipDownloadButton type="button" id="download-all" paths={cardPaths} output={"cards.zip"} />
          <CardsGallery
            id="cards" initialCards={cards} handleDownloadCard={handleSubmitDownloadCard}
            generationProps={{
              cardMetaname, bgImg, colorPick, includeCenterArtwork, generateOutro, includeBackgroundImg, cardBottomColor,
            }}
          />
        </>
      }

      <span className="top-bot-spacer" />
    </div>
  )
};

export default CardsGeneration;