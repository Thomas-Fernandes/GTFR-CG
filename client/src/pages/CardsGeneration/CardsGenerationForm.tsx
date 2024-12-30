
import { ContentsGenerationMode } from "@/common/types";
import ActionButton from "@/components/ActionButton/ActionButton";
import Checkbox from "@/components/Checkbox/Checkbox";
import ColorPicker from "@/components/ColorPicker/ColorPicker";
import FileUploader from "@/components/FileUploader/FileUploader";
import { SpinnerId } from "@/constants/spinners";

import { useCardsGenerationContext, useCardsGenerationFormContext } from "./contexts";
import { handleGenerateCards, handleUnauthorizedCheckbox } from "./handlers";
import { CardsGenerationFormProps } from "./types";

import "./CardsGenerationForm.scss";

const CardsGenerationForm: React.FC<CardsGenerationFormProps> = ({ setCardPaths, setCards }) => {
  const {
    cardMethod, cardMetaname, setCardMetaname, bgImg, colorPick, includeCenterArtwork,
    generateOutro, includeBackgroundImg, cardBottomColor
  } = useCardsGenerationContext();
  const {
    outroContributors, setOutroContributors, setBgImg, setColorPick, setIncludeCenterArtwork,
    setGenerateOutro, setIncludeBackgroundImg, generationInProgress, setGenerationInProgress
  } = useCardsGenerationFormContext();

  return (
    <form id="settings"
      onSubmit={(e) => handleGenerateCards(e,
        {cardMetaname, outroContributors, bgImg, colorPick, includeCenterArtwork, generateOutro, includeBackgroundImg},
        {generationInProgress, setGenerationInProgress, setCardPaths, setCards, setColorPick}
      )}
    >
      <label htmlFor="text-fields" className="hidden">{"Text fields"}</label>
      <div id="text-fields" className="settings">
        <input autoComplete="off"
          type="text" name="metaname" placeholder={"if empty, the card metaname will be inferred"}
          value={cardMetaname} onChange={(e) => setCardMetaname(e.target.value)}
          className={!cardMetaname ? "empty" : ""}
        />
        { generateOutro &&
          <input autoComplete="off"
            type="text" name="contributors" placeholder={"contributors (comma-separated)"}
            value={(outroContributors && "by: ") + outroContributors}
            onChange={(e) => setOutroContributors(e.target.value.replace("by: ", ""))}
            className={`contributors ${(!outroContributors ? "empty" : "")}`}
          />
        }
      </div>

      <label htmlFor="enforcers" className="hidden">{"Enforcers"}</label>
      <div id="enforcers" className="settings">
        <FileUploader
          id="background-image" label={"Select image"} caption={"Enforce background image?"}
          accept="image/*" setter={setBgImg}
        />
        <ColorPicker
          id="bottom-bar" label={"Enforce bottom color?"}
          latest={cardBottomColor} setter={setColorPick}
        />
      </div>

      <label htmlFor="selectors" className="hidden">{"Selectors"}</label>
      <div id="selectors" className="settings">
        { bgImg &&
          <Checkbox id="include_center_artwork"
            size={24}
            checked={includeCenterArtwork}
            onChange={() => setIncludeCenterArtwork(!includeCenterArtwork)}
            label={"Include center artwork"}
          />
        }
        <div onClick={() => cardMethod === ContentsGenerationMode.Manual && handleUnauthorizedCheckbox()}>
          <Checkbox id="generate_outro" disabled={cardMethod === ContentsGenerationMode.Manual}
            size={24}
            checked={cardMethod === ContentsGenerationMode.Auto && generateOutro}
            onChange={() => cardMethod === ContentsGenerationMode.Auto && setGenerateOutro(!generateOutro)}
            label={"Generate outro image"}
          />
        </div>
        <Checkbox id="include_background"
          size={24}
          checked={includeBackgroundImg}
          onChange={() => setIncludeBackgroundImg(!includeBackgroundImg)}
          label={"Include background image"}
        />
      </div>

      <div className="submit" id={SpinnerId.CardsGenerate}>
        <ActionButton type="submit" label="GENERATE" className="spaced" />
      </div>
    </form>
  )
};

export default CardsGenerationForm;