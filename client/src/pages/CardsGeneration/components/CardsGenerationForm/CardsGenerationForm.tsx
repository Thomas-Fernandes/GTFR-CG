import { ContentsGenerationMode } from "@/common/types";
import ButtonWithSpinner from "@/components/ButtonWithSpinner/ButtonWithSpinner";
import Checkbox from "@/components/Checkbox/Checkbox";
import ColorPicker from "@/components/ColorPicker/ColorPicker";
import FileUploader from "@/components/FileUploader/FileUploader";
import { SpinnerId } from "@/constants/spinners";
import { useAppContext } from "@/contexts";
import { useCardsGenerationContext, useCardsGenerationFormContext } from "@/pages/CardsGeneration/contexts";

import { handleGenerateCards, handleUnauthorizedCheckbox } from "./handlers";
import { CardsGenerationFormProps } from "./types";

import "./CardsGenerationForm.scss";

const CardsGenerationForm = ({ setCardPaths, setCards }: CardsGenerationFormProps) => {
  const { intl } = useAppContext();
  const labels = {
    metanamePlaceholder: intl.formatMessage({ id: "pages.cardgen.textFields.metanamePlaceholder" }),
    contributorsPlaceholder: intl.formatMessage({ id: "pages.cardgen.textFields.contributorsPlaceholder" }),
    fileUploadButton: intl.formatMessage({ id: "pages.artgen.local.fileUploadButton" }),
    fileUploadLabel: intl.formatMessage({ id: "pages.cardgen.enforcers.fileUploadLabel" }),
    colorPickerLabel: intl.formatMessage({ id: "pages.cardgen.enforcers.colorPickerLabel" }),
    includeCenterArtwork: intl.formatMessage({ id: "pages.cardgen.selectors.centerArtwork" }),
    generateOutro: intl.formatMessage({ id: "pages.cardgen.selectors.outroImage" }),
    includeBackgroundImg: intl.formatMessage({ id: "pages.cardgen.selectors.bgImage" }),
    submit: intl.formatMessage({ id: "pages.cardgen.submit" }),
  };

  const {
    cardMethod,
    cardMetaname,
    setCardMetaname,
    bgImg,
    colorPick,
    includeCenterArtwork,
    generateOutro,
    includeBackgroundImg,
    cardBottomColor,
  } = useCardsGenerationContext();
  const {
    outroContributors,
    setOutroContributors,
    setBgImg,
    setColorPick,
    setIncludeCenterArtwork,
    setGenerateOutro,
    setIncludeBackgroundImg,
    generationInProgress,
    setGenerationInProgress,
  } = useCardsGenerationFormContext();

  return (
    <form
      id="settings"
      onSubmit={(e) =>
        handleGenerateCards(
          e,
          {
            cardMetaname,
            outroContributors,
            bgImg,
            colorPick,
            includeCenterArtwork,
            generateOutro,
            includeBackgroundImg,
          },
          { generationInProgress, setGenerationInProgress, setCardPaths, setCards, setColorPick }
        )
      }
    >
      <label htmlFor="text-fields" className="hidden">
        {"Text fields"}
      </label>
      <div id="text-fields" className="settings">
        <input
          type="text"
          name="metaname"
          placeholder={labels.metanamePlaceholder}
          value={cardMetaname}
          onChange={(e) => setCardMetaname(e.target.value)}
          autoComplete="off"
          className={!cardMetaname ? "empty" : ""}
        />
        {generateOutro && (
          <input
            type="text"
            name="contributors"
            placeholder={labels.contributorsPlaceholder}
            value={(outroContributors && "by: ") + outroContributors}
            onChange={(e) => setOutroContributors(e.target.value.replace("by: ", ""))}
            autoComplete="off"
            className={`contributors ${!outroContributors ? "empty" : ""}`}
          />
        )}
      </div>

      <label htmlFor="enforcers" className="hidden">
        {"Enforcers"}
      </label>
      <div id="enforcers" className="settings">
        <FileUploader
          id="background-image"
          label={labels.fileUploadLabel}
          caption={labels.fileUploadButton}
          accept="image/*"
          setter={setBgImg}
        />
        <ColorPicker id="bottom-bar" label={labels.colorPickerLabel} latest={cardBottomColor} setter={setColorPick} />
      </div>

      <label htmlFor="selectors" className="hidden">
        {"Selectors"}
      </label>
      <div id="selectors" className="settings">
        {bgImg && (
          <Checkbox
            id="include_center_artwork"
            size={24}
            checked={includeCenterArtwork}
            onChange={() => setIncludeCenterArtwork(!includeCenterArtwork)}
            label={labels.includeCenterArtwork}
          />
        )}
        <div onClick={() => cardMethod === ContentsGenerationMode.Manual && handleUnauthorizedCheckbox()}>
          <Checkbox
            id="generate_outro"
            size={24}
            disabled={cardMethod === ContentsGenerationMode.Manual}
            checked={cardMethod === ContentsGenerationMode.Auto && generateOutro}
            onChange={() => cardMethod === ContentsGenerationMode.Auto && setGenerateOutro(!generateOutro)}
            label={labels.generateOutro}
          />
        </div>
        <Checkbox
          id="include_background"
          size={24}
          checked={includeBackgroundImg}
          onChange={() => setIncludeBackgroundImg(!includeBackgroundImg)}
          label={labels.includeBackgroundImg}
        />
      </div>

      <ButtonWithSpinner id={SpinnerId.CardsGenerate} label={labels.submit} isBusy={generationInProgress} />
    </form>
  );
};

export default CardsGenerationForm;
