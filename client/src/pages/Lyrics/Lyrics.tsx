import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { is2xxSuccessful, sendRequest } from "../../common/Requests";
import { hideSpinner, showSpinner } from "../../common/Spinner";
import { sendToast } from "../../common/Toast";
import { ApiResponse, Dict, LyricsContents, LyricsPart, LyricsRequest, LyricsResponse, PageMetadata, SongPartsCards } from "../../common/Types";
import useTitle from "../../common/UseTitle";

import { AutoResizeTextarea } from "../../components/AutoResizeTextarea";

import { SESSION_STORAGE, TITLE } from "../../constants/Common";
import { API, BACKEND_URL, VIEW_PATHS } from "../../constants/Paths";
import { SPINNER_ID } from "../../constants/Spinner";
import { TOAST, TOAST_TYPE } from "../../constants/Toast";

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

  // Lyrics
  const handleLyricsSaveSubmit = (e: FormEvent<HTMLFormElement>, body: SongPartsCards) => {
    e.preventDefault();

    if (isSavingCardsContent) {
      sendToast(TOAST.PROCESSING_IN_PROGRESS, TOAST_TYPE.WARN);
      return;
    }

    setIsSavingCardsContent(true);
    showSpinner(SPINNER_ID.LYRICS_CONVERT);

    const metadata = "Metadata | " + Object.entries(pageMetadata).map(([key, value]) => `${key}: ${value}`).join(" ;;; ");
    const data = {
      cardsContents: [[metadata]].concat(body),
    };

    sendRequest("POST", BACKEND_URL + API.CARDS_GENERATION.SAVE_CARDS_CONTENTS, data).then((response: ApiResponse) => {
      if (!is2xxSuccessful(response.status)) {
        throw new Error(response.message);
      }

      const cardArtist = pageMetadata.artist.toLowerCase().startsWith("genius") ? pageMetadata.title.split(" - ")[0] : pageMetadata.artist;
      const cardSongName = pageMetadata.artist.toLowerCase().startsWith("genius") ? pageMetadata.title.split(" - ")[1].split(" (")[0] : pageMetadata.title;
      const cardMetaname = `${cardArtist.trim().toUpperCase()}, “${cardSongName.trim().toUpperCase()}”`;
      sessionStorage.setItem(SESSION_STORAGE.CARD_METANAME, cardMetaname);
      sessionStorage.setItem(SESSION_STORAGE.CARD_METHOD, isManual ? "manual" : "auto");
      sessionStorage.setItem(SESSION_STORAGE.OUTRO_CONTRIBUTORS, (pageMetadata.contributors ?? []).toString());
      sessionStorage.setItem(SESSION_STORAGE.LATEST_CARD_GENERATION, JSON.stringify({
        pageMetadata, lyricsParts, dismissedParts: Array.from(dismissedParts)
      }));
      navigate(VIEW_PATHS.cardsGeneration);
    }).catch((error: ApiResponse) => {
      sendToast(error.message, TOAST_TYPE.ERROR);
    }).finally(() => {
      hideSpinner(SPINNER_ID.LYRICS_CONVERT);
      setIsSavingCardsContent(false);
    });
  };

  const convertToCardContents = (lyricsParts: LyricsPart[], dismissedParts: Set<number>): SongPartsCards => {
    // Input: [{section: "Verse 1", lyrics: "The whole lyrics\nOf the section\nAre here as is\nTotally disorganized"}, ...]
    // Output: [["The whole lyrics\nOf the section", "Are here as is\nTotally disorganized"], ...]
    //   -> Each inner array is a section, each string is a card
    return lyricsParts.filter((_, idx) => !dismissedParts.has(idx)).map(part => part.lyrics.trim().split("\n\n"));
  };

  const handleSetLyricsParts = (lyrics: string, idx: number) => {
    const updatedLyricsParts = [...lyricsParts];
    updatedLyricsParts[idx].lyrics = lyrics;
    setLyricsParts(updatedLyricsParts);
  };

  // Search
  const renderLyricsPart = (part: LyricsPart, idx: number): JSX.Element => {
    return (
      <div key={"part_" + idx} className="lyrics-part">
        { dismissedParts.has(idx)
        ? <div className="lyrics-part--header flexbox flex-row g-2">
          <button type="button" className="restore" onClick={() => { const n = new Set(dismissedParts); n.delete(idx); setDismissedParts(n)}}>
            {`Restore ${part.section}`}
          </button>
        </div> : <>
        <div className="lyrics-part--header flexbox flex-row g-2">
          <button type="button" className="red" onClick={() => setDismissedParts(new Set(dismissedParts).add(idx))}>
            {"Remove"}
          </button>
          <label>{part.section}</label>
          <button type="button" className="green" onClick={() => handleSetLyricsParts("", idx)}>
            {"Clear"}
          </button>
          </div>
          <AutoResizeTextarea title={`lyrics-part_${idx}`}
            value={part.lyrics} onChange={(e) => handleSetLyricsParts(e.target.value, idx)}
          />
        </>}
        <hr className="w-66 mv-0" />
      </div>
    );
  };

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
        const metadataObj = metadata.reduce((acc: PageMetadata, curr) => {
          const [key, value] = curr.split(": ");
          (acc as Dict)[key] = value;
          return acc;
        }, {} as PageMetadata);
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

  const handleLoadLastContents = () => {
    if (lastContents?.pageMetadata?.id === undefined) {
      sendToast(TOAST.NO_LAST_GENERATION, TOAST_TYPE.WARN);
      return;
    }
    setPageMetadata(lastContents.pageMetadata);
    setLyricsParts(lastContents.lyricsParts);
    setDismissedParts(new Set(lastContents.dismissedParts));
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

      <button type="button" className="last-generation" onClick={handleLoadLastContents}>
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
      </div> : <form className="search-form flexbox" onSubmit={(e) => handleLyricsSearchSubmit(e, {artist, songName})}>
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

        <form className="lyrics-form flexbox" onSubmit={(e) => handleLyricsSaveSubmit(e, convertToCardContents(lyricsParts, dismissedParts))}>
          { lyricsParts.map((part, idx) =>
            renderLyricsPart(part, idx))
          }
          <div className="action-button" id={SPINNER_ID.LYRICS_CONVERT}>
            <input type="submit" value="CONVERT TO CARDS" className="action-button convert-button" />
          </div>
        </form>
      </>}
    </div>
  )
};

export default Lyrics;