import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useTitle from "@/common/useTitle";

import ColorPicker from "@components/ColorPicker";
import FileUploader from "@components/FileUploader";
import ZipDownloadButton from "@components/ZipDownloadButton";

import { SESSION_STORAGE, TITLE } from "@constants/Common";
import { VIEW_PATHS } from "@constants/Paths";
import { SPINNER_ID } from "@constants/Spinner";

import CardsGallery, { CardData } from "./CardsGallery";
import { handleGenerateCards, handleSubmitDownloadCard, handleUnauthorizedCheckbox } from "./handlers";

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

      <form id="settings"
        onSubmit={(e) => handleGenerateCards(e,
          {cardMetaname, outroContributors, bgImg, colorPick, includeCenterArtwork, generateOutro, includeBackgroundImg},
          {generationInProgress, setGenerationInProgress, setCardPaths, setCards, setColorPick}
        )}
      >
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
          <div onClick={() => handleUnauthorizedCheckbox(cardMethod)}>
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