import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { is2xxSuccessful, sendRequest } from "@common/Requests";
import { sendToast } from "@common/Toast";
import { LyricsContents, LyricsPart, PageMetadata } from "@common/Types";
import useTitle from "@common/UseTitle";

import { SESSION_STORAGE, TITLE } from "@constants/Common";
import { API, BACKEND_URL, VIEW_PATHS } from "@constants/Paths";
import { SPINNER_ID } from "@constants/Spinner";
import { TOAST, TOAST_TYPE } from "@constants/Toast";

import { LyricsContext } from "./context";
import { handleLoadLastContents, handleLyricsSaveSubmit, handleLyricsSearchSubmit, handleSetLyricsParts } from "./handlers";
import LyricsParts from "./LyricsPart";
import { convertToCardContents } from "./utils";

import "./Lyrics.css";

const Lyrics = (): JSX.Element => {
  useTitle(TITLE.LYRICS);

  const navigate = useNavigate();

  const [isGeniusTokenSet, setIsGeniusTokenSet] = useState(false);

  const [isFetching, setIsFetching] = useState(false);
  const [isSavingCardsContent, setIsSavingCardsContent] = useState(false);

  const [artist, setArtist] = useState("");
  const [songName, setSongName] = useState("");

  const [pageMetadata, setPageMetadata] = useState({} as PageMetadata);
  const [lyricsParts, setLyricsParts] = useState([] as LyricsPart[]);
  const [lastContents, setLastContents] = useState({} as LyricsContents);

  const [isManual, setIsManual] = useState(false);

  const [dismissedParts, setDismissedParts] = useState(new Set<number>());

  const contextValue = useMemo(
    () => ({ lyricsParts, setLyricsParts, dismissedParts, setDismissedParts }),
    [lyricsParts, setLyricsParts, dismissedParts, setDismissedParts]
  );

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
      if (!isSet) {
        navigate(`${VIEW_PATHS.redirect}?redirect_to=${VIEW_PATHS.home}&error_text=${TOAST.NO_GENIUS_TOKEN}`);
      } else {
        setIsGeniusTokenSet(true);
        const latestCardGeneration = sessionStorage.getItem(SESSION_STORAGE.LATEST_CARD_GENERATION);
        setLastContents(latestCardGeneration !== null
          ? JSON.parse(latestCardGeneration)
          : "{{}, [], [], []}"
        );
      }
    });
  });

  return (
    <LyricsContext.Provider value={contextValue}>
      <div id="lyrics">
        <div id="toast-container"></div>
        <span className="top-bot-spacer" />

        <div className="navbar">
          <button type="button" onClick={() => navigate(VIEW_PATHS.home)}>
            <span className="left">{TITLE.HOME}</span>
          </button>
          <button type="button" onClick={() => navigate(VIEW_PATHS.artworkGeneration)}>
            <span className="left">{TITLE.ARTWORK_GENERATION}</span>
          </button>
          <button type="button" onClick={() => navigate(VIEW_PATHS.cardsGeneration)}>
            <span className="right">{TITLE.CARDS_GENERATION}</span>
          </button>
        </div>

        <h1>Lyrics</h1>

        <button type="button" className="last-generation"
          onClick={() => handleLoadLastContents({lastContents, setPageMetadata, setLyricsParts, setDismissedParts})}
        >
          {"Load last contents"}
        </button>

        { isManual
        ? <div className="flexbox">
          <div id="metadata-bar" className="flex-row g-1">
            <input required
              type="text" name="artist" placeholder="Enter artist name"
              onChange={(e) => { setArtist(e.target.value); setPageMetadata({...pageMetadata, artist: e.target.value}); }}
            />
            <input required
              type="text" name="songName" placeholder="Enter song name"
              onChange={(e) => { setSongName(e.target.value); setPageMetadata({...pageMetadata, title: e.target.value}); }}
            />
          </div>
        </div> : <form className="search-form flexbox"
          onSubmit={(e) => handleLyricsSearchSubmit(e, {artist, songName}, {isFetching, setIsFetching, setLyricsParts, setPageMetadata})}
        >
          <div id="search-bar" className="flex-row g-1">
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
        </form>}

        { !isFetching &&
          <button type="button" className="mode-flipper"
            onClick={() => {
              if (!isManual) {
                setLyricsParts([{section: "Manual Card Creation", lyrics: ""}]);
                setPageMetadata({id: "manual", artist: artist, title: songName, contributors: []});
              } else {
                setLyricsParts([] as LyricsPart[]);
                setPageMetadata({} as PageMetadata);
              }
              setIsManual(!isManual);
            }}
          >
            {isManual ? "Generate cards automatically" : "Generate cards manually instead"}
          </button>}

        { !isFetching && lyricsParts.length > 0 && <>
          <hr />

          <form className="lyrics-form flexbox"
            onSubmit={(e) => handleLyricsSaveSubmit(e, convertToCardContents(lyricsParts, dismissedParts),
              {isSavingCardsContent, setIsSavingCardsContent, pageMetadata, isManual, lyricsParts, dismissedParts, navigate}
            )}
          >
            <LyricsParts lyricsParts={lyricsParts} handleSetLyricsParts={handleSetLyricsParts} />
            <div className="action-button" id={SPINNER_ID.LYRICS_CONVERT}>
              <input type="submit" value="CONVERT TO CARDS" className="action-button convert-button" />
            </div>
          </form>
        </>}
      </div>
    </LyricsContext.Provider>
  )
};

export default Lyrics;