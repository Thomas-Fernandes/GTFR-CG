import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { is2xxSuccessful, sendRequest } from "@common/requests";
import { sendToast } from "@common/toast";
import { LyricsContents, LyricsPart, PageMetadata } from "@common/types";
import { useTitle } from "@common/useTitle";

import NavButton from "@components/NavButton";
import ToastContainer from "@components/ToastContainer/ToastContainer";

import { SESSION_STORAGE, TITLE } from "@constants/Common";
import { API, BACKEND_URL, VIEW_PATHS } from "@constants/paths";
import { SPINNER_ID } from "@constants/spinners";
import { TOAST, TOAST_TYPE } from "@constants/toasts";

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
    <div id="lyrics">
      <ToastContainer />
      <span className="top-bot-spacer" />

      <div className="navbar">
        <NavButton to={VIEW_PATHS.home} label={TITLE.HOME} side="left" />
        <NavButton to={VIEW_PATHS.artworkGeneration} label={TITLE.ARTWORK_GENERATION} side="left" />
        <NavButton to={VIEW_PATHS.cardsGeneration} label={TITLE.CARDS_GENERATION} side="right" />
      </div>

      <h1>{TITLE.LYRICS}</h1>

        <button type="button" className="last-generation mv-0"
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
          </div>
        : <form className="search-form flexbox"
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
          </form>
        }

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
          </button>
        }

      <LyricsContext.Provider value={contextValue}>
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
      </LyricsContext.Provider>

      <span className="top-bot-spacer" />
    </div>
  )
};

export default Lyrics;