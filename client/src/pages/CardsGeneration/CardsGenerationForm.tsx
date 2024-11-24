import { JSX, useState } from "react";

import { ContentsGenerationMode } from "@/common/types";

import Checkbox from "@/components/Checkbox/Checkbox";
import ColorPicker from "@/components/ColorPicker/ColorPicker";
import FileUploader from "@/components/FileUploader/FileUploader";

import { SpinnerId } from "@/constants/spinners";

import { useCardsGenerationContext, useCardsGenerationFormContext } from "./contexts";
import { handleGenerateCards, handleUnauthorizedCheckbox } from "./handlers";
import { CardsGenerationFormProps } from "./types";

import "./CardsGenerationForm.css";

const CardsGenerationForm: React.FC<CardsGenerationFormProps> = ({ setCardPaths, setCards }): JSX.Element => {
  const { cardMethod, cardMetaname, setCardMetaname, bgImg, colorPick, includeCenterArtwork, generateOutro, includeBackgroundImg, cardBottomColor } = useCardsGenerationContext();
  const { outroContributors, setOutroContributors, setBgImg, setColorPick, setIncludeCenterArtwork, setGenerateOutro, setIncludeBackgroundImg } = useCardsGenerationFormContext();

  const [generationInProgress, setGenerationInProgress] = useState(false);

  return (
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
            value={(outroContributors && "by: ") + outroContributors}
            onChange={(e) => setOutroContributors(e.target.value.replace("by: ", ""))}
            className={`contributors ${(!outroContributors ? "empty-text" : "")}`}
          />
        }
      </div>

      <div id="enforcers" className="settings flexbox flex-row">
        <FileUploader
          id="background-image" label={"Select image"} caption={"Enforce background image?"}
          accept="image/*" setter={setBgImg}
        />
        <ColorPicker
          id="bottom-bar" label={"Enforce bottom color?"}
          latest={cardBottomColor} setter={setColorPick}
        />
      </div>

      <div id="selectors" className="settings flexbox flex-row">
        { bgImg &&
          <Checkbox
            id="include_center_artwork" label={"Include center artwork"}
            defaultChecked={includeCenterArtwork}
            onChange={(e) => setIncludeCenterArtwork(e.target.checked)}
          />
        }
        <div onClick={() => cardMethod === ContentsGenerationMode.Manual && handleUnauthorizedCheckbox()}>
          <Checkbox
            id="generate_outro" label={"Generate outro image"}
            defaultChecked={cardMethod === ContentsGenerationMode.Auto} disabled={cardMethod === ContentsGenerationMode.Manual}
            onChange={(e) => setGenerateOutro(e.target.checked)}
          />
        </div>
        <Checkbox
          id="include_background" label={"Include background image"}
          defaultChecked={includeBackgroundImg}
          onChange={(e) => setIncludeBackgroundImg(e.target.checked)}
        />
      </div>

      <div className="action-button pad-l-1" id={SpinnerId.CardsGenerate}>
        <input type="submit" value={"GENERATE"} className="action-button" />
      </div>
    </form>
  )
};

export default CardsGenerationForm;