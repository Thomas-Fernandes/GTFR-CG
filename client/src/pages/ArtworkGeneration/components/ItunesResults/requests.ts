import { NavigateFunction } from "react-router-dom";

import { is2xxSuccessful, sendRequest } from "@/common/requests";
import { hideSpinner, showSpinner } from "@/common/Spinner";
import { sendToast } from "@/common/Toast";
import { ApiResponse, RestVerb, StateSetter } from "@/common/types";
import { API, BACKEND_URL, ViewPaths } from "@/constants/paths";
import { SpinnerId } from "@/constants/spinners";
import { ToastType } from "@/constants/toasts";

import { ItunesImageRequest } from "./types";

export const postItunesResult = (
  body: ItunesImageRequest,
  key: number,
  props: { setIsProcessingLoading: StateSetter<boolean>; navigate: NavigateFunction }
) => {
  const { setIsProcessingLoading, navigate } = props;

  setIsProcessingLoading(true);
  const spinnerKey = SpinnerId.ItunesResult + key.toString();
  showSpinner(spinnerKey);

  setTimeout(() => {
    // to allow setIsProcessingLoading to get into effect
    sendRequest(RestVerb.Post, BACKEND_URL + API.ARTWORK_GENERATION.ITUNES, body)
      .then((response: ApiResponse) => {
        if (!is2xxSuccessful(response.status)) {
          throw new Error(response.message);
        }

        sendRequest(RestVerb.Post, BACKEND_URL + API.ARTWORK_PROCESSING.PROCESS_ARTWORKS)
          .then(() => {
            navigate(ViewPaths.ProcessedArtworks);
          })
          .catch((error: ApiResponse) => {
            sendToast(error.message, ToastType.Error);
          })
          .finally(() => {
            hideSpinner(spinnerKey);
            setIsProcessingLoading(false);
          });
      })
      .catch((error: ApiResponse) => {
        sendToast(error.message, ToastType.Error);
        setIsProcessingLoading(false);
      });
  }, 0);
};
