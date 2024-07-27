import { FormEvent, useState } from "react";

import { BACKEND_URL, PATHS, PROCESSED_IMAGES, TITLE, TOAST_TYPE } from "../../common/Constants";
import { sendRequest } from "../../common/Requests";
import { sendToast } from "../../common/Toast";
import { ImageDownloadRequest } from "../../common/Types";
import useTitle from "../../common/UseTitle";

import "./ProcessedImages.css";

const handleSubmitDownloadImage = (e: FormEvent<HTMLFormElement>, body: ImageDownloadRequest): void => {
  e.preventDefault();

  if (!body.selectedImage) {
    sendToast("Please select a thumbnail", TOAST_TYPE.ERROR);
    return;
  }

  sendRequest("POST", BACKEND_URL + "/download-image" + encodeURIComponent(body.selectedImage)).then(() => {
  }).catch((error) => {
    sendToast(error.message, TOAST_TYPE.ERROR);
  });
}

const processImageName = (thumbnail: string): string => {
  return `thumbnail_${thumbnail}.png`;
}

const ProcessedImages = (): React.JSX.Element => {
  const [selectedThumbnail, setSelectedThumbnail] = useState(PROCESSED_IMAGES.DEFAULT_SELECTED_POSITION); // default value is 4 (center-left)

  useTitle(TITLE.PROCESSED_IMAGES);

  return (
  <>
    <div id="toast-container"></div>
    <span className="top-bot-spacer"></span>
    <div className="navbar">
      <button type="button" onClick={() => window.location.href = PATHS.artworkGeneration}><span className="left">Artwork Generation</span></button>
      <button type="button" onClick={() => window.location.href = PATHS.lyrics}><span className="right">Lyrics</span></button>
    </div>
    <h1>Processed Artworks</h1>
    <div className="image-panels">
      <div className="image-container">
        <img src={PROCESSED_IMAGES.COVER_ART_FILENAME} alt="background thumbnail" />
        <form onSubmit={(e) => { handleSubmitDownloadImage(e, {selectedImage: PROCESSED_IMAGES.COVER_ART_FILENAME}) }}>
          <input type="submit" value="Download" className="button" />
        </form>
      </div>

      <div className="thumbnails">
        <form onSubmit={(e) => { handleSubmitDownloadImage(e, {selectedImage: processImageName(selectedThumbnail)}) }}>
          <div className="thumbnail-grid">
            { PROCESSED_IMAGES.LOGO_POSITIONS.map((logoPosition, idx) => {
              return (
                <div
                  className="thumbnail-item" key={"thumbnail-item" + idx.toString()}
                >
                  <label htmlFor={"radio_" + idx}>
                    <img src={`thumbnail_${logoPosition}.png`} alt={logoPosition} />
                  </label>
                  <input
                    type="radio" id={"radio_" + idx} name="selected_thumbnail_idx" value={idx.toString()}
                    defaultChecked={logoPosition === PROCESSED_IMAGES.DEFAULT_SELECTED_POSITION}
                    onClick={() => setSelectedThumbnail(logoPosition)}
                  />
                </div>
              )}
            )}
          </div>
          <input type="submit" value="Download" className="button" />
        </form>
      </div>
    </div>
    <span className="top-bot-spacer"></span>
  </>
  )
};

export default ProcessedImages;