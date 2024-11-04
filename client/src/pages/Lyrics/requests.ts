import { is2xxSuccessful, sendRequest } from "@common/requests";
import { hideSpinner, showSpinner } from "@common/spinner";
import { sendToast } from "@common/toast";
import { ApiResponse, ContentsGenerationMode, RestVerb } from "@common/types";

import { SessionStorage } from "@constants/browser";
import { API, BACKEND_URL, ViewPaths } from "@constants/paths";
import { ResponseStatus } from "@constants/requests";
import { SpinnerId } from "@constants/spinners";
import { ToastType } from "@constants/toasts";

import { METADATA_SECTION } from "./constants";
import { LyricsRequest, LyricsResponse, LyricsSaveProps, LyricsSaveRequest, LyricsSearchProps } from "./types";
import { strArrToMetadata } from "./utils";

export const postLyricsSave = (body: LyricsSaveRequest, props: LyricsSaveProps) => {
  const { pageMetadata, isManual, lyricsParts, dismissedParts, navigate, setIsSavingCardsContent } = props;

  setIsSavingCardsContent(true);
  showSpinner(SpinnerId.LyricsConvert);

  sendRequest(RestVerb.Post, BACKEND_URL + API.CARDS_GENERATION.SAVE_CARDS_CONTENTS, body).then((response: ApiResponse) => {
    if (!is2xxSuccessful(response.status)) {
      throw new Error(response.message);
    }

    const cardArtist = pageMetadata.artist.toLowerCase().startsWith("genius") ? pageMetadata.title.split(" - ")[0] : pageMetadata.artist;
    const cardSongName = pageMetadata.artist.toLowerCase().startsWith("genius") ? pageMetadata.title.split(" - ")[1].split(" (")[0] : pageMetadata.title;
    const cardMetaname = `${cardArtist.trim().toUpperCase()}, “${cardSongName.trim().toUpperCase()}”`;
    sessionStorage.setItem(SessionStorage.CardMetaname, cardMetaname);
    sessionStorage.setItem(SessionStorage.CardMethod, isManual ? ContentsGenerationMode.Manual : ContentsGenerationMode.Auto);
    sessionStorage.setItem(SessionStorage.OutroContributors, (pageMetadata.contributors ?? []).toString());
    sessionStorage.setItem(SessionStorage.LatestCardGeneration, JSON.stringify({
      pageMetadata, lyricsParts, dismissedParts: Array.from(dismissedParts)
    }));
    navigate(ViewPaths.CardsGeneration);
  }).catch((error: ApiResponse) => {
    sendToast(error.message, ToastType.Error);
  }).finally(() => {
    hideSpinner(SpinnerId.LyricsConvert);
    setIsSavingCardsContent(false);
  });
};

export const postLyricsSearch = (body: LyricsRequest, props: LyricsSearchProps) => {
  const { setIsFetching, setLyricsParts, setPageMetadata } = props;

  setIsFetching(true);
  showSpinner(SpinnerId.LyricsSearch);

  sendRequest(RestVerb.Post, BACKEND_URL + API.LYRICS.GET_LYRICS, body).then((response: LyricsResponse) => {
    if (!is2xxSuccessful(response.status)) {
      throw new Error(response.message);
    }

    const responseFirstSection = response.data.lyricsParts[0].section;
    if (responseFirstSection === ResponseStatus.Error || responseFirstSection === ResponseStatus.Warn) {
      sendToast(
        response.data.lyricsParts[0].lyrics,
        (responseFirstSection === ResponseStatus.Error) ? ToastType.Error : ToastType.Warn
      );
      setLyricsParts([]);
    } else {
      const metadata = response.data.lyricsParts.find(part => part.section === METADATA_SECTION)?.lyrics.split("\n") ?? [];
      const metadataObj = strArrToMetadata(metadata);
      setPageMetadata(metadataObj);

      const lyricsParts = response.data.lyricsParts.filter(part => part.section !== METADATA_SECTION);
      setLyricsParts(lyricsParts);
    }
  }).catch((error: ApiResponse) => {
    sendToast(error.message, ToastType.Error);
    setLyricsParts([]);
  }).finally(() => {
    hideSpinner(SpinnerId.LyricsSearch);
    setIsFetching(false);
  });
};

export const isTokenSet = async (): Promise<boolean> => {
  return sendRequest(RestVerb.Get, BACKEND_URL + API.GENIUS_TOKEN).then((response) => {
    return is2xxSuccessful(response.status) && response.data.token !== "";
  }).catch((error) => {
    sendToast(error.message, ToastType.Error);
    return false;
  });
};