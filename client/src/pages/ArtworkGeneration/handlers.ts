import { FormEvent, TransitionStartFunction } from "react";
import { NavigateFunction } from "react-router-dom";

import { is2xxSuccessful, sendRequest } from "../../common/Requests";
import { hideSpinner, showSpinner } from "../../common/Spinner";
import { sendToast } from "../../common/Toast";
import { ApiResponse, FileUploadRequest, ItunesRequest, ItunesResponse, ItunesResult, StateSetter, YoutubeRequest } from "../../common/Types";
import { isFileExtensionAccepted } from "../../common/utils/FileUtils";

import { FILE_UPLOAD, ITUNES } from "../../constants/ArtworkGeneration";
import { API, BACKEND_URL, VIEW_PATHS } from "../../constants/Paths";
import { SPINNER_ID } from "../../constants/Spinner";
import { TOAST, TOAST_TYPE } from "../../constants/Toast";
import { getTitleWithAdjustedLength, isValidYoutubeUrl } from "./utils";

export type StateHook<T> = [T, (value: T) => void];

export const handleSubmitItunesResult = (item: ItunesResult, key: number, processingLoadingState: StateHook<boolean>, navigate: NavigateFunction) => {
  const [isProcessingLoading, setIsProcessingLoading] = processingLoadingState;

  if (isProcessingLoading) {
    sendToast(TOAST.PROCESSING_IN_PROGRESS, TOAST_TYPE.WARN);
    return;
  }

  const data = {
    url: item.artworkUrl100,
  };

  setIsProcessingLoading(true);
  const spinnerKey = SPINNER_ID.ITUNES_OPTION + key.toString();
  showSpinner(spinnerKey);

  sendRequest("POST", BACKEND_URL + API.ARTWORK_GENERATION.ITUNES, data).then((response: ApiResponse) => {
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

export const handleSubmitItunesSearch = (e: FormEvent<HTMLFormElement>, body: ItunesRequest, setItunesResults: StateSetter<ItunesResult[]>) => {
  e.preventDefault();

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

export const handleChangeTerm = (value: string, country: string, setTerm: StateSetter<string>, startItunesSearch: TransitionStartFunction, setItunesResults: StateSetter<ItunesResult[]>) => {
  setTerm(value);
  startItunesSearch(() => {
    value && handleSubmitItunesSearch({preventDefault: () => {}} as FormEvent<HTMLFormElement>, {term: value, country}, setItunesResults);
  });
};

export const handleSubmitFileUpload = (e: FormEvent<HTMLFormElement>, body: FileUploadRequest, processingLoadingState: StateHook<boolean>, navigate: NavigateFunction) => {
  const [isProcessingLoading, setIsProcessingLoading] = processingLoadingState;

  e.preventDefault();

  if (isProcessingLoading) {
    sendToast(TOAST.PROCESSING_IN_PROGRESS, TOAST_TYPE.WARN);
    return;
  }

  if (!body.localFile) {
    sendToast(TOAST.NO_IMG, TOAST_TYPE.WARN);
    return;
  }

  const formData = new FormData();
  formData.append("file", body.localFile);
  formData.append("includeCenterArtwork", body.includeCenterArtwork.toString());

  const fileExtensionIsAccepted = isFileExtensionAccepted(body.localFile.name, FILE_UPLOAD.ACCEPTED_IMG_EXTENSIONS);
  if (!fileExtensionIsAccepted) {
    sendToast(
      TOAST.INVALID_FILE_TYPE + "\n" +
        "Accepted file extensions: " + FILE_UPLOAD.ACCEPTED_IMG_EXTENSIONS.join(", ") + ".",
      TOAST_TYPE.ERROR
    );
    return;
  }

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

export const handleSubmitYoutubeUrl = (e: FormEvent<HTMLFormElement>, body: YoutubeRequest, processingLoadingState: StateHook<boolean>, navigate: NavigateFunction) => {
  const [isProcessingLoading, setIsProcessingLoading] = processingLoadingState;

  e.preventDefault();

  if (isProcessingLoading) {
    sendToast(TOAST.PROCESSING_IN_PROGRESS, TOAST_TYPE.WARN);
    return;
  }

  if (!isValidYoutubeUrl(body.url)) {
    sendToast(TOAST.INVALID_URL, TOAST_TYPE.ERROR);
    return;
  }

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