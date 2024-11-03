import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "@common/hooks/useTitle";

import NavButton from "@components/NavButton";
import ToastContainer from "@components/ToastContainer/ToastContainer";

import { SESSION_STORAGE, TITLE } from "@constants/browser";
import { VIEW_PATHS } from "@constants/paths";
import { TOAST } from "@constants/toasts";

import { LyricsContext } from "./contexts";
import GenerationModeFlipper from "./GenerationModeFlipper";
import { handleLoadLastContents } from "./handlers";
import LyricsPartsForm from "./LyricsPartsForm";
import LyricsSearchForm from "./LyricsSearchForm";
import ManualGenerationInputBar from "./ManualGenerationInputBar";
import { isTokenSet } from "./requests";
import { LyricsContents, LyricsPartType, PageMetadata } from "./types";

import "./Lyrics.css";

const Lyrics = (): JSX.Element => {
  useTitle(TITLE.LYRICS);

  const navigate = useNavigate();

  const [isGeniusTokenSet, setIsGeniusTokenSet] = useState(false);

  const [isFetching, setIsFetching] = useState(false);

  const [artist, setArtist] = useState("");
  const [songName, setSongName] = useState("");

  const [pageMetadata, setPageMetadata] = useState({} as PageMetadata);
  const [lyricsParts, setLyricsParts] = useState([] as LyricsPartType[]);
  const [lastContents, setLastContents] = useState({} as LyricsContents);

  const [isManual, setIsManual] = useState(false);

  const [dismissedParts, setDismissedParts] = useState(new Set<number>());

  const contextValue = useMemo(
    () => ({
      isFetching, setIsFetching, artist, setArtist, songName, setSongName, pageMetadata, setPageMetadata,
      lyricsParts, setLyricsParts, dismissedParts, setDismissedParts, isManual, setIsManual, navigate
    }),
    [
      isFetching, setIsFetching, artist, setArtist, songName, setSongName, pageMetadata, setPageMetadata,
      lyricsParts, setLyricsParts, dismissedParts, setDismissedParts, isManual, setIsManual, navigate
    ]
  );

  useEffect(() => {
    if (isGeniusTokenSet)
      return;

    isTokenSet().then((isSet) => {
      if (!isSet) {
        navigate(`${VIEW_PATHS.REDIRECT}?redirect_to=${VIEW_PATHS.HOME}&error_text=${TOAST.NO_GENIUS_TOKEN}`);
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
        <NavButton to={VIEW_PATHS.HOME} label={TITLE.HOME} side="left" />
        <NavButton to={VIEW_PATHS.ARTWORK_GENERATION} label={TITLE.ARTWORK_GENERATION} side="left" />
        <NavButton to={VIEW_PATHS.CARDS_GENERATION} label={TITLE.CARDS_GENERATION} side="right" />
      </div>

      <h1>{TITLE.LYRICS}</h1>

      <button type="button" className="last-generation mv-0"
        onClick={() => handleLoadLastContents({lastContents, setPageMetadata, setLyricsParts, setDismissedParts})}
      >
        {"Load last contents"}
      </button>

      <LyricsContext.Provider value={contextValue}>
        { isManual
          ? <ManualGenerationInputBar />
          : <LyricsSearchForm />
        }

        { !isFetching &&
          <GenerationModeFlipper />
        }

        { !isFetching && lyricsParts.length > 0 &&
          <>
            <hr className="mv-2" />

            <LyricsPartsForm lyricsParts={lyricsParts} />
          </>
        }
      </LyricsContext.Provider>

      <span className="top-bot-spacer" />
    </div>
  )
};

export default Lyrics;