import { JSX, useEffect, useState } from "react";

import { useTitle } from "@common/useTitle";

import ToastContainer from "@/components/ToastContainer/ToastContainer";
import ColorPicker from "@components/ColorPicker/ColorPicker";
import FileUploader from "@components/FileUploader/FileUploader";
import NavButton from "@components/NavButton";
import ZipDownloadButton from "@components/ZipDownloadButton";

import { SESSION_STORAGE, TITLE } from "@constants/Common";
import { VIEW_PATHS } from "@constants/paths";
import { SPINNER_ID } from "@constants/spinners";

import CardsGallery from "./CardsGallery";
import { handleGenerateCards, handleSubmitDownloadCard, handleUnauthorizedCheckbox } from "./handlers";
import { CardData } from "./interfaces";

import "./CardsGeneration.css";

const CardsGeneration = (): JSX.Element => {
  useTitle(TITLE.CARDS_GENERATION);

  const [isComponentMounted, setIsComponentMounted] = useState(false);

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
      <ToastContainer />
      <span className="top-bot-spacer" />

      <div className="navbar">
        <NavButton to={VIEW_PATHS.home} label={TITLE.HOME} side="left" />
        <NavButton to={VIEW_PATHS.artworkGeneration} label={TITLE.ARTWORK_GENERATION} side="left" />
        <NavButton to={VIEW_PATHS.lyrics} label={TITLE.LYRICS} side="left" />
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

          <ZipDownloadButton id="download-all" paths={cardPaths} output={"cards.zip"} />
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