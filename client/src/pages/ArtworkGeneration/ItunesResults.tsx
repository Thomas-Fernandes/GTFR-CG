import { JSX, useState } from "react";

import { ItunesImageResultProps, ItunesResultsProps } from "@pages/ArtworkGeneration/types";

import ImgButton from "@components/ImgButton/ImgButton";

import { SPINNER_ID } from "@constants/spinners";

import { useArtworkGenerationContext } from "./contexts";

import "./ItunesResults.css";

const ItunesImageResult: React.FC<ItunesImageResultProps> = ({ item, itemId, handleSelectItunesImage }): JSX.Element => {
  const { isProcessingLoading, setIsProcessingLoading, navigate } = useArtworkGenerationContext();

  const resultLabel = (item.collectionName || item.trackName).replace(" - Single", "");
  const [itemLabel, setItemLabel] = useState("");

  return (
    <div className="result-item">
      <ImgButton
        src={item.artworkUrl100} alt={resultLabel}
        onLoad={() => setItemLabel(`${item.artistName} - ${resultLabel}`)}
        onClick={() => handleSelectItunesImage(item, itemId, { isProcessingLoading, setIsProcessingLoading, navigate })}
        className="result-image"
      />
      <p className="result-text centered bold italic">{itemLabel}</p>
      <div className="flex-row" id={SPINNER_ID.ITUNES_OPTION + itemId.toString()} />
    </div>
  );
};

const ItunesResults: React.FC<ItunesResultsProps> = ({ items, setItunesResults, handleSelectItunesImage }): JSX.Element => {
  return (
    <div className="results">
      { items.length > 0 &&
        <button id="clear" onClick={() => setItunesResults([])}>Clear results</button>
      }
      <div id="results" className="result-container">
        { items.map((item, index) => (
          <ItunesImageResult
            key={index} item={item} itemId={index}
            handleSelectItunesImage={handleSelectItunesImage}
          />
        ))}
      </div>
    </div>
  )
};

export default ItunesResults;