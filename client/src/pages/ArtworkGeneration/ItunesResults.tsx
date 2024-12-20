import { useEffect, useState } from "react";

import ImgButton from "@/components/ImgButton/ImgButton";
import { SpinnerId } from "@/constants/spinners";

import { useArtworkGenerationContext } from "./contexts";
import { handleSelectItunesImage } from "./handlers";
import { ItunesImageResultProps, ItunesResultsProps } from "./types";

import "./ItunesResults.scss";

const ItunesImageResult: React.FC<ItunesImageResultProps> = ({ item, itemId }) => {
  const { isProcessingLoading, setIsProcessingLoading, navigate } = useArtworkGenerationContext();

  const [isMounted, setIsMounted] = useState(false);

  const resultLabel = (item.collectionName || item.trackName).replace(" - Single", "");
  const [itemLabel, setItemLabel] = useState("");

  useEffect(() => {
    if (isMounted) return;
    setIsMounted(true);
  }, [isMounted]);

  return (
    <div className={`results--container--item ${isMounted ? "mounted" : ""}`}>
      <ImgButton
        src={item.artworkUrl100} alt={resultLabel}
        onLoad={() => setItemLabel(`${item.artistName} - ${resultLabel}`)}
        onClick={() => handleSelectItunesImage(item, itemId, { isProcessingLoading, setIsProcessingLoading, navigate })}
        overlayText={"Use this image"}
        className="results--container--item--image"
      />
      <p className="results--container--item--text">
        {itemLabel}
      </p>

      <div className="mt-2" id={SpinnerId.ItunesResult + itemId.toString()} />
    </div>
  );
};

const ItunesResults: React.FC<ItunesResultsProps> = ({ items, setItunesResults }) => {
  return (
    <div className="results">
      { items.length > 0 &&
        <button id="clear" className="small mac !mb-4" onClick={() => setItunesResults([])}>
          {"Clear results"}
        </button>
      }
      <ul id="results" className="results--container">
        { items.map((item, index) => (
          <li key={index}>
            <ItunesImageResult item={item} itemId={index} />
          </li>
        ))}
      </ul>
    </div>
  )
};

export default ItunesResults;