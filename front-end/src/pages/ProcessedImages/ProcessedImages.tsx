import { FormEvent, JSX, useState } from "react";

import { sendRequest } from "../../common/Requests";
import { sendToast } from "../../common/Toast";
import { ApiResponse, ImageDownloadRequest, StateSetter } from "../../common/Types";
import useTitle from "../../common/UseTitle";
import { BACKEND_URL, PATHS, TITLE, TOAST_TYPE } from "../../constants/Common";
import { COVER_ART_FILENAME, DEFAULT_SELECTED_POSITION, LOGO_POSITIONS, PROCESSED_IMAGES_PATH } from "../../constants/ProcessedImages";

import "./ProcessedImages.css";

const handleSubmitDownloadImage = (e: FormEvent<HTMLFormElement>, body: ImageDownloadRequest): void => {
  e.preventDefault();

  if (!body.selectedImage) {
    sendToast("Please select a thumbnail", TOAST_TYPE.ERROR);
    return;
  }

  sendRequest("POST", BACKEND_URL + "/download-image" + encodeURIComponent(body.selectedImage)).then(() => {
    // TODO - handle the response
  }).catch((error: ApiResponse) => {
    sendToast(error.message, TOAST_TYPE.ERROR);
  });
};

const processImageName = (position: string): string => {
  return `thumbnail_${position}.png`;
};
const renderThumbnailOption = (
  logoPosition: string,
  idx: number,
  setSelectedThumbnail: StateSetter<string>
): JSX.Element => {
  return (
    <div className="thumbnail-item" key={"thumbnail-item" + idx.toString()}>
      <label htmlFor={"radio_" + idx}>
        <img src={PROCESSED_IMAGES_PATH + "/" + processImageName(logoPosition)} alt={logoPosition} />
      </label>
      <input
        type="radio" id={"radio_" + idx} name="selected_thumbnail_idx" value={idx.toString()}
        defaultChecked={logoPosition === DEFAULT_SELECTED_POSITION}
        onClick={() => setSelectedThumbnail(logoPosition)}
      />
    </div>
  );
};

const ProcessedImages = (): JSX.Element => {
  const [selectedThumbnail, setSelectedThumbnail] = useState(DEFAULT_SELECTED_POSITION); // default value is 4 (center-left)

  useTitle(TITLE.PROCESSED_IMAGES);

  return (
  <div id="processed-images">
    <div id="toast-container"></div>
    <span className="top-bot-spacer" />

    <div className="navbar">
      <button type="button" onClick={() => window.location.href = PATHS.artworkGeneration}>
        <span className="left">{TITLE.ARTWORK_GENERATION}</span>
      </button>
      <button type="button" onClick={() => window.location.href = PATHS.lyrics}>
        <span className="right">{TITLE.LYRICS}</span>
      </button>
    </div>

    <h1>Processed Artworks</h1>

    <div id="image-panels">
      <div id="image-container">
        <img src={PROCESSED_IMAGES_PATH + "/" + COVER_ART_FILENAME} alt="background thumbnail" />
        <form onSubmit={(e) => { handleSubmitDownloadImage(e, {selectedImage: COVER_ART_FILENAME}) }}>
          <input type="submit" value="Download" className="button" />
        </form>
      </div>

      <div id="thumbnails">
        <form onSubmit={(e) => { handleSubmitDownloadImage(e, {selectedImage: processImageName(selectedThumbnail)}) }}>
          <div id="thumbnail-grid">
            {
              LOGO_POSITIONS.map((logoPosition, idx) =>
                renderThumbnailOption(logoPosition, idx, setSelectedThumbnail))
            }
          </div>
          <input type="submit" value="Download" className="button" />
        </form>
      </div>
    </div>

    <span className="top-bot-spacer" />
  </div>
  )
};

export default ProcessedImages;