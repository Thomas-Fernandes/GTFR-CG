import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { is2xxSuccessful, sendRequest } from "../../common/Requests";
import { hideSpinner, showSpinner } from "../../common/Spinner";
import { sendToast } from "../../common/Toast";
import { ApiResponse, LyricsRequest, LyricsResponse, StateSetter } from "../../common/Types";
import useTitle from "../../common/UseTitle";
import { BACKEND_URL, PATHS, SPINNER_ID, TITLE, TOAST, TOAST_TYPE } from "../../constants/Common";

import "./Lyrics.css";

const handleLyricsSaveSubmit = (e: FormEvent<HTMLFormElement>, body: string): void => {
  e.preventDefault();

  showSpinner(SPINNER_ID.LYRICS_SAVE);
  // TODO
  hideSpinner(SPINNER_ID.LYRICS_SAVE);
};

const handleLyricsSearchSubmit = (e: FormEvent<HTMLFormElement>, body: LyricsRequest, setLyrics: StateSetter<string>): void => {
  e.preventDefault();

  if (body.artist.trim() === "" || body.songName.trim() === "") {
    sendToast(TOAST.MISSING_FIELDS, TOAST_TYPE.WARN);
    return;
  }

  showSpinner(SPINNER_ID.LYRICS_SEARCH);

  sendRequest("POST", BACKEND_URL + "/lyrics", body).then((response: LyricsResponse) => {
    if (!is2xxSuccessful(response.status)) {
      throw new Error(response.message);
    }

    if (response.data.lyrics === TOAST.LYRICS_NOT_FOUND) {
      sendToast(TOAST.LYRICS_NOT_FOUND, TOAST_TYPE.WARN);
      setLyrics("");
    } else {
      setLyrics(response.data.lyrics);
    }
  }).catch((error: ApiResponse) => {
    setLyrics("");
    sendToast(error.message, TOAST_TYPE.ERROR);
  }).finally(() => {
    hideSpinner(SPINNER_ID.LYRICS_SEARCH);
  });
};

const isTokenSet = async (): Promise<boolean> => {
  return sendRequest("GET", BACKEND_URL + "/genius-token").then((response) => {
    if (is2xxSuccessful(response.status) && response.data.token !== "") {
      return true;
    }
    return false;
  }).catch((error) => {
    sendToast(error.message, TOAST_TYPE.ERROR);
    return false;
  });
};

const Lyrics = (): JSX.Element => {
  const navigate = useNavigate();

  // Search
  const [artist, setArtist] = useState("");
  const [songName, setSongName] = useState("");

  // Lyrics
  const [lyrics, setLyrics] = useState("");

  useTitle(TITLE.LYRICS);

  useEffect(() => {
    isTokenSet().then((isSet: boolean) => {
      if (!isSet) {
        navigate(`${PATHS.redirect}?error_text=${TOAST.NO_GENIUS_TOKEN}&redirect_to=${PATHS.home}`);
      }
    });
  });

  return (
    <div id="lyrics">
      <div id="toast-container"></div>
      <span className="top-bot-spacer" />

      <div className="navbar">
        <button type="button" onClick={() => window.location.href = PATHS.home }>
          <span className="left">{TITLE.HOME}</span>
        </button>
        <button type="button" onClick={() => window.location.href = PATHS.artworkGeneration }>
          <span className="left">{TITLE.ARTWORK_GENERATION}</span>
        </button>
      </div>

      <h1>Lyrics</h1>

      <form className="flexbox" onSubmit={(e) => handleLyricsSearchSubmit(e, {artist, songName}, setLyrics)}>
        <div className="search-bar flex-row">
          <input required
            type="text" name="artist" placeholder="Enter artist name"
            onChange={(e) => setArtist(e.target.value)}
          />
          <input required
            type="text" name="songName" placeholder="Enter song name"
            onChange={(e) => setSongName(e.target.value)}
          />
          <div className="action-button" id={SPINNER_ID.LYRICS_SEARCH}>
            <input type="submit" value="SEARCH" className="action-button search-button" />
          </div>
        </div>
      </form>

      <hr />

      <form className="flexbox" onSubmit={(e) => handleLyricsSaveSubmit(e, lyrics)}>
        <textarea
          name="lyrics" rows={20} cols={80}
          placeholder="Lyrics will appear here..." value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
        />
        <div className="action-button" id={SPINNER_ID.LYRICS_SAVE}>
          <input type="submit" value="Save Lyrics" className="action-button save-button" />
        </div>
      </form>
    </div>
  )
};

export default Lyrics;