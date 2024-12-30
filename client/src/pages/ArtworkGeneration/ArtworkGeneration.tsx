import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "@/common/hooks/useTitle";
import { NavButtonSide } from "@/components/NavButton/constants";
import NavButton from "@/components/NavButton/NavButton";
import ToastContainer from "@/components/ToastContainer/ToastContainer";
import TopBotSpacer from "@/components/TopBotSpacer/TopBotSpacer";
import { Title } from "@/constants/browser";
import { ViewPaths } from "@/constants/paths";

import ArtgenOptionIndicator from "./components/ArtgenOptionIndicator/ArtgenOptionIndicator";
import { ARTWORK_GENERATION_OPTIONS, DEFAULT_GENERATION_OPTION_STATE } from "./constants";
import { ArtworkGenerationContext } from "./contexts";
import { handleOnMouseOver } from "./handlers";
import { ItunesResult } from "./types";

import "./ArtworkGeneration.scss";

const ArtworkGeneration = () => {
  useTitle(Title.ArtworkGeneration);
  const navigate = useNavigate();

  const [generationOptionState, setGenerationOptionState] = useState(DEFAULT_GENERATION_OPTION_STATE);

  const [isProcessingLoading, setIsProcessingLoading] = useState(false);
  const [itunesResults, setItunesResults] = useState([] as ItunesResult[]);

  const contextValue = useMemo(
    () => ({ isProcessingLoading, setIsProcessingLoading, navigate }), [isProcessingLoading, navigate]
  );

  return (
    <div id="artwork-generation">
      <ToastContainer />
      <TopBotSpacer />

      <div className="navbar">
        <NavButton to={ViewPaths.Home} label={Title.Home} side={NavButtonSide.Left} />
        <NavButton to={ViewPaths.Lyrics} label={Title.Lyrics} side={NavButtonSide.Right} />
        <NavButton to={ViewPaths.CardsGeneration} label={Title.CardsGeneration} side={NavButtonSide.Right} />
      </div>

        <div className="artwork-generation--options">
          <ArtgenOptionIndicator
            direction="prev"
            optionIdx={generationOptionState.current}
            label={generationOptionState.prevLabel}
          />

          { ARTWORK_GENERATION_OPTIONS.map(({ content, className }, i) => (
            <div key={i} className="artwork-generation--snapper" onMouseOver={() => handleOnMouseOver(i, setGenerationOptionState)}>
              <div className="artwork-generation--snapper--wrapper">
                <div className={`${className} ${(className.endsWith("--itunes") && itunesResults.length) ? "padded" : ""}`}>
                  <ArtworkGenerationContext.Provider value={contextValue}>
                    { className.endsWith("--itunes")
                    ? content(itunesResults, setItunesResults)
                    : content()
                    }
                  </ArtworkGenerationContext.Provider>
                </div>
              </div>
            </div>
          ))}

          <ArtgenOptionIndicator
            direction="next"
            optionIdx={generationOptionState.current}
            label={generationOptionState.nextLabel}
          />
        </div>

      <TopBotSpacer />
    </div>
  );
};

export default ArtworkGeneration;