import { FormEvent, JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { sendToast } from "../../common/Toast";
import { ImageDownloadRequest } from "../../common/Types";
import useTitle from "../../common/UseTitle";
import { doesFileExist } from "../../common/utils/FileUtils";
import { PATHS, TITLE, TOAST, TOAST_TYPE } from "../../constants/Common";
import { COVER_ART_FILENAME, DEFAULT_SELECTED_POSITION, LOGO_POSITIONS, PROCESSED_IMAGES_PATH } from "../../constants/ProcessedImages";

import "./ProcessedImages.css";

const ProcessedImages = (): JSX.Element => {
  useTitle(TITLE.PROCESSED_IMAGES);

  const navigate = useNavigate();

  const [selectedThumbnail, setSelectedThumbnail] = useState(DEFAULT_SELECTED_POSITION);

  const handleSubmitDownloadImage = (e: FormEvent<HTMLFormElement>, body: ImageDownloadRequest) => {
    e.preventDefault();

    if (!body.selectedImage) {
      sendToast(TOAST.NO_IMG_SELECTION, TOAST_TYPE.ERROR);
      return;
    }

    const filepath = `${PROCESSED_IMAGES_PATH}/${body.selectedImage}`;
    const filename = filepath.split('/').pop();
    const outputFilename = filename === COVER_ART_FILENAME ? "background.png" : filename;

    const link = document.createElement("a");
    link.download = outputFilename ?? "download.png";
    link.href = filepath;
    document.body.appendChild(link);

    try {
      link.click();
    } catch (err) {
      sendToast((err as Error).message, TOAST_TYPE.ERROR);
    } finally {
      document.body.removeChild(link);
    }
  };

  const processImageName = (position: string): string => {
    return `thumbnail_${position}.png`;
  };
  const renderThumbnailOption = (
    logoPosition: string,
    idx: number
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

  useEffect(() => {
    doesFileExist(PROCESSED_IMAGES_PATH + "/" + COVER_ART_FILENAME).then((anyProcessedImageExists: boolean) => {
      if (!anyProcessedImageExists) {
        navigate(`${PATHS.redirect}?redirect_to=${PATHS.artworkGeneration}&error_text=${TOAST.NO_PROCESSED_IMAGE}`);
      }
    });
  });

  return (
  <div id="processed-images">
    <div id="toast-container"></div>
    <span className="top-bot-spacer" />

    <div className="navbar">
      <button type="button" onClick={() => navigate(PATHS.artworkGeneration)}>
        <span className="left">{TITLE.ARTWORK_GENERATION}</span>
      </button>
      <button type="button" onClick={() => navigate(PATHS.lyrics)}>
        <span className="right">{TITLE.LYRICS}</span>
      </button>
    </div>

    <h1>Processed Artworks</h1>

    <div id="image-panels">
      <div id="image-container">
        <img src={PROCESSED_IMAGES_PATH + "/" + COVER_ART_FILENAME} alt="background thumbnail" />
        <form onSubmit={(e) => handleSubmitDownloadImage(e, {selectedImage: COVER_ART_FILENAME})}>
          <input type="submit" value="Download" className="button" />
        </form>
      </div>

      <div id="thumbnails">
        <form onSubmit={(e) => handleSubmitDownloadImage(e, {selectedImage: processImageName(selectedThumbnail)})}>
          <div id="thumbnail-grid">
            { LOGO_POSITIONS.map((logoPosition, idx) =>
              renderThumbnailOption(logoPosition, idx))
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