import { FormEvent, TransitionStartFunction } from "react";
import { NavigateFunction } from "react-router-dom";

import { sendToast } from "@common/toast";
import { FileUploadRequest, ItunesRequest, ItunesResult, StateSetter, YoutubeRequest } from "@common/types";
import { isFileExtensionAccepted } from "@common/utils/fileUtils";

import { FILE_UPLOAD } from "@constants/ArtworkGeneration";
import { TOAST, TOAST_TYPE } from "@constants/toasts";

import { postFileUpload, postItunesResult, postItunesSearch, postYoutubeUrl } from "./requests";
import { isValidYoutubeUrl } from "./utils";

export type StateHook<T> = [T, StateSetter<T>];

export const handleSubmitItunesImage = (item: ItunesResult, key: number, processingLoadingState: StateHook<boolean>, navigate: NavigateFunction) => {
  const [isProcessingLoading, setIsProcessingLoading] = processingLoadingState;

  if (isProcessingLoading) {
    sendToast(TOAST.PROCESSING_IN_PROGRESS, TOAST_TYPE.WARN);
    return;
  }

  const body = {
    url: item.artworkUrl100,
  };

  postItunesResult(body, key, {setIsProcessingLoading, navigate});
};

export const handleSubmitItunesSearch = (e: FormEvent<HTMLFormElement> | undefined, body: ItunesRequest, setItunesResults: StateSetter<ItunesResult[]>) => {
  e?.preventDefault();

  postItunesSearch(body, {setItunesResults});
};

export const handleChangeTerm = (value: string, country: string, setTerm: StateSetter<string>, startItunesSearch: TransitionStartFunction, setItunesResults: StateSetter<ItunesResult[]>) => {
  setTerm(value);
  startItunesSearch(() => {
    value && handleSubmitItunesSearch(undefined, {term: value, country}, setItunesResults);
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

  postFileUpload(formData, {setIsProcessingLoading, navigate});
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

  postYoutubeUrl(body, {setIsProcessingLoading, navigate});
};