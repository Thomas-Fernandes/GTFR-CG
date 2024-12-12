import { useState } from "react";

import ImgButton from "@/components/ImgButton/ImgButton";
import { SpinnerId } from "@/constants/spinners";

import { useArtworkGenerationContext } from "./contexts";
import { handleSelectItunesImage } from "./handlers";
import { ItunesImageResultProps, ItunesResultsProps } from "./types";

import "./ItunesResults.scss";

const ItunesImageResult: React.FC<ItunesImageResultProps> = ({ item, itemId }): JSX.Element => {
  const { isProcessingLoading, setIsProcessingLoading, navigate } = useArtworkGenerationContext();

  const resultLabel = (item.collectionName || item.trackName).replace(" - Single", "");
  const [itemLabel, setItemLabel] = useState("");

  return (
    <div className="result-item">
      <ImgButton
        src={item.artworkUrl100} alt={resultLabel}
        onLoad={() => setItemLabel(`${item.artistName} - ${resultLabel}`)}
        onClick={() => handleSelectItunesImage(item, itemId, { isProcessingLoading, setIsProcessingLoading, navigate })}
        overlayText={"Use this image"}
        className="result-item--image"
      />
      <p className="result-item--text centered font-bold italic">
        {itemLabel}
      </p>

      <div className="mt-2" id={SpinnerId.ItunesResult + itemId.toString()} />
    </div>
  );
};

const ItunesResults: React.FC<ItunesResultsProps> = ({ items, setItunesResults }): JSX.Element => {
  return (
    <div className="results">
      { items.length > 0 &&
        <button id="clear" onClick={() => setItunesResults([])}>
          {"Clear results"}
        </button>
      }
      <div id="results" className="result-container">
        { items.map((item, index) => (
          <ItunesImageResult
            key={index} item={item} itemId={index}
          />
        ))}
      </div>
    </div>
  )
};

export default ItunesResults;