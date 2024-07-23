import { useEffect } from "react";

import { PATHS, DEFAULT_CONTEXT, TITLE } from "../../common/Constants";
import { Context } from "../../common/Types";
import useTitle from "../../common/UseTitle";
import { isEmpty } from "../../common/utils/ObjUtils";

import "./ProcessedImages.css";

// allow user to click on the image to select it for download
// $("a").click(() => {
//   $(this).next("input[type=radio]").prop("checked", true);
// });

const submitDownloadThumbnail = (form?: HTMLFormElement) => {
  if (!form) return;
  const selectedOption = document.querySelector("input[name=selected_thumbnail_idx]:checked")?.value;
  form.action = "/download-thumbnail/" + encodeURIComponent(selectedOption);
  form.submit();
}

const ProcessedImages = (passedContext: Context): React.JSX.Element => {
  const context = isEmpty(passedContext) ? DEFAULT_CONTEXT : passedContext;

  useTitle(TITLE.PROCESSED_IMAGES);

  useEffect(() => {

  }, [context]);

  return (
  <>
    <span className="top-bot-spacer"></span>
    <div className="navbar">
      <button type="button" onClick={() => window.location.href = PATHS.artworkGeneration}><span className="left">Artwork Generation</span></button>
      <button type="button" onClick={() => window.location.href = PATHS.lyrics}><span className="right">Lyrics</span></button>
    </div>
    <h1>Processed Artworks</h1>
    <div className="image-panels">
      {/* Cadre de gauche pour l'Artwork */}
      <div className="image-container">
        <img src="{{ url_for('processed-images.downloadImage', filename='ProcessedArtwork.png') }}" alt="background thumbnail" />
        <form method="GET" action="/download-image/ProcessedArtwork.png" encType="multipart/form-data">
          <input type="submit" value="Download" className="button" />
        </form>
      </div>

      {/* grille de 3*3 */}
      <div className="thumbnails">
        <form method="GET" onSubmit={() => { submitDownloadThumbnail(this); return false; }}>
          <div className="thumbnail-grid">
            <div className="thumbnail-item">
              <a><img src="{{ url_for('processed-images.downloadImage', filename='thumbnail_top-left.png') }}" alt="top left logo" /></a>
              <input type="radio" id="radio_01" name="selected_thumbnail_idx" value="1" />
            </div>
            <div className="thumbnail-item">
              <a><img src="{{ url_for('processed-images.downloadImage', filename='thumbnail_top-center.png') }}" alt="top center logo" /></a>
              <input type="radio" id="radio_02" name="selected_thumbnail_idx" value="2" />
            </div>
            <div className="thumbnail-item">
              <a><img src="{{ url_for('processed-images.downloadImage', filename='thumbnail_top-right.png') }}" alt="top right logo" /></a>
              <input type="radio" id="radio_03" name="selected_thumbnail_idx" value="3" />
            </div>
            <div className="thumbnail-item">
              <a><img src="{{ url_for('processed-images.downloadImage', filename='thumbnail_center-left.png') }}" alt="center left logo" /></a>
              <input type="radio" id="radio_04" name="selected_thumbnail_idx" value="4" checked />
              {/* By default, the checked radio button is the center-left; because it is the most common chosen one */}
            </div>
            <div className="thumbnail-item">
              <a><img src="{{ url_for('processed-images.downloadImage', filename='thumbnail_center-center.png') }}" alt="center logo" /></a>
              <input type="radio" id="radio_05" name="selected_thumbnail_idx" value="5" />
            </div>
            <div className="thumbnail-item">
              <a><img src="{{ url_for('processed-images.downloadImage', filename='thumbnail_center-right.png') }}" alt="center right logo" /></a>
              <input type="radio" id="radio_06" name="selected_thumbnail_idx" value="6" />
            </div>
            <div className="thumbnail-item">
              <a><img src="{{ url_for('processed-images.downloadImage', filename='thumbnail_bottom-left.png') }}" alt="bottom left logo" /></a>
              <input type="radio" id="radio_07" name="selected_thumbnail_idx" value="7" />
            </div>
            <div className="thumbnail-item">
              <a><img src="{{ url_for('processed-images.downloadImage', filename='thumbnail_bottom-center.png') }}" alt="bottom center logo" /></a>
              <input type="radio" id="radio_08" name="selected_thumbnail_idx" value="8" />
            </div>
            <div className="thumbnail-item">
              <a><img src="{{ url_for('processed-images.downloadImage', filename='thumbnail_bottom-right.png') }}" alt="bottom right logo" /></a>
              <input type="radio" id="radio_09" name="selected_thumbnail_idx" value="9" />
            </div>
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