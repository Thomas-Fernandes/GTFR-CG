import { FormEvent, JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { sendToast } from "../../common/Toast";
import { ImageDownloadRequest } from "../../common/Types";
import useTitle from "../../common/UseTitle";
import { doesFileExist } from "../../common/utils/FileUtils";
import { OUTRO_FILENAME, PROCESSED_CARDS_PATH } from "../../constants/CardsGeneration";
import { PATHS, TITLE, TOAST, TOAST_TYPE } from "../../constants/Common";

import "./CardsGeneration.css";

const CardsGeneration = (): JSX.Element => {
  useTitle(TITLE.CARDS_GENERATION);

  const navigate = useNavigate();

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

  useEffect(() => {
    doesFileExist(PROCESSED_CARDS_PATH + "/" + OUTRO_FILENAME).then((outroCardExists: boolean) => {
      if (!outroCardExists && false) {
        navigate(`${PATHS.redirect}?redirect_to=${PATHS.lyrics}&error_text=${TOAST.NO_CARDS_CONTENTS}`);
      }
      setCardPaths([]); // TODO get "./processed-cards/XX.png" etc. + "./processed-cards/outro.png"
    });
  });

  return (
  <div id="cards-generation">
    <div id="toast-container"></div>
    <span className="top-bot-spacer" />

    <div className="navbar">
      <button type="button" onClick={() => navigate(PATHS.artworkGeneration)}>
        <span className="left">{TITLE.HOME}</span>
      </button>
      <button type="button" onClick={() => navigate(PATHS.lyrics)}>
        <span className="left">{TITLE.LYRICS}</span>
      </button>
    </div>

    <h1>{TITLE.CARDS_GENERATION}</h1>

    <div id="settings">
      {/* TODO */}
    </div>

    { cardPaths.length !== 0 &&
      <div id="cards">
        <button type="button" onClick={() => {}}>
          Download All Cards
        </button>
        { cardPaths.map((cardPath, idx) =>
          renderCard(cardPath, idx))
        }
      </div>
    }

    <span className="top-bot-spacer" />
  </div>
  )
};

export default CardsGeneration;