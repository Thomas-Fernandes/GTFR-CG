import { useEffect, useState } from "react";

import ImgButton from "@/components/ImgButton/ImgButton";
import { SpinnerId } from "@/constants/spinners";
import { useAppContext } from "@/contexts";
import { useArtworkGenerationContext } from "@/pages/ArtworkGeneration/contexts";

import { handleSelectItunesImage } from "./handlers";
import { ItunesImageResultProps, ItunesResultsProps } from "./types";

import "./ItunesResults.scss";

const ItunesImageResult = ({ item, itemId }: ItunesImageResultProps) => {
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
        src={item.artworkUrl100}
        alt={resultLabel}
        onLoad={() => setItemLabel(`${item.artistName} - ${resultLabel}`)}
        onClick={() =>
          handleSelectItunesImage(item, itemId + 1, { isProcessingLoading, setIsProcessingLoading, navigate })
        }
        overlayText={"Use this image"}
        className="results--container--item--image"
      />
      <p className="results--container--item--text">{itemLabel}</p>

      <div id={`${SpinnerId.ItunesResult}${itemId + 1}`} className="mt-2" />
    </div>
  );
};

const ItunesResults = ({ items, setItunesResults }: ItunesResultsProps) => {
  const { intl } = useAppContext();
  const labels = {
    clearLabel: intl.formatMessage({ id: "pages.artgen.itunes.clear" }),
  };

  return (
    <div className="results">
      {items.length > 0 && (
        <button id="clear" onClick={() => setItunesResults([])} className="small mac !mb-4">
          {labels.clearLabel}
        </button>
      )}
      <ul id="results" className="results--container">
        {items.map((item, index) => (
          <li key={index}>
            <ItunesImageResult item={item} itemId={index} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItunesResults;
