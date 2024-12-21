import { FormEvent } from "react";

import { sendToast } from "@/common/Toast";
import { StateSetter } from "@/common/types";
import { isFileExtensionAccepted } from "@/common/utils/fileUtils";
import { ACCEPTED_IMG_EXTENSIONS } from "@/constants/files";
import { Toast, ToastType } from "@/constants/toasts";

import { ARTWORK_GENERATION_OPTIONS, AutomaticSearchTriggers } from "./constants";
import { postFileUpload, postItunesResult, postItunesSearch, postYoutubeUrl } from "./requests";
import { FileUploadRequest, GenerationOptionState, HandleChangeTermProps, HandleSubmitArtworkGenerationProps, HandleSubmitItunesSearchProps, ItunesRequest, ItunesResult, YoutubeRequest } from "./types";
import { isValidYoutubeUrl } from "./utils";

export const handleSelectItunesImage = (
  item: ItunesResult, key: number,
  props: HandleSubmitArtworkGenerationProps
) => {
  const { isProcessingLoading, setIsProcessingLoading, navigate } = props;

  if (isProcessingLoading) {
    sendToast(Toast.ProcessingInProgress, ToastType.Warn);
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
    value.length > AutomaticSearchTriggers.Length
    || (value.length > AutomaticSearchTriggers.LengthWithoutTerm && (
      value.includes(AutomaticSearchTriggers.Space)
      || (!term.length && value.length > AutomaticSearchTriggers.LengthWithoutTerm)
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
    sendToast(Toast.ProcessingInProgress, ToastType.Warn);
    return;
  }

  if (!body.localFile) {
    sendToast(Toast.NoImgFile, ToastType.Warn);
    return;
  }

  const formData = new FormData();
  formData.append("file", body.localFile);
  formData.append("includeCenterArtwork", body.includeCenterArtwork.toString());

  const fileExtensionIsAccepted = isFileExtensionAccepted(body.localFile.name, ACCEPTED_IMG_EXTENSIONS);
  if (!fileExtensionIsAccepted) {
    sendToast(
      Toast.InvalidFileType + "\n" +
        "Accepted file extensions: " + ACCEPTED_IMG_EXTENSIONS.join(", ") + ".",
      ToastType.Error
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
    sendToast(Toast.ProcessingInProgress, ToastType.Warn);
    return;
  }

  if (!isValidYoutubeUrl(body.url)) {
    sendToast(Toast.InvalidUrl, ToastType.Error);
    return;
  }

  postYoutubeUrl(body, {setIsProcessingLoading, navigate});
};

export const handleOnMouseOver = (i: number, setter: StateSetter<GenerationOptionState>) => {
  setter({
    current: i,
    prevLabel: i > 0 ? ARTWORK_GENERATION_OPTIONS[i - 1].h1 : "",
    nextLabel: i < ARTWORK_GENERATION_OPTIONS.length - 1 ? ARTWORK_GENERATION_OPTIONS[i + 1].h1 : ""
  });
};