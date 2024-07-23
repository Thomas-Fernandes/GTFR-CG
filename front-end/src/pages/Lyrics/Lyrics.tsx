import { useEffect, useState } from "react";

import { PATHS, DEFAULT_CONTEXT, TITLE, RESPONSE, TOAST_TYPE } from "../../common/Constants";
import { showSpinner } from "../../common/Spinner";
import { sendToast } from "../../common/Toast";
import { Context } from "../../common/Types";
import useTitle from "../../common/UseTitle";
import { isEmpty } from "../../common/utils/ObjUtils";

import "./Lyrics.css";

const Lyrics = (passedContext: Context): React.JSX.Element => {
  const context = isEmpty(passedContext) ? DEFAULT_CONTEXT : passedContext;
  const [lyrics, setLyrics] = useState("");

  useTitle(TITLE.LYRICS);

  useEffect(() => {
    if (lyrics === RESPONSE.ERROR.LYRICS_NOT_FOUND) {
      sendToast(RESPONSE.ERROR.LYRICS_NOT_FOUND, TOAST_TYPE.WARN);
      setLyrics("");
    }
  }, [context, lyrics]);

  return (
    <>
      <div id="toast-container"></div>
      <span className="top-bot-spacer"></span>
      <div className="navbar">
        <button type="button" onClick={() => window.location.href = PATHS.home }><span className="left">Home</span></button>
        <button type="button" onClick={() => window.location.href = PATHS.artworkGeneration }><span className="left">Artwork Generation</span></button>
      </div>
      <h1>Lyrics</h1>
      <form method="POST" className="search-form flexbox flex-row">
        <div className="search-bars">
          <input type="text" id="artist" name="artist" placeholder="Enter artist name" required />
          <input type="text" id="song"   name="song"   placeholder="Enter song name"   required />
          <div className="action-button" id="lyrics_search">
            <input type="submit" value="Search Lyrics" className="action-button search-button" onClick={() => showSpinner("lyrics_search") } />
          </div>
        </div>
      </form>
      <form method="POST" className="lyrics-form flexbox">
        <textarea name="lyrics" rows={20} cols={80} placeholder="Lyrics will appear here...">{ lyrics }</textarea>
        <br />
        <div className="action-button" id="lyrics_save">
          <input type="submit" value="Save Lyrics" className="action-button save-button" onClick={() => showSpinner("lyrics_save") } />
        </div>
      </form>
    </>
  )
};

export default Lyrics;