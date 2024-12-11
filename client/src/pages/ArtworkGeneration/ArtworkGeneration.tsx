import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "@/common/hooks/useTitle";

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

import "./ArtworkGeneration.css";

const ArtworkGeneration = (): JSX.Element => {
  useTitle(Title.ArtworkGeneration);

  const navigate = useNavigate();

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

      <ArtworkGenerationContext.Provider value={contextValue}>
        <h1>{"Search for cover artwork on iTunes"}</h1>
        <ItunesForm setItunesResults={setItunesResults} />
        <ItunesResults items={itunesResults} setItunesResults={setItunesResults} />

        <hr />

        <h1>{"Upload your image"}</h1>
        <FileUploadForm />

        <hr />

        <h1>{"Use a YouTube video thumbnail"}</h1>
        <YoutubeForm />
      </ArtworkGenerationContext.Provider>

      <TopBotSpacer />
    </div>
  );
};

export default ArtworkGeneration;