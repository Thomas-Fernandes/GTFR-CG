import { NavigateFunction } from "react-router-dom";

import { is2xxSuccessful, sendRequest } from "@/common/requests";
import { hideSpinner, showSpinner } from "@/common/spinner";
import { sendToast } from "@/common/toast";
import { ApiResponse, ItunesImageRequest, ItunesRequest, ItunesResponse, ItunesResult, StateSetter, YoutubeRequest } from "@/common/types";

import { ITUNES } from "@constants/ArtworkGeneration";
import { API, BACKEND_URL, VIEW_PATHS } from "@constants/Paths";
import { SPINNER_ID } from "@constants/Spinner";
import { TOAST, TOAST_TYPE } from "@constants/Toast";
import { getTitleWithAdjustedLength } from "./utils";

export const postItunesResult = (
  body: ItunesImageRequest, key: number,
  props: { setIsProcessingLoading: StateSetter<boolean>, navigate: NavigateFunction }
) => {
  const { setIsProcessingLoading, navigate } = props;

  setIsProcessingLoading(true);
  const spinnerKey = SPINNER_ID.ITUNES_OPTION + key.toString();
  showSpinner(spinnerKey);

  sendRequest("POST", BACKEND_URL + API.ARTWORK_GENERATION.ITUNES, body).then((response: ApiResponse) => {
    if (!is2xxSuccessful(response.status)) {
      throw new Error(response.message);
    }

    sendRequest("POST", BACKEND_URL + API.PROCESSED_IMAGES.PROCESS_IMAGES).then(() => {
      navigate(VIEW_PATHS.processedImages);
    }).catch((error: ApiResponse) => {
      sendToast(error.message, TOAST_TYPE.ERROR);
    }).finally(() => {
      hideSpinner(spinnerKey);
      setIsProcessingLoading(false);
    });
  }).catch((error: ApiResponse) => {
    sendToast(error.message, TOAST_TYPE.ERROR);
    hideSpinner(spinnerKey);
    setIsProcessingLoading(false);
  });
};

export const postItunesSearch = (
  body: ItunesRequest,
  props: { setItunesResults: StateSetter<ItunesResult[]> }
) => {
  const { setItunesResults } = props;

  showSpinner(SPINNER_ID.ITUNES);

  const resultItems: ItunesResult[] = [];

  sendRequest("POST", BACKEND_URL + API.ARTWORK_GENERATION.ITUNES_SEARCH, body).then((response: ItunesResponse) => {
    if (!is2xxSuccessful(response.status)) {
      throw new Error(response.message);
    }

    if (response.data.resultCount > 0) {
      response.data.results.forEach((result) => {
        if (result.artistName?.length > ITUNES.MAX_TITLE_LENGTH)
          result.artistName = getTitleWithAdjustedLength(result.artistName);
        if (result.collectionName?.length > ITUNES.MAX_TITLE_LENGTH)
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
      sendToast(TOAST.NO_RESULTS_FOUND, TOAST_TYPE.WARN);
    }
  }).catch((error: ApiResponse) => {
    setItunesResults(resultItems);
    sendToast(error.message, TOAST_TYPE.ERROR);
  }).finally(() => {
    hideSpinner(SPINNER_ID.ITUNES);
  });
};

export const postFileUpload = (
  formData: FormData,
  props: { setIsProcessingLoading: StateSetter<boolean>, navigate: NavigateFunction }
) => {
  const { setIsProcessingLoading, navigate } = props;

  setIsProcessingLoading(true);
  showSpinner(SPINNER_ID.FILE_UPLOAD);

  sendRequest("POST", BACKEND_URL + API.ARTWORK_GENERATION.FILE_UPLOAD, formData).then((response: ApiResponse) => {
    if (!is2xxSuccessful(response.status)) {
      throw new Error(response.message);
    }

    sendRequest("POST", BACKEND_URL + API.PROCESSED_IMAGES.PROCESS_IMAGES).then(() => {
      navigate(VIEW_PATHS.processedImages);
    }).catch((error: ApiResponse) => {
      sendToast(error.message, TOAST_TYPE.ERROR);
    }).finally(() => {
      hideSpinner(SPINNER_ID.FILE_UPLOAD);
      setIsProcessingLoading(false);
    });
  }).catch((error: ApiResponse) => {
    sendToast(error.message, TOAST_TYPE.ERROR);
    hideSpinner(SPINNER_ID.FILE_UPLOAD);
    setIsProcessingLoading(false);
  });
};

export const postYoutubeUrl = (
  body: YoutubeRequest,
  props: { setIsProcessingLoading: StateSetter<boolean>, navigate: NavigateFunction }
) => {
  const { setIsProcessingLoading, navigate } = props;

  setIsProcessingLoading(true);
  showSpinner(SPINNER_ID.YOUTUBE_URL);

  sendRequest("POST", BACKEND_URL + API.ARTWORK_GENERATION.YOUTUBE_THUMBNAIL, body).then((response: ApiResponse) => {
    if (!is2xxSuccessful(response.status)) {
      throw new Error(response.message);
    }

    sendRequest("POST", BACKEND_URL + API.PROCESSED_IMAGES.PROCESS_IMAGES).then(() => {
      navigate(VIEW_PATHS.processedImages);
    }).catch((error: ApiResponse) => {
      sendToast(error.message, TOAST_TYPE.ERROR);
    }).finally(() => {
      hideSpinner(SPINNER_ID.YOUTUBE_URL);
      setIsProcessingLoading(false);
    });
  }).catch((error: ApiResponse) => {
    sendToast(error.message, TOAST_TYPE.ERROR);
    hideSpinner(SPINNER_ID.YOUTUBE_URL);
    setIsProcessingLoading(false);
  });
};