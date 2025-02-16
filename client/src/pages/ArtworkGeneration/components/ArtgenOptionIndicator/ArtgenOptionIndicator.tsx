import { useDarkModeContext } from "@/common/hooks/useDarkMode/contexts";

import { ArtgenOptionIndicatorProps } from "./types";

import "./ArtgenOptionIndicator.scss";

const ArtgenOptionIndicator = ({ direction, optionIdx, optionsLength, label }: ArtgenOptionIndicatorProps) => {
  const { isDarkMode } = useDarkModeContext();

  const isPrev = direction === "prev";
  console.log("optionsLength", optionsLength);
  const hasNoIndicator = isPrev
    ? optionIdx === 0
    : optionIdx >= optionsLength + 1;
  const arrowImgSrc = isDarkMode === isPrev ? "/img/arrow__blue.png" : "/img/arrow__yellow.png";

  return (
    <h2 className={`artwork-generation--options--${direction} ${hasNoIndicator ? "empty" : ""}`}>
      { !hasNoIndicator && label &&
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