import { FormEvent, useState } from "react";

import { PATHS, ACCEPTED_IMG_EXTENSIONS, REGEX_YOUTUBE_URL, RESPONSE_STATUS, TITLE, TOAST_TYPE, ARTWORK_GENERATION, RESPONSE, SPINNER_ID } from "../../common/Constants";
import { objectToQueryString, sendRequest } from "../../common/Requests";
import { hideSpinner, showSpinner } from "../../common/Spinner";
import { sendToast } from "../../common/Toast";
import { ApiResponse, FileUploadQuery, ItunesQuery, ItunesResponse, ItunesResult, UseStateSetter, YoutubeQuery } from "../../common/Types";
import useTitle from "../../common/UseTitle";

import "./ArtworkGeneration.css";

const getTitleWithAdjustedLength = (title: string): string => {
  title = title.slice(0, ARTWORK_GENERATION.MAX_TITLE_LENGTH - 3);

  // find the first space before the max length to cut the string there
  let end = title[title.length - 1].endsWith(" ") ? title.length - 1 : title.lastIndexOf(" ", ARTWORK_GENERATION.MAX_TITLE_LENGTH);

  // if the space-determined crop is too intense, just cut the string at the max length
  end = ARTWORK_GENERATION.MAX_TITLE_LENGTH - end > ARTWORK_GENERATION.MAX_CROP_LENGTH ? title.length : end;
  return title.slice(0, end) + "...";
};

const isValidYoutubeUrl = (url: string): boolean => {
    return REGEX_YOUTUBE_URL.some((pattern) => pattern.test(url));
}

