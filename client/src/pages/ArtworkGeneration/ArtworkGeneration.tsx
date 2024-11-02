import { JSX, useMemo, useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "@common/hooks/useTitle";
import { ItunesResult } from "@pages/ArtworkGeneration/types";

import FileUploader from "@components/FileUploader/FileUploader";
import NavButton from "@components/NavButton";
import ToastContainer from "@components/ToastContainer/ToastContainer";

import { TITLE } from "@constants/browser";
import { VIEW_PATHS } from "@constants/paths";
import { SPINNER_ID } from "@constants/spinners";

import ItunesImageGallery from "./ItunesImageGallery";
import { ArtworkGenerationContext } from "./contexts";
import { handleChangeTerm, handleSubmitFileUpload, handleSubmitItunesImage, handleSubmitItunesSearch, handleSubmitYoutubeUrl } from "./handlers";

import Checkbox from "@/components/Checkbox/Checkbox";
import "./ArtworkGeneration.css";

const ArtworkGeneration = (): JSX.Element => {
  useTitle(TITLE.ARTWORK_GENERATION);

  const navigate = useNavigate();

  const [isProcessingLoading, setIsProcessingLoading] = useState(false);

  const [term, setTerm] = useState("");
  const [country, setCountry] = useState("fr");
  const [, startItunesSearch] = useTransition();
  const [itunesResults, setItunesResults] = useState([] as ItunesResult[]);

  const [localFile, setLocalFile] = useState<File>();
  const [includeCenterArtwork, setIncludeCenterArtwork] = useState(true);

  const [youtubeUrl, setYoutubeUrl] = useState("");

  const contextValue = useMemo(
    () => ({ isProcessingLoading, setIsProcessingLoading, navigate }),
    [isProcessingLoading, setIsProcessingLoading, navigate]
  );

  return (
    <div id="artwork-generation">
      <ToastContainer />
      <span className="top-bot-spacer" />

      <div className="navbar">
        <NavButton to={VIEW_PATHS.home} label={TITLE.HOME} side="left" />
        <NavButton to={VIEW_PATHS.lyrics} label={TITLE.LYRICS} side="right" />
        <NavButton to={VIEW_PATHS.cardsGeneration} label={TITLE.CARDS_GENERATION} side="right" />
      </div>

      <ArtworkGenerationContext.Provider value={contextValue}>
        <h1>{"Search for cover artwork on iTunes"}</h1>
        <form id="itunes" onSubmit={(e) => handleSubmitItunesSearch(e, { term, country }, { setItunesResults })}>
          <div className="flexbox">
            <input id="itunes-text" type="text" placeholder="Search on iTunes"
              onChange={(e) => handleChangeTerm(e.target.value, country, { term, setTerm, startItunesSearch, setItunesResults })}
            />
            <div id={SPINNER_ID.ITUNES} className="itunes-search">
              <select aria-label="Country"
                defaultValue="fr" onChange={(e) => setCountry(e.target.value)}
              >
                <option value="fr">{"France"}</option>
                <option value="us">{"United States"}</option>
                <option value="nz">{"New Zealand"}</option>
              </select>
              <input type="submit" value="SEARCH" className="action-button" />
            </div>
          </div>
        </form>
        <div className="results">
          { itunesResults.length > 0 &&
            <button id="clear" onClick={() => setItunesResults([])}>Clear results</button>
          }
          <ItunesImageGallery items={itunesResults} handleSubmitItunesImage={handleSubmitItunesImage} />
        </div>

        <hr />

        <h1>{"Upload your image"}</h1>
        <form id="local" encType="multipart/form-data"
          onSubmit={(e) => handleSubmitFileUpload(e, { localFile, includeCenterArtwork }, { isProcessingLoading, setIsProcessingLoading, navigate })}
        >
          <div className="flexbox">
            <FileUploader id="background-image" label="Select background image" accept="image/*" setter={setLocalFile} />
            <Checkbox
              id="include_center_artwork" label="Include center artwork"
              defaultChecked={includeCenterArtwork}
              onChange={(e) => setIncludeCenterArtwork(e.target.checked)}
            />
            <div className="action-button" id={SPINNER_ID.FILE_UPLOAD}>
              <input type="submit" value="UPLOAD" className="action-button" />
            </div>
          </div>
        </form>

        <hr />

        <h1>{"Use a YouTube video thumbnail"}</h1>
        <form id="youtube" onSubmit={(e) => handleSubmitYoutubeUrl(e, { url: youtubeUrl }, { isProcessingLoading, setIsProcessingLoading, navigate })}>
          <div className="flexbox">
            <input type="text" placeholder="Paste YouTube video URL here"
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
            <div className="action-button" id={SPINNER_ID.YOUTUBE_URL}>
              <input type="submit" value="SEARCH" className="action-button" />
            </div>
          </div>
        </form>
      </ArtworkGenerationContext.Provider>

      <span className="top-bot-spacer" />
    </div>
  );
};

export default ArtworkGeneration;