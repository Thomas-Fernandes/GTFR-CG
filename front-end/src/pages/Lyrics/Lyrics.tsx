import { useState } from "react";

import { BACKEND_URL, PATHS, RESPONSE, SPINNER_ID, TITLE, TOAST_TYPE } from "../../common/Constants";
import { sendRequest } from "../../common/Requests";
import { hideSpinner, showSpinner } from "../../common/Spinner";
import { sendToast } from "../../common/Toast";
import { LyricsRequest, LyricsResponse, UseStateSetter } from "../../common/Types";
import useTitle from "../../common/UseTitle";

import "./Lyrics.css";

const handleLyricsSaveSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
  e.preventDefault();

  showSpinner(SPINNER_ID.LYRICS_SAVE);
  setTimeout(() => {}, 1000);
  console.log("Lyrics saved!");
  hideSpinner(SPINNER_ID.LYRICS_SAVE);
};

const handleLyricsSearchSubmit = (e: React.FormEvent<HTMLFormElement>, body: LyricsRequest, setLyrics: UseStateSetter<string>): void => {
  e.preventDefault();

  if (body.artist.trim() === "" || body.track.trim() === "") {
    sendToast(RESPONSE.WARN.MISSING_FIELDS, TOAST_TYPE.WARN);
    return;
  }

  showSpinner(SPINNER_ID.LYRICS_SEARCH);

  sendRequest("POST", BACKEND_URL + "/lyrics", body).then((response: LyricsResponse) => {
    if (response.lyrics === RESPONSE.ERROR.LYRICS_NOT_FOUND) {
      sendToast(RESPONSE.ERROR.LYRICS_NOT_FOUND, TOAST_TYPE.WARN);
      setLyrics("");
    } else {
      setLyrics(response.lyrics);
    }
  }).catch((error) => {
    sendToast(error.message, TOAST_TYPE.ERROR);
    setLyrics("");
  }).finally(() => {
    hideSpinner(SPINNER_ID.LYRICS_SEARCH);
  });
};

const Lyrics = (): React.JSX.Element => {
  const [artist, setArtist] = useState("");
  const [track, setTrack] = useState("");
  const [lyrics, setLyrics] = useState("");

  useTitle(TITLE.LYRICS);

  return (
    <>
      <div id="toast-container"></div>
      <span className="top-bot-spacer"></span>
      <div className="navbar">
        <button type="button" onClick={() => window.location.href = PATHS.home }><span className="left">Home</span></button>
        <button type="button" onClick={() => window.location.href = PATHS.artworkGeneration }><span className="left">Artwork Generation</span></button>
      </div>
      <h1>Lyrics</h1>
      <form className="flexbox flex-row" onSubmit={(e) => handleLyricsSearchSubmit(e, {artist: artist, track: track}, setLyrics)}>
        <div className="search-bar flex-row">
          <input
            type="text" name="artist" placeholder="Enter artist name" required
            onChange={(e) => setArtist(e.target.value)}
          />
          <input
            type="text" name="track" placeholder="Enter song name" required
            onChange={(e) => setTrack(e.target.value)}
          />
          <div className="action-button" id={SPINNER_ID.LYRICS_SEARCH}>
            <input type="submit" value="SEARCH" className="action-button search-button" />
          </div>
        </div>
      </form>
      <hr />
      <form className="flexbox" onSubmit={(e) => handleLyricsSaveSubmit(e)}>
        <textarea
          name="lyrics"
          rows={20} cols={80}
          placeholder="Lyrics will appear here..." value={lyrics} onChange={(e) => setLyrics(e.target.value)}
        />
        <div className="action-button" id={SPINNER_ID.LYRICS_SAVE}>
          <input type="submit" value="Save Lyrics" className="action-button save-button" />
        </div>
      </form>
    </>
  )
};

export default Lyrics;