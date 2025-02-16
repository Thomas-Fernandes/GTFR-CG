import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "@/common/hooks/useTitle";
import { NavButtonSide } from "@/components/NavButton/constants";
import NavButton from "@/components/NavButton/NavButton";
import ToastContainer from "@/components/ToastContainer/ToastContainer";
import TopBotSpacer from "@/components/TopBotSpacer/TopBotSpacer";
import { ViewPaths } from "@/constants/paths";
import { useAppContext } from "@/contexts";

import ArtgenOptionIndicator from "./components/ArtgenOptionIndicator/ArtgenOptionIndicator";
import { DEFAULT_GENERATION_OPTION_STATE } from "./constants";
import { ArtworkGenerationContext } from "./contexts";
import { handleOnMouseOver } from "./handlers";
import { ArtworkGenerationOption, ItunesResult } from "./types";
import { getArtgenOptions } from "./utils";

import "./ArtworkGeneration.scss";

const ArtworkGeneration = () => {
  const { intl } = useAppContext();
  const navigate = useNavigate();

  useTitle(intl.formatMessage({ id: "pages.artgen.title" }));

  const generationOptions: ArtworkGenerationOption[] = getArtgenOptions(intl);
  const [generationOptionState, setGenerationOptionState] = useState(DEFAULT_GENERATION_OPTION_STATE);

  const [isProcessingLoading, setIsProcessingLoading] = useState(false);
  const [itunesResults, setItunesResults] = useState([] as ItunesResult[]);

  const contextValue = useMemo(
    () => ({ isProcessingLoading, setIsProcessingLoading, navigate }), [isProcessingLoading]
  );

  return (
    <div id="artwork-generation">
      <ToastContainer />
      <TopBotSpacer />

      <div className="navbar">
        <NavButton to={ViewPaths.Home} label={intl.formatMessage({ id: "pages.home.title" })} side={NavButtonSide.Left} />
        <NavButton to={ViewPaths.Lyrics} label={intl.formatMessage({ id: "pages.lyrics.title" })} side={NavButtonSide.Right} />
        <NavButton to={ViewPaths.CardsGeneration} label={intl.formatMessage({ id: "pages.cardgen.title" })} side={NavButtonSide.Right} />
      </div>

      <div className="artwork-generation--options">
        <ArtgenOptionIndicator
          direction="prev"
          optionIdx={generationOptionState.current}
          optionsLength={generationOptions.length}
          label={generationOptionState.prevLabel}
        />

        { generationOptions.map(({ content, className }, i) => (
          <div key={i} className="artwork-generation--snapper" onMouseOver={() => handleOnMouseOver(generationOptions, i, setGenerationOptionState)}>
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
          optionsLength={generationOptions.length}
          label={generationOptionState.nextLabel}
        />
      </div>

      <TopBotSpacer />
    </div>
  );
};

export default ArtworkGeneration;