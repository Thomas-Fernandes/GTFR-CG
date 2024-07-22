import { useEffect } from "react";

import { _PATHS, ACCEPTED_IMG_EXTENSIONS, DEFAULT_CONTEXT, REGEX_YOUTUBE_URL, RESPONSE_STATUS } from "../../common/Constants";
import { showSpinner } from "../../common/Spinner";
import { Context } from "../../common/Types";
import { isEmpty } from "../../common/utils/ObjUtils";

import "./ArtworkGeneration.css";

const MAX_TITLE_LENGTH = 42;
const MAX_CROP_LENGTH = 12;

const getTitleWithAdjustedLength = (title: string): string => {
  title = title.slice(0, MAX_TITLE_LENGTH - 3);

  // find the first space before the max length to cut the string there
  let end = title[title.length - 1].endsWith(" ") ? title.length - 1 : title.lastIndexOf(" ", MAX_TITLE_LENGTH);

  // if the space-determined crop is too intense, just cut the string at the max length
  end = MAX_TITLE_LENGTH - end > MAX_CROP_LENGTH ? title.length : end;
  return title.slice(0, end) + "...";
};

const isValidYoutubeUrl = (url: string): boolean => {
    return REGEX_YOUTUBE_URL.some((pattern) => pattern.test(url));
}
/*
const submitItunesSearchForm = (event) => {
  event.preventDefault();

  const query = $("#query").val();
  const country = $("#country").val();

  $.ajax({
    url: "https://itunes.apple.com/search",
    data: {
      term: query,
      entity: "album", // album by default, but can be "song", "movie", "tv-show"...
      country: country,
      limit: 6
    },
    dataType: "jsonp",
    success: function(data) {
      hideSpinner("artwork-generation_search-form");
      const resultsDiv = $("#results");
      resultsDiv.empty();
      if (data.results.length > 0) {
        data.results.forEach((result) => {
          if (result.artistName?.length > MAX_TITLE_LENGTH)
            result.artistName = getTitleWithAdjustedLength(result.artistName);
          if (result.collectionName?.length > MAX_TITLE_LENGTH)
            result.collectionName = getTitleWithAdjustedLength(result.collectionName);
          const highResImageUrl = result.artworkUrl100.replace("100x100", "3000x3000"); // itunes max image size is 3000x3000
          const img = $("<img>").attr("src", highResImageUrl).addClass("result-image").attr("alt", result.collectionName || result.trackName);
          const imgName = $("<p>").addClass("centered bold italic").text(`${result.artistName} - ${result.collectionName.replace(" - Single", "")}`);
          const btn = $("<button>").text("Use this image").on("click", () => {
            $.post("/artwork-generation/use-itunes-image", { url: highResImageUrl }, (response) => {
              if (response.status === RESPONSE_STATUS.SUCCESS) {
                window.location.href = "/processed-images";
              } else {
                sendToast(response.message, RESPONSE_STATUS.ERROR);
              }
            });
          });
          const resultItem = $("<div>").addClass("result-item").append(img).append(btn);
          resultItem.append(img).append(imgName).append(btn);
          resultsDiv.append(resultItem);
        });
      } else {
        sendToast("No results found.", RESPONSE_STATUS.WARN);
      }
    },
    error: (err) => {
      sendToast(err, RESPONSE_STATUS.ERROR);
    }
  });
};

const submitFileUpload = (event) => {
  event.preventDefault();
  const formFiles = $("#file")[0].files;

  if (formFiles.length === 0) {
    hideSpinner("artwork-generation_file-upload");
    sendToast("Please select an image file.", RESPONSE_STATUS.WARN);
  }

  const fileHasAcceptedExtension =
    ACCEPTED_IMG_EXTENSIONS.includes($("#file")[0].files[0].name.split(".").slice(-1)[0].toLowerCase());
  if (!fileHasAcceptedExtension) {
    hideSpinner("artwork-generation_file-upload");
    sendToast(
      "Please select a valid image file.\n" +
        "Accepted file extensions: " + ACCEPTED_IMG_EXTENSIONS.join(", ") + ".",
      RESPONSE_STATUS.ERROR
    );
    return;
  }

  $.ajax({
    url: "/artwork-generation/use-local-image",
    type: "POST",
    data: new FormData($("#fileUpload")[0]),
    processData: false,
    contentType: false,
    success: (response) => {
      if (response.status === (RESPONSE_STATUS.SUCCESS)) {
        window.location.href = "/processed-images";
      } else {
        sendToast(response.message, RESPONSE_STATUS.ERROR);
      }
    },
    error: (err) => {
      hideSpinner("artwork-generation_file-upload");
      sendToast(err, RESPONSE_STATUS.ERROR);
    }
  });
};

const submitYoutubeThumbnailUrl = (event) => {
    event.preventDefault();
    const url = $("#youtube_url").val().trim();

    if (!isValidYoutubeUrl(url)) {
       sendToast("Please enter a valid URL", RESPONSE_STATUS.ERROR);
       return;
    }

    showSpinner("youtube-thumbnail-submit");

    $.ajax({
      url: "/artwork-generation/use-youtube-thumbnail",
      type: "POST",
      contentType: "application/x-www-form-urlencoded",
      data: { url: url },
      success: (data) => {
        if (data.status === "error") {
          hideSpinner("youtube-thumbnail-submit");
          sendToast("An error occurred on the server.", RESPONSE_STATUS.ERROR);
        } else {
          window.addEventListener("beforeunload", function () {
            showSpinner("youtube-thumbnail-submit");
          });
          window.location.href = "/processed-images";
        }
      },
      error: function() {
        hideSpinner("youtube-thumbnail-submit");
        sendToast("An error occurred. Please try again.", RESPONSE_STATUS.ERROR);
      }
    });
};
*/
const ArtworkGeneration = (passedContext: Context): React.JSX.Element => {
  const context = isEmpty(passedContext) ? DEFAULT_CONTEXT : passedContext;

  useEffect(() => {

  }, [context]);

  return (
    <>
      <div id="toast-container"></div>
      <span className="top-bot-spacer"></span>
      <div className="navbar">
        <button type="button"
          onClick={() => window.location.href = _PATHS.home }
        >
          <span className="left">Home</span>
        </button>
      </div>
      <h1>Search for cover art on iTunes</h1>
      <form id="iTunesSearchForm" method="POST">
        <div className="flexbox">
          <input type="text" name="query" id="query" placeholder="Search on iTunes" />
          <select name="country" id="country" aria-label="Country">
            <option value="fr" selected>France</option>
            <option value="us">United States</option>
            <option value="nz">New Zealand</option>
          </select>
          <div className="action-button" id="artwork-generation_search-form">
            <input type="submit" value="SEARCH" className="action-button" onClick={ () => showSpinner("artwork-generation_search-form") } />
          </div>
        </div>
      </form>
      <div id="results" className="result-container"></div>

      <h1>...or upload your image</h1>
      <form id="fileUpload" method="POST" action="/artwork-generation/use-local-image" encType="multipart/form-data">
        <div className="flexbox">
          <input type="file" name="file" id="file" className="file" />
          <label className="checkbox" htmlFor="include_center_artwork">
            <input type="checkbox" name="include_center_artwork" id="include_center_artwork" checked />
            <p className="checkbox-label italic">Include center artwork</p>
          </label>
          <div className="action-button" id="artwork-generation_file-upload">
            <input type="submit" value="SEARCH" className="action-button" onClick={ () => showSpinner("artwork-generation_file-upload") } />
          </div>
        </div>
      </form>
      <span className="top-bot-spacer"></span>

      <h1>...or use a YouTube thumbnail</h1>
      <form id="youtubeThumbnailForm" method="POST" action="/artwork-generation/use-youtube-thumbnail">
        <div className="flexbox">
          <input type="text" name="url" id="youtube_url" placeholder="Paste YouTube URL here" />
          <div className="action-button" id="youtube-thumbnail-submit">
            <input type="submit" value="SEARCH" className="action-button" onClick={ () => showSpinner("youtube-thumbnail-submit") } />
            <div id="youtube-thumbnail-spinner" className="spinner"></div>
          </div>
        </div>
      </form>
    </>
  );
};

export default ArtworkGeneration;