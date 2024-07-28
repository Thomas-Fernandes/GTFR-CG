import { FormEvent, JSX, useState } from "react";

import { is2xxSuccessful, objectToQueryString, sendRequest } from "../../common/Requests";
import { hideSpinner, showSpinner } from "../../common/Spinner";
import { sendToast } from "../../common/Toast";
import { ApiResponse, FileUploadRequest, ItunesRequest, ItunesResponse, ItunesResult, StateSetter, YoutubeRequest } from "../../common/Types";
import useTitle from "../../common/UseTitle";
import { FILE_UPLOAD, ITUNES, YOUTUBE } from "../../constants/ArtworkGeneration";
import { BACKEND_URL, ITUNES_URL, PATHS, SPINNER_ID, TITLE, TOAST, TOAST_TYPE } from "../../constants/Common";

import "./ArtworkGeneration.css";

const renderItunesResult = (item: ItunesResult, key: number): JSX.Element => {
  return (
    <div className="result-item" key={"result" + key.toString()}>
      <img src={item.artworkUrl100} className="result-image" alt={item.collectionName || item.trackName} />
      <p className="centered bold italic">{item.artistName} - {item.collectionName.replace(" - Single", "")}</p>
      <button onClick={() => {
        const data = {
          url: item.artworkUrl100,
        };
        sendRequest("POST", BACKEND_URL + "/artwork-generation/use-itunes-image", data).then((response: ApiResponse) => {
          if (is2xxSuccessful(response.status)) {
            sendToast(response.message, TOAST_TYPE.SUCCESS);
            // window.location.href = PATHS.processedImages;
          } else {
            throw new Error(response.message);
          }
        }).catch((error: ApiResponse) => {
          sendToast(error.message, TOAST_TYPE.ERROR);
        });
      }}>Use this image</button>
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
const handleSubmitItunesSearch = async (e: FormEvent<HTMLFormElement>, body: ItunesRequest, setItunesResults: StateSetter<ItunesResult[]>) => {
  e.preventDefault();

  showSpinner(SPINNER_ID.ITUNES);

  const data = {
    ...body,
    entity: body.entity ?? "album", // album by default, but can be "song", "movie", "tv-show"...
    limit: body.limit ?? 6,
  };
  const queryString = objectToQueryString(data);

  const resultItems: ItunesResult[] = [];
  sendRequest("POST", ITUNES_URL + "/search" + queryString).then((result: ItunesResponse) => {
    if (!is2xxSuccessful(result.status)) {
      throw new Error(result.message);
    }

    if (result.data.resultCount > 0) {
      result.data.results.forEach((result) => {
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

const isFileExtensionAccepted = (fileName: string, acceptedExtensions: string[]): boolean => {
  return acceptedExtensions.includes(fileName.split(".").slice(-1)[0].toLowerCase());
}
const handleSubmitFileUpload = async (e: FormEvent<HTMLFormElement>, body: FileUploadRequest) => {
  e.preventDefault();

  if (!body.file) {
    sendToast(TOAST.NO_IMG, TOAST_TYPE.WARN);
    return;
  }

  const data = {
    ...body,
    file: new FormData(e.currentTarget).get("file") as File,
  };

  const fileExtensionIsAccepted = isFileExtensionAccepted(data.file.name, FILE_UPLOAD.ACCEPTED_IMG_EXTENSIONS);
  if (!fileExtensionIsAccepted) {
    sendToast(
      TOAST.INVALID_FILE_TYPE + "\n" +
        "Accepted file extensions: " + FILE_UPLOAD.ACCEPTED_IMG_EXTENSIONS.join(", ") + ".",
      TOAST_TYPE.ERROR
    );
    return;
  }

  showSpinner(SPINNER_ID.FILE_UPLOAD);

  sendRequest("POST", BACKEND_URL + "/artwork-generation/use-local-image", data).then((response: ApiResponse) => {
    if (!is2xxSuccessful(response.status)) {
      throw new Error(response.message);
    }

    // window.location.href = PATHS.processedImages;
  }).catch((error: ApiResponse) => {
    sendToast(error.message, TOAST_TYPE.ERROR);
  }).finally(() => {
    hideSpinner(SPINNER_ID.FILE_UPLOAD);
  });
};

const isValidYoutubeUrl = (url: string): boolean => {
  return YOUTUBE.REGEX_YOUTUBE_URL.some((pattern: RegExp) => pattern.test(url));
}
const handleSubmitYoutubeUrl = async (e: FormEvent<HTMLFormElement>, body: YoutubeRequest) => {
    e.preventDefault();

    if (!isValidYoutubeUrl(body.url)) {
       sendToast(TOAST.INVALID_URL, TOAST_TYPE.ERROR);
       return;
    }

    showSpinner(SPINNER_ID.YOUTUBE_URL);

    sendRequest("POST", BACKEND_URL + "/artwork-generation/use-youtube-thumbnail", body).then((response: ApiResponse) => {
      if (!is2xxSuccessful(response.status)) {
        throw new Error(response.message);
      }

      // window.location.href = PATHS.processedImages;
    }).catch((error: ApiResponse) => {
      sendToast(error.message, TOAST_TYPE.ERROR);
    }).finally(() => {
      hideSpinner(SPINNER_ID.YOUTUBE_URL);
    });
};

const ArtworkGeneration = (): JSX.Element => {
  // iTunes search
  const [term, setTerm] = useState("");
  const [country, setCountry] = useState("fr");
  const [itunesResults, setItunesResults] = useState([] as ItunesResult[]);

  // File upload
  const [file, setFile] = useState<File>();
  const [includeCenterArtwork, setIncludeCenterArtwork] = useState(true);

  // YouTube thumbnail
  const [youtubeUrl, setYoutubeUrl] = useState("");

  useTitle(TITLE.ARTWORK_GENERATION);

  return (
    <>
      <div id="toast-container"></div>
      <span className="top-bot-spacer" />

      <div className="navbar">
        <button type="button" onClick={() => window.location.href = PATHS.home }>
          <span className="left">{TITLE.HOME}</span>
        </button>
        <button type="button" onClick={() => window.location.href = PATHS.lyrics }>
          <span className="right">{TITLE.LYRICS}</span>
        </button>
      </div>

      <h1>Search for cover art on iTunes</h1>
      <form onSubmit={(e) => handleSubmitItunesSearch(e, {term, country}, setItunesResults)}>
        <div className="flexbox">
          <input type="text" placeholder="Search on iTunes"
            onChange={(e) => setTerm(e.target.value)}
          />
          <select aria-label="Country"
            defaultValue="fr" onChange={(e) => setCountry(e.target.value)}
          >
            <option value="fr">France</option>
            <option value="us">United States</option>
            <option value="nz">New Zealand</option>
          </select>
          <div className="action-button" id={SPINNER_ID.ITUNES}>
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
      <form onSubmit={(e) => handleSubmitFileUpload(e, {file, includeCenterArtwork})} encType="multipart/form-data">
        <div className="flexbox">
          <input type="file" name="file" className="file"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : undefined)}
          />
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
      <form onSubmit={(e) => handleSubmitYoutubeUrl(e, {url: youtubeUrl})}>
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
    </>
  );
};

export default ArtworkGeneration;