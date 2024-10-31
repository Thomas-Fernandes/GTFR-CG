import { JSX, useState } from "react";
import { NavigateFunction } from "react-router-dom";

import { ItunesResult } from "../../common/Types";

import ImgButton from "../../components/ImgButton";

import { SPINNER_ID } from "../../constants/Spinner";

import "./ArtworkGeneration.css";
import { useArtworkGenerationContext } from "./context";
import { StateHook } from "./handlers";

type ItunesImageResultProps = {
  key?: number;
  item: ItunesResult;
  itemId: number;
  handleSubmitItunesResult: (item: ItunesResult, idx: number, processingLoadingState: StateHook<boolean>, navigate: NavigateFunction) => void;
};

const ItunesImageResult: React.FC<ItunesImageResultProps> = ({key, item, itemId, handleSubmitItunesResult}): JSX.Element => {
  const { isProcessingLoading, setIsProcessingLoading, navigate } = useArtworkGenerationContext();
  const processLoadingState = [isProcessingLoading, setIsProcessingLoading] as StateHook<boolean>;

  const resultLabel = (item.collectionName || item.trackName).replace(" - Single", "");
  const [itemLabel, setItemLabel] = useState("");
  key?.toString(); // unused

  return (
    <div className="result-item">
      <ImgButton
        src={item.artworkUrl100} alt={resultLabel}
        onLoad={() => setItemLabel(`${item.artistName} - ${resultLabel}`)}
        onClick={() => handleSubmitItunesResult(item, itemId, processLoadingState, navigate)}
        className="result-image"
      />
      <p className="result-text centered bold italic">{itemLabel}</p>
      <div className="flex-row" id={SPINNER_ID.ITUNES_OPTION + itemId.toString()} />
    </div>
  );
};

type ItunesImageGalleryProps = {
  items: ItunesResult[];
  handleSubmitItunesResult: (item: ItunesResult, idx: number, processingLoadingState: StateHook<boolean>, navigate: NavigateFunction) => void;
};

const ItunesImageGallery: React.FC<ItunesImageGalleryProps> = ({items, handleSubmitItunesResult}): JSX.Element => {
  return (
    <div id="results" className="result-container">
      { items.map((item, index) => (
        <ItunesImageResult
          key={index} item={item} itemId={index}
          handleSubmitItunesResult={handleSubmitItunesResult}
        />
      ))}
    </div>
  )
};

export default ItunesImageGallery;