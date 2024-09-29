import { FormEvent, JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FileUploader from "../../common/components/FileUploader";
import ZipDownloadButton from "../../common/components/ZipDownloadButton";
import { is2xxSuccessful, sendRequest } from "../../common/Requests";
import { hideSpinner, showSpinner } from "../../common/Spinner";
import { sendToast } from "../../common/Toast";
import { ApiResponse, CardsGenerationRequest, CardsGenerationResponse, ImageDownloadRequest } from "../../common/Types";
import useTitle from "../../common/UseTitle";
import { isFileExtensionAccepted } from "../../common/utils/FileUtils";
import { FILE_UPLOAD } from "../../constants/ArtworkGeneration";
import { PROCESSED_CARDS_PATH, SESSION_STORAGE } from "../../constants/CardsGeneration";
import { API, BACKEND_URL, HTTP_STATUS, PATHS, SPINNER_ID, TITLE, TOAST, TOAST_TYPE } from "../../constants/Common";

import "./CardsGeneration.css";

const CardsGeneration = (): JSX.Element => {
  useTitle(TITLE.CARDS_GENERATION);

  const [isComponentMounted, setIsComponentMounted] = useState(false);

  const navigate = useNavigate();

  const [cardMetaname, setCardMetaname] = useState("");
  const cardMethod = sessionStorage.getItem(SESSION_STORAGE.CARD_METHOD) ?? "";

  const [bgImg, setBgImg] = useState<File>();
  const [includeCenterArtwork, setIncludeCenterArtwork] = useState(true);
  const [generateOutro, setGenerateOutro] = useState(cardMethod === "auto");
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

  const renderCard = (cardPath: string, nb: number): JSX.Element => {
    const cardFileName = (cardPath.split('/').pop() ?? "").split('?')[0] ?? "card";
    const alt = "card" + "-" + nb.toString() + "_" + cardFileName;
    return (
      <div className="card" key={alt}>
        <img src={cardPath} alt={alt} />
        <form onSubmit={(e) => handleSubmitDownloadCard(e, {selectedImage: cardPath})}>
          <input type="submit" value={"Download " + cardFileName.replace(".png", "")} className="button" />
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

    console.log(body)
    const formData = new FormData();
    if (body.bgImg) {
      formData.append("file", body.bgImg);
      if (body.includeCenterArtwork !== undefined)
        formData.append("includeCenterArtwork", body.includeCenterArtwork.toString());
    }
    formData.append("cardMetaname", body.cardMetaname);
    formData.append("generateOutro", body.generateOutro.toString());
    formData.append("includeBackgroundImg", body.includeBackgroundImg.toString());

    sendRequest("POST", BACKEND_URL + API.CARDS_GENERATION.GENERATE_CARDS, formData).then((response: CardsGenerationResponse) => {
      if (!is2xxSuccessful(response.status)) {
        throw new Error(response.message);
      }

      const nbGenerated = response.data.generated;
      const cardPaths = [];
      for (let i = 0; i < nbGenerated; i++)
        cardPaths.push(`${PROCESSED_CARDS_PATH}/${i.toString().padStart(2, "0")}.png`);
      if (body.generateOutro)
        cardPaths.push(`${PROCESSED_CARDS_PATH}/outro.png`);
      const pathsWithCacheBuster = cardPaths.map((path) => `${path}?t=${Date.now()}`);
      setCardPaths(pathsWithCacheBuster);
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

  const handleUnauthorizedCheckbox = () => {
    if (cardMethod === "manual")
      sendToast(TOAST.UNAUTHORIZED_OUTRO, TOAST_TYPE.WARN);
  };

  useEffect(() => {
    if (isComponentMounted) {
      return;
    }
    setCardMetaname(sessionStorage.getItem(SESSION_STORAGE.CARD_METANAME) ?? "");
    setIsComponentMounted(true);
  }, [isComponentMounted]);

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

      <form id="settings" onSubmit={(e) => handleGenerateCards(e, {cardMetaname, bgImg, includeCenterArtwork, generateOutro, includeBackgroundImg})}>
        <div id="text-fields" className="settings flexbox flex-row">
          <input autoComplete="off"
            type="text" name="metaname" placeholder="if empty, the card metaname will be inferred"
            value={cardMetaname} onChange={(e) => setCardMetaname(e.target.value)}
            style={!cardMetaname ? { fontStyle: "italic", fontSize: ".75rem" } : {}}
          />
        </div>
        <div id="file-upload" className="settings flexbox flex-row">
          <FileUploader id="background-image" label="Select image" caption="Enforce background image?" accept="image/*" setter={setBgImg} />
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