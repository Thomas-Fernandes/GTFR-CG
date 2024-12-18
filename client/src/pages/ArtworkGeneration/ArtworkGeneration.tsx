import { JSX, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "@/common/hooks/useTitle";
import { StateSetter } from "@/common/types";
import { NavButtonSide } from "@/components/NavButton/constants";
import NavButton from "@/components/NavButton/NavButton";
import ToastContainer from "@/components/ToastContainer/ToastContainer";
import TopBotSpacer from "@/components/TopBotSpacer/TopBotSpacer";
import { Title } from "@/constants/browser";
import { ViewPaths } from "@/constants/paths";

import { ArtworkGenerationContext } from "./contexts";
import FileUploadForm from "./FileUploadForm";
import ItunesForm from "./ItunesForm";
import ItunesResults from "./ItunesResults";
import { ItunesResult } from "./types";
import YoutubeForm from "./YoutubeForm";

import { useDarkModeContext } from "@/common/hooks/useDarkMode/contexts";
import "./ArtworkGeneration.scss";

type Section = {
  h1: string;
  content: (itunesResults?: ItunesResult[], setItunesResults?: StateSetter<ItunesResult[]>) => JSX.Element;
  className: string;
};
const sections: Section[] = [
  { h1: "Search for cover artwork on iTunes", className: "artwork-generation--options--itunes",
    content: (itunesResults, setItunesResults) => {
      return (
        <>
          <h1>
            {"Search for cover artwork on iTunes"}
          </h1>

          <ItunesForm setItunesResults={setItunesResults ?? (() => {})} />

          <ItunesResults items={itunesResults ?? []} setItunesResults={setItunesResults ?? (() => {})} />
        </>
      );
    }
  },
  { h1: "Upload your image", className: "artwork-generation--options--local",
    content: () => {
      return (
        <>
          <h1>
            {"Upload your image"}
          </h1>

          <FileUploadForm />
        </>
      );
    }
  },
  { h1: "Use a YouTube video thumbnail", className: "artwork-generation--options--youtube",
    content: () => {
      return (
        <>
          <h1>
            {"Use a YouTube video thumbnail"}
          </h1>

          <YoutubeForm />
        </>
      );
    }
  }
];

const ArtworkGeneration = () => {
  useTitle(Title.ArtworkGeneration);
  const { isDarkMode } = useDarkModeContext();
  const navigate = useNavigate();

  const [currentSection, setCurrentSection] = useState(0);

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
          <h2 className={`artwork-generation--options--prev ${currentSection !== 0 ? "" : "empty"}`}>
            { currentSection !== 0 && <img src={isDarkMode ? "/img/arrow__blue.png" : "/img/arrow__yellow.png"} alt="previous" /> }
            <span>{currentSection !== 0 ? `or... ${sections[currentSection - 1].h1}` : ""}</span>
            { currentSection !== 0 && <img src={isDarkMode ? "/img/arrow__blue.png" : "/img/arrow__yellow.png"} alt="previous" /> }
          </h2>
          { sections.map(({ content, className }, i) => (
            <div key={i} className="artwork-generation--snapper" onMouseOver={() => setCurrentSection(i)}>
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
          <h2 className={`artwork-generation--options--next ${currentSection < sections.length - 1 ? "" : "empty"}`}>
            { currentSection < sections.length - 1 && <img src={isDarkMode ? "/img/arrow__yellow.png" : "/img/arrow__blue.png"} alt="next" /> }
            <span>{currentSection < sections.length - 1 ? `or... ${sections[currentSection + 1].h1}` : ""}</span>
            { currentSection < sections.length - 1 && <img src={isDarkMode ? "/img/arrow__yellow.png" : "/img/arrow__blue.png"} alt="next" /> }
          </h2>
        </div>

      <TopBotSpacer />
    </div>
  );
};

export default ArtworkGeneration;