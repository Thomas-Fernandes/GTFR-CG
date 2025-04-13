import { is2xxSuccessful, sendRequest } from "@/common/requests";
import { hideSpinner, showSpinner } from "@/common/Spinner";
import { sendToast } from "@/common/Toast";
import { ApiResponse, RestVerb } from "@/common/types";
import { API, BACKEND_URL } from "@/constants/paths";
import { ResponseStatus } from "@/constants/requests";
import { SpinnerId } from "@/constants/spinners";
import { ToastType } from "@/constants/toasts";

import { METADATA_SECTION } from "./constants";
import { LyricsRequest, LyricsResponse, LyricsSearchProps } from "./types";
import { strArrToMetadata } from "./utils";

export const postLyricsSearch = (body: LyricsRequest, props: LyricsSearchProps) => {
  const { setIsFetching, setLyricsParts, setPageMetadata } = props;

  setIsFetching(true);
  showSpinner(SpinnerId.LyricsSearch);

  sendRequest(RestVerb.Post, BACKEND_URL + API.LYRICS.GET_LYRICS, body)
    .then((response: LyricsResponse) => {
      if (!is2xxSuccessful(response.status)) {
        throw new Error(response.message);
      }

      const responseFirstSection = response.data.lyricsParts[0].section;
      if (responseFirstSection === ResponseStatus.Error || responseFirstSection === ResponseStatus.Warn) {
        sendToast(
          response.data.lyricsParts[0].lyrics,
          responseFirstSection === ResponseStatus.Error ? ToastType.Error : ToastType.Warn
        );
        setLyricsParts([]);
      } else {
        const metadata =
          response.data.lyricsParts.find((part) => part.section === METADATA_SECTION)?.lyrics.split("\n") ?? [];
        const metadataObj = strArrToMetadata(metadata);
        setPageMetadata(metadataObj);

        const lyricsParts = response.data.lyricsParts.filter((part) => part.section !== METADATA_SECTION);
        setLyricsParts(lyricsParts);
      }
    })
    .catch((error: ApiResponse) => {
      sendToast(error.message, ToastType.Error);
      setLyricsParts([]);
    })
    .finally(() => {
      hideSpinner(SpinnerId.LyricsSearch);
      setIsFetching(false);
    });
};

export const isTokenSet = async (): Promise<boolean> => {
  return sendRequest(RestVerb.Get, BACKEND_URL + API.GENIUS_TOKEN)
    .then((response) => {
      return is2xxSuccessful(response.status) && response.data.token !== "";
    })
    .catch((error) => {
      sendToast(error.message, ToastType.Error);
      return false;
    });
};
