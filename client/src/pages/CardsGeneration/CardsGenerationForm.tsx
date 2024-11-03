import { JSX, useEffect, useState } from "react";

import Checkbox from "@/components/Checkbox/Checkbox";
import ColorPicker from "@components/ColorPicker/ColorPicker";
import FileUploader from "@components/FileUploader/FileUploader";

import { SESSION_STORAGE } from "@constants/browser";
import { SPINNER_ID } from "@constants/spinners";

import { handleGenerateCards, handleUnauthorizedCheckbox } from "./handlers";
import { CardsGenerationFormProps } from "./types";

import "./CardsGenerationForm.css";

const CardsGenerationForm: React.FC<CardsGenerationFormProps> = ({ setCardPaths, setCards }): JSX.Element => {
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

  useEffect(() => {
    if (isComponentMounted)
      return;

    setCardMetaname(sessionStorage.getItem(SESSION_STORAGE.CARD_METANAME) ?? "");
    const storedOutroContributors = sessionStorage.getItem(SESSION_STORAGE.OUTRO_CONTRIBUTORS);
    setOutroContributors(storedOutroContributors ? JSON.parse(storedOutroContributors).join(", ") : "");
    setIsComponentMounted(true);
  }, [isComponentMounted, colorPick]);

  return (
    <form id="settings"
      onSubmit={(e) => handleGenerateCards(e,
        {cardMetaname, outroContributors, bgImg, colorPick, includeCenterArtwork, generateOutro, includeBackgroundImg},
        {generationInProgress, setGenerationInProgress, setCardPaths, setCards}
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
            value={(outroContributors && "by: ") + outroContributors}
            onChange={(e) => setOutroContributors(e.target.value.replace("by: ", ""))}
            className={"contributors" + (!outroContributors ? " empty-text" : "")}
          />
        }
      </div>
      <div id="enforcers" className="settings flexbox flex-row">
        <FileUploader
          id="background-image" label="Select image" caption="Enforce background image?"
          accept="image/*" setter={setBgImg}
        />
        <ColorPicker
          id="bottom-bar" label="Enforce bottom color?"
          latest={cardBottomColor} setter={setColorPick}
        />
      </div>
      <div id="selectors" className="settings flexbox flex-row">
        { bgImg &&
          <Checkbox
            id="include_center_artwork" label="Include center artwork"
            defaultChecked={includeCenterArtwork}
            onChange={(e) => setIncludeCenterArtwork(e.target.checked)}
          />
        }
        <div onClick={() => cardMethod === "manual" && handleUnauthorizedCheckbox()}>
          <Checkbox
            id="generate_outro" label="Generate outro image"
            defaultChecked={cardMethod === "auto"} disabled={cardMethod === "manual"}
            onChange={(e) => setGenerateOutro(e.target.checked)}
          />
        </div>
        <Checkbox
          id="include_background" label="Include background image"
          defaultChecked={includeBackgroundImg}
          onChange={(e) => setIncludeBackgroundImg(e.target.checked)}
        />
      </div>

      <div className="action-button" id={SPINNER_ID.CARDS_GENERATE}>
        <input type="submit" value="GENERATE" className="action-button" />
      </div>
    </form>
  )
};

export default CardsGenerationForm;