import { FormEvent, JSX, useState } from "react";
import { useNavigate } from "react-router-dom";

import { is2xxSuccessful, sendRequest } from "../../common/Requests";
import { hideSpinner, showSpinner } from "../../common/Spinner";
import { sendToast } from "../../common/Toast";
import { ApiResponse, FileUploadRequest, ItunesRequest, ItunesResponse, ItunesResult, YoutubeRequest } from "../../common/Types";
import useTitle from "../../common/UseTitle";
import { isFileExtensionAccepted } from "../../common/utils/FileUtils";

import FileUploader from "../../components/FileUploader";
import ImgButton from "../../components/ImgButton";

import { FILE_UPLOAD, ITUNES, YOUTUBE } from "../../constants/ArtworkGeneration";
import { TITLE } from "../../constants/Common";
import { API, BACKEND_URL, VIEW_PATHS } from "../../constants/Paths";
import { SPINNER_ID } from "../../constants/Spinner";
import { TOAST, TOAST_TYPE } from "../../constants/Toast";

import "./ArtworkGeneration.css";

const ArtworkGeneration = (): JSX.Element => {
  useTitle(TITLE.ARTWORK_GENERATION);

  const navigate = useNavigate();

  const [isProcessingLoading, setIsProcessingLoading] = useState(false);

  const [term, setTerm] = useState("");
  const [country, setCountry] = useState("fr");
  const [itunesResults, setItunesResults] = useState([] as ItunesResult[]);

  const [localFile, setLocalFile] = useState<File>();
  const [includeCenterArtwork, setIncludeCenterArtwork] = useState(true);

  const [youtubeUrl, setYoutubeUrl] = useState("");

  // iTunes search
  const handleSubmitItunesResult = (item: ItunesResult, key: number) => {
    if (isProcessingLoading) {
      sendToast(TOAST.PROCESSING_IN_PROGRESS, TOAST_TYPE.WARN);
      return;
    }

    const data = {
      url: item.artworkUrl100,
    };

    setIsProcessingLoading(true);
    const spinnerKey = SPINNER_ID.ITUNES_OPTION + key.toString();
    showSpinner(spinnerKey);

    sendRequest("POST", BACKEND_URL + API.ARTWORK_GENERATION.ITUNES, data).then((response: ApiResponse) => {
      if (!is2xxSuccessful(response.status)) {
        throw new Error(response.message);
      }

      sendRequest("POST", BACKEND_URL + API.PROCESSED_IMAGES.PROCESS_IMAGES).then(() => {
        navigate(VIEW_PATHS.processedImages);
      }).catch((error: ApiResponse) => {
        sendToast(error.message, TOAST_TYPE.ERROR);
      }).finally(() => {
        hideSpinner(spinnerKey);
        setIsProcessingLoading(false);
      });
    }).catch((error: ApiResponse) => {
      sendToast(error.message, TOAST_TYPE.ERROR);
      hideSpinner(spinnerKey);
      setIsProcessingLoading(false);
    });
  };

  const renderItunesResult = (item: ItunesResult, key: number): JSX.Element => {
    const resultLabel = (item.collectionName || item.trackName).replace(" - Single", "");

    return (
      <div className="result-item" key={"result" + key.toString()}>
        <ImgButton
          src={item.artworkUrl100} alt={resultLabel}
          onClick={() => handleSubmitItunesResult(item, key)}
          className="result-image"
        />
        <p className="result-text centered bold italic">{item.artistName} - {resultLabel}</p>
        <div className="flex-row" id={SPINNER_ID.ITUNES_OPTION + key.toString()} />
      </div>
    );
  };

  const getTitleWithAdjustedLength = (title: string): string => {
    title = title.slice(0, ITUNES.MAX_TITLE_LENGTH - 3);

    // find the first space before the max length to cut the string there
    let end = title[title.length - 1].endsWith(" ") ? title.length - 1 : title.lastIndexOf(" ", ITUNES.MAX_TITLE_LENGTH);

    // if the space-determined crop is too intense, just cut the string at the max length
    end = ITUNES.MAX_TITLE_LENGTH - end > ITUNES.MAX_CROP_LENGTH ? title.length : end;
    return title.slice(0, end) + "...";
  };
  const handleSubmitItunesSearch = (e: FormEvent<HTMLFormElement>, body: ItunesRequest) => {
    e.preventDefault();

    showSpinner(SPINNER_ID.ITUNES);

    const resultItems: ItunesResult[] = [];

    sendRequest("POST", BACKEND_URL + API.ARTWORK_GENERATION.ITUNES_SEARCH, body).then((response: ItunesResponse) => {
      if (!is2xxSuccessful(response.status)) {
        throw new Error(response.message);
      }

      if (response.data.resultCount > 0) {
        response.data.results.forEach((result) => {
          if (result.artistName?.length > ITUNES.MAX_TITLE_LENGTH)
            result.artistName = getTitleWithAdjustedLength(result.artistName);
          if (result.collectionName?.length > ITUNES.MAX_TITLE_LENGTH)
            result.collectionName = getTitleWithAdjustedLength(result.collectionName);
          resultItems.push({
            artistName: result.artistName,
            collectionName: result.collectionName,
            trackName: result.trackName,
            artworkUrl100: result.artworkUrl100.replace("100x100", "3000x3000"), // itunes max image size is 3000x3000
          });
        });
        setItunesResults(resultItems);
      } else {
        sendToast(TOAST.NO_RESULTS_FOUND, TOAST_TYPE.WARN);
      }
    }).catch((error: ApiResponse) => {
      setItunesResults(resultItems);
      sendToast(error.message, TOAST_TYPE.ERROR);
    }).finally(() => {
      hideSpinner(SPINNER_ID.ITUNES);
    });
  };

  // File upload
  const handleSubmitFileUpload = (e: FormEvent<HTMLFormElement>, body: FileUploadRequest) => {
    e.preventDefault();

    if (isProcessingLoading) {
      sendToast(TOAST.PROCESSING_IN_PROGRESS, TOAST_TYPE.WARN);
      return;
    }

    if (!body.localFile) {
      sendToast(TOAST.NO_IMG, TOAST_TYPE.WARN);
      return;
    }

    const formData = new FormData();
    formData.append("file", body.localFile);
    formData.append("includeCenterArtwork", body.includeCenterArtwork.toString());

    const fileExtensionIsAccepted = isFileExtensionAccepted(body.localFile.name, FILE_UPLOAD.ACCEPTED_IMG_EXTENSIONS);
    if (!fileExtensionIsAccepted) {
      sendToast(
        TOAST.INVALID_FILE_TYPE + "\n" +
          "Accepted file extensions: " + FILE_UPLOAD.ACCEPTED_IMG_EXTENSIONS.join(", ") + ".",
        TOAST_TYPE.ERROR
      );
      return;
    }

    setIsProcessingLoading(true);
    showSpinner(SPINNER_ID.FILE_UPLOAD);

    sendRequest("POST", BACKEND_URL + API.ARTWORK_GENERATION.FILE_UPLOAD, formData).then((response: ApiResponse) => {
      if (!is2xxSuccessful(response.status)) {
        throw new Error(response.message);
      }

      sendRequest("POST", BACKEND_URL + API.PROCESSED_IMAGES.PROCESS_IMAGES).then(() => {
        navigate(VIEW_PATHS.processedImages);
      }).catch((error: ApiResponse) => {
        sendToast(error.message, TOAST_TYPE.ERROR);
      }).finally(() => {
        hideSpinner(SPINNER_ID.FILE_UPLOAD);
        setIsProcessingLoading(false);
      });
    }).catch((error: ApiResponse) => {
      sendToast(error.message, TOAST_TYPE.ERROR);
      hideSpinner(SPINNER_ID.FILE_UPLOAD);
      setIsProcessingLoading(false);
    });
  };

  // YouTube thumbnail
  const isValidYoutubeUrl = (url: string): boolean => {
    return YOUTUBE.REGEX_YOUTUBE_URL.some((pattern: RegExp) => pattern.test(url));
  };
  const handleSubmitYoutubeUrl = (e: FormEvent<HTMLFormElement>, body: YoutubeRequest) => {
      e.preventDefault();

      if (isProcessingLoading) {
        sendToast(TOAST.PROCESSING_IN_PROGRESS, TOAST_TYPE.WARN);
        return;
      }

      if (!isValidYoutubeUrl(body.url)) {
        sendToast(TOAST.INVALID_URL, TOAST_TYPE.ERROR);
        return;
      }

      setIsProcessingLoading(true);
      showSpinner(SPINNER_ID.YOUTUBE_URL);

      sendRequest("POST", BACKEND_URL + API.ARTWORK_GENERATION.YOUTUBE_THUMBNAIL, body).then((response: ApiResponse) => {
        if (!is2xxSuccessful(response.status)) {
          throw new Error(response.message);
        }

        sendRequest("POST", BACKEND_URL + API.PROCESSED_IMAGES.PROCESS_IMAGES).then(() => {
          navigate(VIEW_PATHS.processedImages);
        }).catch((error: ApiResponse) => {
          sendToast(error.message, TOAST_TYPE.ERROR);
        }).finally(() => {
          hideSpinner(SPINNER_ID.YOUTUBE_URL);
          setIsProcessingLoading(false);
        });
      }).catch((error: ApiResponse) => {
        sendToast(error.message, TOAST_TYPE.ERROR);
        hideSpinner(SPINNER_ID.YOUTUBE_URL);
        setIsProcessingLoading(false);
      });
  };

  return (
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
      <form id="itunes" onSubmit={(e) => handleSubmitItunesSearch(e, {term, country})}>
        <div className="flexbox">
          <input id="itunes-text" type="text" placeholder="Search on iTunes"
            onChange={(e) => setTerm(e.target.value)}
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
        <div id="results" className="result-container">
          { itunesResults.map((item, key) => renderItunesResult(item, key)) }
        </div>
      </div>

      <hr />

      <h1>...or upload your image</h1>
      <form id="local" onSubmit={(e) => handleSubmitFileUpload(e, {localFile, includeCenterArtwork})} encType="multipart/form-data">
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
      <form id="youtube" onSubmit={(e) => handleSubmitYoutubeUrl(e, {url: youtubeUrl})}>
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
  );
};

export default ArtworkGeneration;