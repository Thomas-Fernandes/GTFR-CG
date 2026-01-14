import { useEffect, useState } from "react";

import ImgButton from "@/components/ImgButton/ImgButton";
import { SpinnerId } from "@/constants/spinners";
import { useAppContext } from "@/contexts";
import { useArtworkGenerationContext } from "@/pages/ArtworkGeneration/contexts";

import { handleSelectItunesImage } from "./handlers";
import { ItunesImageResultProps, ItunesResultsProps } from "./types";

import "./ItunesResults.scss";

const ItunesImageResult = ({ item, itemIdx }: ItunesImageResultProps) => {
  const { isProcessingLoading, setIsProcessingLoading, navigate } = useArtworkGenerationContext();

  const [isMounted, setIsMounted] = useState(false);

  const itemId = itemIdx + 1;
  const resultLabel = (item.collectionName || item.trackName).replace(" - Single", "");
  const [itemLabel, setItemLabel] = useState("");

  useEffect(() => {
    if (isMounted) return;
    setIsMounted(true);
  }, [isMounted]);

  return (
    <div className={`results--container--item ${isMounted ? "mounted" : ""}`}>
      <div className="results--container--item--content-wrapper">
        <ImgButton
          src={item.artworkUrl100}
          alt={resultLabel}
          onLoad={() => setItemLabel(`${item.artistName} - ${resultLabel}`)}
          onClick={() =>
            handleSelectItunesImage(item, itemId, { isProcessingLoading, setIsProcessingLoading, navigate })
          }
          overlayText={"Use this image"}
          className="results--container--item--content-wrapper--image"
        />
        <p className="results--container--item--content-wrapper--text">{itemLabel}</p>
      </div>

      <div
        id={`${SpinnerId.ItunesResult}${itemId}`}
        className={`results--container--item--spinner ${itemId <= 3 ? "mb-8" : ""}`}
      />
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
        {items.map((item, idx) => (
          <li key={idx}>
            <ItunesImageResult item={item} itemIdx={idx} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItunesResults;
