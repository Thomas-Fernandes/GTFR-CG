import { FormEvent } from "react";

import { sendToast } from "@common/toast";
import { isFileExtensionAccepted } from "@common/utils/fileUtils";
import { FileUploadRequest, HandleChangeTermProps, HandleSubmitArtworkGenerationProps, HandleSubmitItunesSearchProps, ItunesRequest, ItunesResult, YoutubeRequest } from "@pages/ArtworkGeneration/types";

import { FILE_UPLOAD } from "@constants/ArtworkGeneration";
import { TOAST, TOAST_TYPE } from "@constants/toasts";

import { AUTOMATIC_SEARCH_TRIGGERS } from "./constants";
import { postFileUpload, postItunesResult, postItunesSearch, postYoutubeUrl } from "./requests";
import { isValidYoutubeUrl } from "./utils";

export const handleSubmitItunesImage = (
  item: ItunesResult, key: number,
  props: HandleSubmitArtworkGenerationProps
) => {
  const { isProcessingLoading, setIsProcessingLoading, navigate } = props;

  if (isProcessingLoading) {
    sendToast(TOAST.PROCESSING_IN_PROGRESS, TOAST_TYPE.WARN);
    return;
  }

  const body = {
    url: item.artworkUrl100,
  };

  postItunesResult(body, key, {setIsProcessingLoading, navigate});
};

export const handleSubmitItunesSearch = (
  e: FormEvent<HTMLFormElement> | undefined, body: ItunesRequest,
  props: HandleSubmitItunesSearchProps
) => {
  const { setItunesResults } = props;

  e?.preventDefault();

  postItunesSearch(body, {setItunesResults});
};

export const handleChangeTerm = (
  value: string, country: string,
  props: HandleChangeTermProps
) => {
  const { term, setTerm, startItunesSearch, setItunesResults } = props;

  const willMakeSearch = value && (
    value.length > AUTOMATIC_SEARCH_TRIGGERS.LENGTH
    || (value.length > AUTOMATIC_SEARCH_TRIGGERS.LENGTH_WITHOUT_TERM && (
      value.includes(AUTOMATIC_SEARCH_TRIGGERS.SPACE)
      || (!term.length && value.length > AUTOMATIC_SEARCH_TRIGGERS.LENGTH_WITHOUT_TERM)
    ))
  );

  setTerm(value);

  if (willMakeSearch)
    startItunesSearch(() => {
      handleSubmitItunesSearch(undefined, {term: value, country}, { setItunesResults });
    });
};

export const handleSubmitFileUpload = (
  e: FormEvent<HTMLFormElement>, body: FileUploadRequest,
  props: HandleSubmitArtworkGenerationProps
) => {
  const { isProcessingLoading, setIsProcessingLoading, navigate } = props;

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

export const handleSubmitYoutubeUrl = (
  e: FormEvent<HTMLFormElement>, body: YoutubeRequest,
  props: HandleSubmitArtworkGenerationProps
) => {
  const { isProcessingLoading, setIsProcessingLoading, navigate } = props;

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