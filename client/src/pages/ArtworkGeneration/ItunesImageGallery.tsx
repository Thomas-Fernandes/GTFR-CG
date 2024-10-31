import { JSX, useState } from "react";
import { NavigateFunction } from "react-router-dom";

import { ItunesResult } from "../../common/Types";

import ImgButton from "../../components/ImgButton";

import { SPINNER_ID } from "../../constants/Spinner";

import { StateHook } from "./handlers";

import "./ArtworkGeneration.css";

type ItunesImageResultProps = {
  key?: number;
  item: ItunesResult;
  itemId: number;
  processingLoadingState: StateHook<boolean>;
  navigate: NavigateFunction;
  handleSubmitItunesResult: (item: ItunesResult, idx: number, processingLoadingState: StateHook<boolean>, navigate: NavigateFunction) => void;
};

const ItunesImageResult: React.FC<ItunesImageResultProps> = ({key, item, itemId, processingLoadingState, navigate, handleSubmitItunesResult}): JSX.Element => {
  const resultLabel = (item.collectionName || item.trackName).replace(" - Single", "");
  const [itemLabel, setItemLabel] = useState("");
  key?.toString(); // unused

  return (
    <div className="result-item">
      <ImgButton
        src={item.artworkUrl100} alt={resultLabel}
        onLoad={() => setItemLabel(`${item.artistName} - ${resultLabel}`)}
        onClick={() => handleSubmitItunesResult(item, itemId, processingLoadingState, navigate)}
        className="result-image"
      />
      <p className="result-text centered bold italic">{itemLabel}</p>
      <div className="flex-row" id={SPINNER_ID.ITUNES_OPTION + itemId.toString()} />
    </div>
  );
};

type ItunesImageGalleryProps = {
  items: ItunesResult[];
  processingLoadingState: StateHook<boolean>;
  navigate: NavigateFunction;
  handleSubmitItunesResult: (item: ItunesResult, idx: number, processingLoadingState: StateHook<boolean>, navigate: NavigateFunction) => void;
};

const ItunesImageGallery: React.FC<ItunesImageGalleryProps> = ({items, processingLoadingState, navigate, handleSubmitItunesResult}): JSX.Element => {
  return (
    <div id="results" className="result-container">
      { items.map((item, index) => (
        <ItunesImageResult key={index}
          item={item} itemId={index}
          processingLoadingState={processingLoadingState} navigate={navigate} handleSubmitItunesResult={handleSubmitItunesResult}
        />
      ))}
    </div>
  )
};

export default ItunesImageGallery;