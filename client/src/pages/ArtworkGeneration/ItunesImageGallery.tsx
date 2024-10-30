import { JSX, useState } from "react";

import { ItunesResult } from "../../common/Types";

import ImgButton from "../../components/ImgButton";

import { SPINNER_ID } from "../../constants/Spinner";

import "./ArtworkGeneration.css";

type ItunesImageResultProps = {
  item: ItunesResult;
  key?: number;
  itemId: number;
  handleSubmitItunesResult: (item: ItunesResult, key: number) => void;
};

const ItunesImageResult: React.FC<ItunesImageResultProps> = ({item, key, itemId, handleSubmitItunesResult}): JSX.Element => {
  const resultLabel = (item.collectionName || item.trackName).replace(" - Single", "");
  const [itemLabel, setItemLabel] = useState("");
  key?.toString(); // unused

  return (
    <div className="result-item">
      <ImgButton
        src={item.artworkUrl100} alt={resultLabel}
        onLoad={() => setItemLabel(`${item.artistName} - ${resultLabel}`)}
        onClick={() => handleSubmitItunesResult(item, itemId)}
        className="result-image"
      />
      <p className="result-text centered bold italic">{itemLabel}</p>
      <div className="flex-row" id={SPINNER_ID.ITUNES_OPTION + itemId.toString()} />
    </div>
  );
};

type ItunesImageGalleryProps = {
  items: ItunesResult[];
  handleSubmitItunesResult: (item: ItunesResult, key: number) => void;
};

const ItunesImageGallery: React.FC<ItunesImageGalleryProps> = ({items, handleSubmitItunesResult}): JSX.Element => {
  return (
    <div id="results" className="result-container">
      { items.map((item, index) => (
        <ItunesImageResult
          item={item} key={index} itemId={index}
          handleSubmitItunesResult={handleSubmitItunesResult}
        />
      ))}
    </div>
  )
};

export default ItunesImageGallery;