const handleSubmitItunesSearch = async (e: FormEvent<HTMLFormElement>, body: ItunesQuery, setItunesResults: UseStateSetter<Array<ItunesResult>>) => {
  e.preventDefault();

  showSpinner(SPINNER_ID.ITUNES);

  const data = {
    term: body.term,
    entity: body.entity ?? "album", // album by default, but can be "song", "movie", "tv-show"...
    country: body.country,
    limit: body.limit ?? 6,
  };
  const queryString = objectToQueryString(data);
  const resultItems: Array<ItunesResult> = [];

  sendRequest("POST", "https://itunes.apple.com/search" + queryString).then((result: ItunesResponse) => {
    if (result.resultCount > 0) {
      result.results.forEach((result) => {
        if (result.artistName?.length > ARTWORK_GENERATION.MAX_TITLE_LENGTH)
          result.artistName = getTitleWithAdjustedLength(result.artistName);
        if (result.collectionName?.length > ARTWORK_GENERATION.MAX_TITLE_LENGTH)
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
      sendToast(RESPONSE.WARN.NO_RESULTS_FOUND, TOAST_TYPE.WARN);
    }
  }).catch((error: ApiResponse) => {
    setItunesResults(resultItems);
    sendToast(error.message, TOAST_TYPE.ERROR);
  }).finally(() => {
    hideSpinner(SPINNER_ID.ITUNES);
  });
};

const handleSubmitFileUpload = async (e: FormEvent<HTMLFormElement>, body: FileUploadQuery) => {
  e.preventDefault();

  if (!body.file) {
    sendToast(RESPONSE.WARN.NO_IMG, TOAST_TYPE.WARN);
  }

  const fileHasAcceptedExtension =
    ACCEPTED_IMG_EXTENSIONS.includes($("#file")[0].files[0].name.split(".").slice(-1)[0].toLowerCase());
  if (!fileHasAcceptedExtension) {
    hideSpinner("artwork-generation_file-upload");
    sendToast(
      "Please select a valid image file.\n" +
        "Accepted file extensions: " + ACCEPTED_IMG_EXTENSIONS.join(", ") + ".",
      TOAST_TYPE.ERROR
    );
    return;
  }

  showSpinner(SPINNER_ID.FILE_UPLOAD);

  const data = new FormData(body.file);

  sendRequest("POST", "/artwork-generation/use-local-image", data).then((response: ApiResponse) => {
    if (response.status === RESPONSE_STATUS.SUCCESS) {
      // window.location.href = PATHS.processedImages;
    } else {
      sendToast(response.message, TOAST_TYPE.ERROR);
    }
  }).catch((error: ApiResponse) => {
    sendToast(error.message, TOAST_TYPE.ERROR);
  }).finally(() => {
    hideSpinner(SPINNER_ID.FILE_UPLOAD);
  });

  $.ajax({
    data: new FormData($("#fileUpload")[0]),
    processData: false,
    contentType: false,
    success: (response: ApiResponse) => {
    },
  });
};

const handleSubmitYoutubeUrl = async (e: FormEvent<HTMLFormElement>, body: YoutubeQuery) => {
    e.preventDefault();

    if (!isValidYoutubeUrl(body.url)) {
       sendToast(RESPONSE.ERROR.INVALID_URL, TOAST_TYPE.ERROR);
       return;
    }

    showSpinner(SPINNER_ID.YOUTUBE_URL);

    const data = {
      url: body.url,
    };

    sendRequest("POST", "/artwork-generation/use-youtube-thumbnail", data).then((response: ApiResponse) => {
      if (response.status === RESPONSE_STATUS.SUCCESS) {
        // window.location.href = PATHS.processedImages;
      } else {
        sendToast(response.message, TOAST_TYPE.ERROR);
      }
    }).catch((error: ApiResponse) => {
      sendToast(error.message, TOAST_TYPE.ERROR);
    }).finally(() => {
      hideSpinner(SPINNER_ID.YOUTUBE_URL);
    });
};

const ArtworkGeneration = (): React.JSX.Element => {
  // iTunes search
  const [term, setTerm] = useState("");
  const [country, setCountry] = useState("fr");
  const [itunesResults, setItunesResults] = useState([] as Array<ItunesResult>);

  // File upload
  const [file, setFile] = useState<File>();
  const [includeCenterArtwork, setIncludeCenterArtwork] = useState(true);

  // YouTube thumbnail
  const [youtubeUrl, setYoutubeUrl] = useState("");

  useTitle(TITLE.ARTWORK_GENERATION);

  return (
    <>
      <div id="toast-container"></div>
      <span className="top-bot-spacer"></span>
      <div className="navbar">
        <button type="button"
          onClick={() => window.location.href = PATHS.home }
        >
          <span className="left">Home</span>
        </button>
      </div>
      <h1>Search for cover art on iTunes</h1>
      <form onSubmit={(e) => handleSubmitItunesSearch(e, {term: term, country: country}, setItunesResults)}>
        <div className="flexbox">
          <input type="text" name="query" id="query" placeholder="Search on iTunes" onChange={(e) => setTerm(e.target.value)} />
          <select name="country" id="country" aria-label="Country" defaultValue="fr" onChange={(e) => setCountry(e.target.value)}>
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
          <button className="warn minimal centered" onClick={() => setItunesResults([])}>Clear results</button>
        }
        <div id="results" className="result-container">
          { itunesResults.map((item, key) => {
            const highResImageUrl = item.artworkUrl100.replace("100x100", "3000x3000"); // itunes max image size is 3000x3000;
            return (
              <div className="result-item" key={"result" + key.toString()}>
                <img src={highResImageUrl} className="result-image" alt={item.collectionName || item.trackName} />
                <p className="centered bold italic">{item.artistName} - {item.collectionName.replace(" - Single", "")}</p>
                <button onClick={async () => {
                  const response: ApiResponse = await sendRequest("POST", "/artwork-generation/use-itunes-image", { url: highResImageUrl });
                  if (response.status === RESPONSE_STATUS.SUCCESS) {
                    sendToast(response.message, TOAST_TYPE.SUCCESS);
                    // window.location.href = PATHS.processedImages;
                  } else {
                    sendToast(response.message, TOAST_TYPE.ERROR);
                  }
                }}>Use this image</button>
              </div>
            )
          })}
        </div>
      </div>

      <h1>...or upload your image</h1>
      <form encType="multipart/form-data" onSubmit={(e) => handleSubmitFileUpload(e, {file: file})}>
        <div className="flexbox">
          <input type="file" name="file" id="file" className="file"
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
      <span className="top-bot-spacer"></span>

      <h1>...or use a YouTube thumbnail</h1>
      <form onSubmit={(e) => handleSubmitYoutubeUrl(e, {url: youtubeUrl})}>
        <div className="flexbox">
          <input type="text" name="url" id="youtube_url" placeholder="Paste YouTube URL here"
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
          <div className="action-button" id={SPINNER_ID.YOUTUBE_URL}>
            <input type="submit" value="SEARCH" className="action-button" />
          </div>
        </div>
      </form>
    </>
  );
};

export default ArtworkGeneration;