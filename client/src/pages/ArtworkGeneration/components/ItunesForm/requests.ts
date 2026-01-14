import { is2xxSuccessful, sendRequest } from "@/common/requests";
import { hideSpinner, showSpinner } from "@/common/Spinner";
import { sendToast } from "@/common/Toast";
import { ApiResponse, RestVerb, StateSetter } from "@/common/types";
import { API, BACKEND_URL } from "@/constants/paths";
import { SpinnerId } from "@/constants/spinners";
import { ToastType } from "@/constants/toasts";
import { getToasts } from "@/contexts";
import { ItunesResult } from "@/pages/ArtworkGeneration/components/ItunesResults/types";

import { ArtworkResultProps } from "./constants";
import { ItunesRequest, ItunesResponse } from "./types";
import { getTitleWithAdjustedLength } from "./utils";

export const postItunesSearch = (
  body: ItunesRequest,
  props: {
    setIsSearching: StateSetter<boolean>;
    setItunesResults: StateSetter<ItunesResult[]>;
  }
) => {
  const toasts = getToasts();

  const { setIsSearching, setItunesResults } = props;

  setIsSearching(true);
  showSpinner(SpinnerId.ItunesSearch);

  sendRequest(RestVerb.Post, BACKEND_URL + API.ARTWORK_GENERATION.ITUNES_SEARCH, body)
    .then((response: ItunesResponse) => {
      if (!is2xxSuccessful(response.status)) {
        throw new Error(response.message);
      }

      const resultItems: ItunesResult[] = [];

      if (response.data.resultCount > 0) {
        response.data.results.forEach((result) => {
          if (result.artistName?.length > ArtworkResultProps.MaxTitleLength)
            result.artistName = getTitleWithAdjustedLength(result.artistName);
          if (result.collectionName?.length > ArtworkResultProps.MaxTitleLength)
            result.collectionName = getTitleWithAdjustedLength(result.collectionName);

          resultItems.push({
            resultId: resultItems.length,
            artistName: result.artistName,
            collectionName: result.collectionName,
            trackName: result.trackName,
            artworkUrl100: result.artworkUrl100.replace("100x100", "3000x3000"), // itunes max image size is 3000x3000
          });
        });
        setItunesResults(resultItems.slice(0, 6));
      } else {
        sendToast(toasts.ArtGen.NoResultsFound, ToastType.Warn);
      }
    })
    .catch((error: ApiResponse) => {
      setItunesResults([]);
      sendToast(error.message, ToastType.Error);
    })
    .finally(() => {
      hideSpinner(SpinnerId.ItunesSearch);
      setIsSearching(false);
    });
};
