import { NavigateFunction } from "react-router-dom";

import { is2xxSuccessful, sendRequest } from "@/common/requests";
import { hideSpinner, showSpinner } from "@/common/Spinner";
import { sendToast } from "@/common/Toast";
import { ApiResponse, RestVerb, StateSetter } from "@/common/types";
import { API, BACKEND_URL, ViewPaths } from "@/constants/paths";
import { SpinnerId } from "@/constants/spinners";
import { Toast, ToastType } from "@/constants/toasts";

import { ArtworkResultProps } from "./constants";
import { ItunesImageRequest, ItunesRequest, ItunesResponse, ItunesResult, YoutubeRequest } from "./types";
import { getTitleWithAdjustedLength } from "./utils";

export const postItunesResult = (
  body: ItunesImageRequest, key: number,
  props: { setIsProcessingLoading: StateSetter<boolean>, navigate: NavigateFunction }
) => {
  const { setIsProcessingLoading, navigate } = props;

  setIsProcessingLoading(true);
  const spinnerKey = SpinnerId.ItunesResult + key.toString();
  showSpinner(spinnerKey);

  setTimeout(() => { // to allow setIsProcessingLoading to get into effect
    sendRequest(RestVerb.Post, BACKEND_URL + API.ARTWORK_GENERATION.ITUNES, body).then((response: ApiResponse) => {
      if (!is2xxSuccessful(response.status)) {
        throw new Error(response.message);
      }

      sendRequest(RestVerb.Post, BACKEND_URL + API.ARTWORK_PROCESSING.PROCESS_ARTWORKS).then(() => {
        navigate(ViewPaths.ProcessedArtworks);
      }).catch((error: ApiResponse) => {
        sendToast(error.message, ToastType.Error);
      }).finally(() => {
        hideSpinner(spinnerKey);
        setIsProcessingLoading(false);
      });
    }).catch((error: ApiResponse) => {
      sendToast(error.message, ToastType.Error);
      setIsProcessingLoading(false);
    });
  }, 0);
};

export const postItunesSearch = (
  body: ItunesRequest,
  props: { setItunesResults: StateSetter<ItunesResult[]> }
) => {
  const { setItunesResults } = props;

  showSpinner(SpinnerId.ItunesSearch);

  const resultItems: ItunesResult[] = [];

  sendRequest(RestVerb.Post, BACKEND_URL + API.ARTWORK_GENERATION.ITUNES_SEARCH, body).then((response: ItunesResponse) => {
    if (!is2xxSuccessful(response.status)) {
      throw new Error(response.message);
    }

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
      setItunesResults(resultItems);
    } else {
      sendToast(Toast.NoResultsFound, ToastType.Warn);
    }
  }).catch((error: ApiResponse) => {
    setItunesResults([]);
    sendToast(error.message, ToastType.Error);
  }).finally(() => {
    hideSpinner(SpinnerId.ItunesSearch);
  });
};

export const postFileUpload = (
  formData: FormData,
  props: { setIsProcessingLoading: StateSetter<boolean>, navigate: NavigateFunction }
) => {
  const { setIsProcessingLoading, navigate } = props;

  setIsProcessingLoading(true);
  showSpinner(SpinnerId.FileUpload);

  sendRequest(RestVerb.Post, BACKEND_URL + API.ARTWORK_GENERATION.FILE_UPLOAD, formData).then((response: ApiResponse) => {
    if (!is2xxSuccessful(response.status)) {
      throw new Error(response.message);
    }

    sendRequest(RestVerb.Post, BACKEND_URL + API.ARTWORK_PROCESSING.PROCESS_ARTWORKS).then(() => {
      navigate(ViewPaths.ProcessedArtworks);
    }).catch((error: ApiResponse) => {
      sendToast(error.message, ToastType.Error);
    }).finally(() => {
      hideSpinner(SpinnerId.FileUpload);
      setIsProcessingLoading(false);
    });
  }).catch((error: ApiResponse) => {
    sendToast(error.message, ToastType.Error);
    hideSpinner(SpinnerId.FileUpload);
    setIsProcessingLoading(false);
  });
};

export const postYoutubeUrl = (
  body: YoutubeRequest,
  props: { setIsProcessingLoading: StateSetter<boolean>, navigate: NavigateFunction }
) => {
  const { setIsProcessingLoading, navigate } = props;

  setIsProcessingLoading(true);
  showSpinner(SpinnerId.YoutubeUrl);

  sendRequest(RestVerb.Post, BACKEND_URL + API.ARTWORK_GENERATION.YOUTUBE_THUMBNAIL, body).then((response: ApiResponse) => {
    if (!is2xxSuccessful(response.status)) {
      throw new Error(response.message);
    }

    sendRequest(RestVerb.Post, BACKEND_URL + API.ARTWORK_PROCESSING.PROCESS_ARTWORKS).then(() => {
      navigate(ViewPaths.ProcessedArtworks);
    }).catch((error: ApiResponse) => {
      sendToast(error.message, ToastType.Error);
    }).finally(() => {
      hideSpinner(SpinnerId.YoutubeUrl);
      setIsProcessingLoading(false);
    });
  }).catch((error: ApiResponse) => {
    sendToast(error.message, ToastType.Error);
    hideSpinner(SpinnerId.YoutubeUrl);
    setIsProcessingLoading(false);
  });
};