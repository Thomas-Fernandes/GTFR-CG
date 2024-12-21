import { useDarkModeContext } from "@/common/hooks/useDarkMode/contexts";
import { ARTWORK_GENERATION_OPTIONS } from "@/pages/ArtworkGeneration/constants";

import { ArtgenOptionIndicatorProps } from "./types";

import "./ArtgenOptionIndicator.scss";

const ArtgenOptionIndicator = ({ direction, optionIdx, label }: ArtgenOptionIndicatorProps) => {
  const { isDarkMode } = useDarkModeContext();

  const isPrev = direction === "prev";
  const isEmpty = isPrev
    ? optionIdx === 0
    : optionIdx >= ARTWORK_GENERATION_OPTIONS.length + 1;
  const arrowImgSrc = isDarkMode === isPrev ? "/img/arrow__blue.png" : "/img/arrow__yellow.png";

  return (
    <h2 className={`artwork-generation--options--${direction} ${isEmpty ? "empty" : ""}`}>
      { !isEmpty && label &&
        <>
          <img src={arrowImgSrc} alt={`${direction}`} />
          <span>{`or... ${label}`}</span>
          <img src={arrowImgSrc} alt={`${direction}`} />
        </>
      }
    </h2>
  );
};

export default ArtgenOptionIndicator;