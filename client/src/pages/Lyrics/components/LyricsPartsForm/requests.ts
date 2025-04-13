import { is2xxSuccessful, sendRequest } from "@/common/requests";
import { hideSpinner, showSpinner } from "@/common/Spinner";
import { sendToast } from "@/common/Toast";
import { ApiResponse, ContentsGenerationMode, RestVerb } from "@/common/types";
import { SessionStorage } from "@/constants/browser";
import { API, BACKEND_URL, ViewPaths } from "@/constants/paths";
import { SpinnerId } from "@/constants/spinners";
import { ToastType } from "@/constants/toasts";

import { LyricsSaveProps, LyricsSaveRequest } from "./types";

export const postLyricsSave = (body: LyricsSaveRequest, props: LyricsSaveProps) => {
  const { pageMetadata, isManual, lyricsParts, dismissedParts, navigate, setIsSavingCardsContent } = props;

  setIsSavingCardsContent(true);
  showSpinner(SpinnerId.LyricsConvert);

  sendRequest(RestVerb.Post, BACKEND_URL + API.CARDS_GENERATION.SAVE_CARDS_CONTENTS, body)
    .then((response: ApiResponse) => {
      if (!is2xxSuccessful(response.status)) {
        throw new Error(response.message);
      }

      const cardArtist = pageMetadata.artist.toLowerCase().startsWith("genius")
        ? pageMetadata.title.split(" - ")[0]
        : pageMetadata.artist;
      const cardSongName = pageMetadata.artist.toLowerCase().startsWith("genius")
        ? pageMetadata.title.split(" - ")[1].split(" (")[0]
        : pageMetadata.title;
      const cardMetaname = `${cardArtist.trim().toUpperCase()}, “${cardSongName.trim().toUpperCase()}”`;
      sessionStorage.setItem(SessionStorage.CardMetaname, cardMetaname);
      sessionStorage.setItem(
        SessionStorage.CardMethod,
        isManual ? ContentsGenerationMode.Manual : ContentsGenerationMode.Auto
      );
      sessionStorage.setItem(SessionStorage.OutroContributors, (pageMetadata.contributors ?? []).toString());
      sessionStorage.setItem(
        SessionStorage.LatestCardGeneration,
        JSON.stringify({
          pageMetadata,
          lyricsParts,
          dismissedParts: Array.from(dismissedParts),
        })
      );
      navigate(ViewPaths.CardsGeneration);
    })
    .catch((error: ApiResponse) => {
      sendToast(error.message, ToastType.Error);
    })
    .finally(() => {
      hideSpinner(SpinnerId.LyricsConvert);
      setIsSavingCardsContent(false);
    });
};
