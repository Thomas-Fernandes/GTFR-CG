import { JSX, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "@common/hooks/useTitle";
import { ItunesResult } from "@pages/ArtworkGeneration/types";

import NavButton from "@components/NavButton";
import ToastContainer from "@components/ToastContainer/ToastContainer";

import { TITLE } from "@constants/browser";
import { VIEW_PATHS } from "@constants/paths";

import FileUploadForm from "./FileUploadForm";
import ItunesForm from "./ItunesForm";
import ItunesResults from "./ItunesResults";
import YoutubeForm from "./YoutubeForm";
import { ArtworkGenerationContext } from "./contexts";

import "./ArtworkGeneration.css";

const ArtworkGeneration = (): JSX.Element => {
  useTitle(TITLE.ARTWORK_GENERATION);

  const navigate = useNavigate();

  const [isProcessingLoading, setIsProcessingLoading] = useState(false);

  const [itunesResults, setItunesResults] = useState([] as ItunesResult[]);

  const contextValue = useMemo(
    () => ({ isProcessingLoading, setIsProcessingLoading, navigate }),
    [isProcessingLoading, setIsProcessingLoading, navigate]
  );

  return (
    <div id="artwork-generation">
      <ToastContainer />
      <span className="top-bot-spacer" />

      <div className="navbar">
        <NavButton to={VIEW_PATHS.HOME} label={TITLE.HOME} side="left" />
        <NavButton to={VIEW_PATHS.LYRICS} label={TITLE.LYRICS} side="right" />
        <NavButton to={VIEW_PATHS.CARDS_GENERATION} label={TITLE.CARDS_GENERATION} side="right" />
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

      <span className="top-bot-spacer" />
    </div>
  );
};

export default ArtworkGeneration;