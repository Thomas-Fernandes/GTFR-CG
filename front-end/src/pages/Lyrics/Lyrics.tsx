import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AutoResizeTextarea } from "../../common/components/AutoResizeTextarea";
import { is2xxSuccessful, sendRequest } from "../../common/Requests";
import { hideSpinner, showSpinner } from "../../common/Spinner";
import { sendToast } from "../../common/Toast";
import { ApiResponse, Dict, LyricsPart, LyricsRequest, LyricsResponse, SongPartsCards } from "../../common/Types";
import useTitle from "../../common/UseTitle";
import { API, BACKEND_URL, PATHS, SPINNER_ID, TITLE, TOAST, TOAST_TYPE } from "../../constants/Common";

import "./Lyrics.css";

const Lyrics = (): JSX.Element => {
  useTitle(TITLE.LYRICS);

  const navigate = useNavigate();

  const [isGeniusTokenSet, setIsGeniusTokenSet] = useState(false);

  const [isFetching, setIsFetching] = useState(false);
  const [isSavingCardsContent, setIsSavingCardsContent] = useState(false);

  const [artist, setArtist] = useState("");
  const [songName, setSongName] = useState("");

  const [pageMetadata, setPageMetadata] = useState({} as Dict);
  const [lyricsParts, setLyricsParts] = useState([] as LyricsPart[]);

  // Lyrics
  const handleLyricsSaveSubmit = (e: FormEvent<HTMLFormElement>, body: SongPartsCards) => {
    e.preventDefault();

    if (isSavingCardsContent) {
      sendToast(TOAST.PROCESSING_IN_PROGRESS, TOAST_TYPE.WARN);
      return;
    }

    setIsSavingCardsContent(true);
    showSpinner(SPINNER_ID.LYRICS_SAVE);

    const metadata = "Metadata | " + Object.entries(pageMetadata).map(([key, value]) => `${key}: ${value}`).join(" ;;; ");
    const data = {
      cardsContents: [[metadata]].concat(body),
    };

    sendRequest("POST", BACKEND_URL + API.CARDS_GENERATION.SAVE_CARDS_CONTENTS, data).then((response: ApiResponse) => {
      if (!is2xxSuccessful(response.status)) {
        throw new Error(response.message);
      }

      const cardArtist = pageMetadata.artist.startsWith("Genius") ? pageMetadata.title.split(" - ")[0] : pageMetadata.artist;
      const cardSongName = pageMetadata.artist.startsWith("Genius") ? pageMetadata.title.split(" - ")[1].split(" (")[0] : pageMetadata.title;
      const cardMeta = `${cardArtist.toUpperCase()}, “${cardSongName.toUpperCase()}”`;
      sessionStorage.setItem("cardMeta", cardMeta);
      navigate(PATHS.cardsGeneration);
    }).catch((error: ApiResponse) => {
      sendToast(error.message, TOAST_TYPE.ERROR);
    }).finally(() => {
      hideSpinner(SPINNER_ID.LYRICS_SAVE);
      setIsSavingCardsContent(false);
    });
  };

  const convertToCardContents = (lyricsParts: LyricsPart[]): SongPartsCards => {
    // Input: [{section: "Verse 1", lyrics: "The whole lyrics\nOf the section\nAre here as is\nTotally disorganized"}, ...]
    // Output: [["The whole lyrics\nOf the section", "Are here as is\nTotally disorganized"], ...]
    //   -> Each inner array is a section, each string is a card
    return lyricsParts.map(part => part.lyrics.split("\n\n"));
  };

  const handleSetLyricsParts = (lyrics: string, idx: number) => {
    const updatedLyricsParts = [...lyricsParts];
    updatedLyricsParts[idx].lyrics = lyrics;
    setLyricsParts(updatedLyricsParts);
  };

  // Search
  const handleLyricsSearchSubmit = (e: FormEvent<HTMLFormElement>, body: LyricsRequest) => {
    e.preventDefault();

    if (isFetching) {
      sendToast(TOAST.FETCH_IN_PROGRESS, TOAST_TYPE.WARN);
      return;
    }

    if (body.artist.trim() === "" || body.songName.trim() === "") {
      sendToast(TOAST.MISSING_FIELDS, TOAST_TYPE.WARN);
      return;
    }

    setIsFetching(true);
    showSpinner(SPINNER_ID.LYRICS_SEARCH);

    sendRequest("POST", BACKEND_URL + API.LYRICS.GET_LYRICS, body).then((response: LyricsResponse) => {
      if (!is2xxSuccessful(response.status)) {
        throw new Error(response.message);
      }

      const responseFirstSection = response.data.lyricsParts[0].section;
      if (["error", "warn"].includes(responseFirstSection)) {
        sendToast(
          response.data.lyricsParts[0].lyrics,
          responseFirstSection === "error" ? TOAST_TYPE.ERROR : TOAST_TYPE.WARN
        );
        setLyricsParts([]);
      } else {
        const metadata = response.data.lyricsParts.find(part => part.section === "[Metadata]")?.lyrics.split("\n") ?? [];
        const metadataObj = metadata.reduce((acc: Dict, curr) => {
          const [key, value] = curr.split(": ");
          acc[key] = value;
          return acc;
        }, {} as Dict);
        setPageMetadata(metadataObj);

        const lyricsParts = response.data.lyricsParts.filter(part => part.section !== "[Metadata]");
        setLyricsParts(lyricsParts);
      }
    }).catch((error: ApiResponse) => {
      sendToast(error.message, TOAST_TYPE.ERROR);
      setLyricsParts([]);
    }).finally(() => {
      hideSpinner(SPINNER_ID.LYRICS_SEARCH);
      setIsFetching(false);
    });
  };

  useEffect(() => {
    if (isGeniusTokenSet)
      return;

    const isTokenSet = async (): Promise<boolean> => {
      return sendRequest("GET", BACKEND_URL + API.GENIUS_TOKEN).then((response) => {
        return is2xxSuccessful(response.status) && response.data.token !== "";
      }).catch((error) => {
        sendToast(error.message, TOAST_TYPE.ERROR);
        return false;
      });
    };

    isTokenSet().then((isSet) => {
      if (!isSet)
        navigate(`${PATHS.redirect}?redirect_to=${PATHS.home}&error_text=${TOAST.NO_GENIUS_TOKEN}`);
      else
        setIsGeniusTokenSet(true);
    });
  });

  return (
    <div id="lyrics">
      <div id="toast-container"></div>
      <span className="top-bot-spacer" />

      <div className="navbar">
        <button type="button" onClick={() => navigate(PATHS.home)}>
          <span className="left">{TITLE.HOME}</span>
        </button>
        <button type="button" onClick={() => navigate(PATHS.artworkGeneration)}>
          <span className="left">{TITLE.ARTWORK_GENERATION}</span>
        </button>
        <button type="button" onClick={() => navigate(PATHS.cardsGeneration)}>
          <span className="right">{TITLE.CARDS_GENERATION}</span>
        </button>
      </div>

      <h1>Lyrics</h1>

      <form className="search-form flexbox" onSubmit={(e) => handleLyricsSearchSubmit(e, {artist, songName})}>
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

      { lyricsParts.length > 0 &&
        <>
          <hr />

          <form className="lyrics-form flexbox" onSubmit={(e) => handleLyricsSaveSubmit(e, convertToCardContents(lyricsParts))}>
            { lyricsParts.map((part, idx) => (
              <div key={idx} className="lyrics-part">
                <label>{part.section}</label>
                <AutoResizeTextarea
                  name={`lyrics_part_${idx}`} rows={5} cols={80}
                  value={part.lyrics} onChange={(e) => handleSetLyricsParts(e.target.value, idx)}
                />
                <hr className="w-66 mv-0" />
              </div>
            ))}
            <div className="action-button" id={SPINNER_ID.LYRICS_SAVE}>
              <input type="submit" value="CONVERT TO CARDS" className="action-button save-button" />
            </div>
          </form>
        </>
      }
    </div>
  )
};

export default Lyrics;