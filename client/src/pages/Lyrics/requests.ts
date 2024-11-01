import { is2xxSuccessful, sendRequest } from "@/common/requests";
import { hideSpinner, showSpinner } from "@/common/spinner";
import { sendToast } from "@/common/toast";
import { ApiResponse, Dict, LyricsPart, LyricsResponse, PageMetadata, StateSetter } from "@/common/types";

import { SESSION_STORAGE } from "@constants/Common";
import { API, BACKEND_URL, VIEW_PATHS } from "@constants/Paths";
import { SPINNER_ID } from "@constants/Spinner";
import { TOAST_TYPE } from "@constants/Toast";
import { NavigateFunction } from "react-router-dom";

type LyricsSaveProps = {
  pageMetadata: PageMetadata;
  isManual: boolean;
  lyricsParts: LyricsPart[];
  dismissedParts: Set<number>;
  navigate: NavigateFunction;
  setIsSavingCardsContent: StateSetter<boolean>;
};
export const postLyricsSave = (body: unknown, props: LyricsSaveProps) => {
  const { pageMetadata, isManual, lyricsParts, dismissedParts, navigate, setIsSavingCardsContent } = props;

  setIsSavingCardsContent(true);
  showSpinner(SPINNER_ID.LYRICS_CONVERT);

  sendRequest("POST", BACKEND_URL + API.CARDS_GENERATION.SAVE_CARDS_CONTENTS, body).then((response: ApiResponse) => {
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

type LyricsSearchProps = {
  setIsFetching: StateSetter<boolean>;
  setLyricsParts: StateSetter<LyricsPart[]>;
  setPageMetadata: StateSetter<PageMetadata>;
};
export const postLyricsSearch = (body: unknown, props: LyricsSearchProps) => {
  const { setIsFetching, setLyricsParts, setPageMetadata } = props;

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
