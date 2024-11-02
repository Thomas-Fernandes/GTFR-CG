import { JSX, useState } from "react";

import { ItunesImageGalleryProps, ItunesImageResultProps } from "@pages/ArtworkGeneration/types";

import ImgButton from "@components/ImgButton/ImgButton";

import { SPINNER_ID } from "@constants/spinners";

import { useArtworkGenerationContext } from "./context";

import "./ItunesImageGallery.css";

const ItunesImageResult: React.FC<ItunesImageResultProps> = ({key, item, itemId, handleSubmitItunesImage}): JSX.Element => {
  const { isProcessingLoading, setIsProcessingLoading, navigate } = useArtworkGenerationContext();
  key?.toString(); // unused

  const resultLabel = (item.collectionName || item.trackName).replace(" - Single", "");
  const [itemLabel, setItemLabel] = useState("");

  return (
    <div className="result-item">
      <ImgButton
        src={item.artworkUrl100} alt={resultLabel}
        onLoad={() => setItemLabel(`${item.artistName} - ${resultLabel}`)}
        onClick={() => handleSubmitItunesImage(item, itemId, { isProcessingLoading, setIsProcessingLoading, navigate })}
        className="result-image"
      />
      <p className="result-text centered bold italic">{itemLabel}</p>
      <div className="flex-row" id={SPINNER_ID.ITUNES_OPTION + itemId.toString()} />
    </div>
  );
};

const ItunesImageGallery: React.FC<ItunesImageGalleryProps> = ({items, handleSubmitItunesImage}): JSX.Element => {
  return (
    <div id="results" className="result-container">
      { items.map((item, index) => (
        <ItunesImageResult
          key={index} item={item} itemId={index}
          handleSubmitItunesImage={handleSubmitItunesImage}
        />
      ))}
    </div>
  )
};

export default ItunesImageGallery;