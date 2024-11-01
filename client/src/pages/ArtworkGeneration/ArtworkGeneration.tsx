import { JSX, useMemo, useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";

import { ItunesResult } from "../../common/Types";
import useTitle from "../../common/UseTitle";

import FileUploader from "../../components/FileUploader";

import { TITLE } from "../../constants/Common";
import { VIEW_PATHS } from "../../constants/Paths";
import { SPINNER_ID } from "../../constants/Spinner";

import ItunesImageGallery from "./ItunesImageGallery";
import { ArtworkGenerationContext } from "./context";
import { handleChangeTerm, handleSubmitFileUpload, handleSubmitItunesImage, handleSubmitItunesSearch, handleSubmitYoutubeUrl } from "./handlers";

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

  const contextValue = useMemo(() => ({ isProcessingLoading, setIsProcessingLoading, navigate }), [isProcessingLoading, setIsProcessingLoading, navigate]);

  return (
    <ArtworkGenerationContext.Provider value={contextValue}>
    <div id="artwork-generation">
      <div id="toast-container"></div>
      <span className="top-bot-spacer" />

      <div className="navbar">
        <button type="button" onClick={() => navigate(VIEW_PATHS.home)}>
          <span className="left">{TITLE.HOME}</span>
        </button>
        <button type="button" onClick={() => navigate(VIEW_PATHS.lyrics)}>
          <span className="right">{TITLE.LYRICS}</span>
        </button>
        <button type="button" onClick={() => navigate(VIEW_PATHS.cardsGeneration)}>
          <span className="right">{TITLE.CARDS_GENERATION}</span>
        </button>
      </div>

      <h1>Search for cover art on iTunes</h1>
      <form id="itunes" onSubmit={(e) => handleSubmitItunesSearch(e, {term, country}, setItunesResults)}>
        <div className="flexbox">
          <input id="itunes-text" type="text" placeholder="Search on iTunes"
            onChange={(e) => handleChangeTerm(e.target.value, country, setTerm, startItunesSearch, setItunesResults)}
          />
          <div id={SPINNER_ID.ITUNES} className="itunes-search">
            <select aria-label="Country"
              defaultValue="fr" onChange={(e) => setCountry(e.target.value)}
            >
              <option value="fr">France</option>
              <option value="us">United States</option>
              <option value="nz">New Zealand</option>
            </select>
            <input type="submit" value="SEARCH" className="action-button" />
          </div>
        </div>
      </form>
      <div className="results">
        { itunesResults.length > 0 &&
          <button id="clear" onClick={() => setItunesResults([])}>Clear results</button>
        }
        <ItunesImageGallery items={itunesResults} handleSubmitItunesResult={handleSubmitItunesImage} />
      </div>

      <hr />

      <h1>...or upload your image</h1>
      <form id="local" onSubmit={(e) => handleSubmitFileUpload(e, {localFile, includeCenterArtwork}, [isProcessingLoading, setIsProcessingLoading], navigate)} encType="multipart/form-data">
        <div className="flexbox">
          <FileUploader id="background-image" label="Select background image" accept="image/*" setter={setLocalFile} />
          <label className="checkbox" htmlFor="include_center_artwork">
            <input
              type="checkbox" name="include_center_artwork" id="include_center_artwork" defaultChecked
              onChange={(e) => setIncludeCenterArtwork(e.target.checked)}
            />
            <p className="checkbox-label italic">Include center artwork</p>
          </label>
          <div className="action-button" id={SPINNER_ID.FILE_UPLOAD}>
            <input type="submit" value="UPLOAD" className="action-button" />
          </div>
        </div>
      </form>

      <hr />

      <h1>...or use a YouTube video thumbnail</h1>
      <form id="youtube" onSubmit={(e) => handleSubmitYoutubeUrl(e, {url: youtubeUrl}, [isProcessingLoading, setIsProcessingLoading], navigate)}>
        <div className="flexbox">
          <input type="text" placeholder="Paste YouTube video URL here"
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
          <div className="action-button" id={SPINNER_ID.YOUTUBE_URL}>
            <input type="submit" value="SEARCH" className="action-button" />
          </div>
        </div>
      </form>

      <span className="top-bot-spacer" />
    </div>
    </ArtworkGenerationContext.Provider>
  );
};

export default ArtworkGeneration;