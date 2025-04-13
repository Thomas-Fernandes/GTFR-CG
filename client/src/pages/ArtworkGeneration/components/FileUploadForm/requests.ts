import { NavigateFunction } from "react-router-dom";

import { is2xxSuccessful, sendRequest } from "@/common/requests";
import { hideSpinner, showSpinner } from "@/common/Spinner";
import { sendToast } from "@/common/Toast";
import { ApiResponse, RestVerb, StateSetter } from "@/common/types";
import { API, BACKEND_URL, ViewPaths } from "@/constants/paths";
import { SpinnerId } from "@/constants/spinners";
import { ToastType } from "@/constants/toasts";

export const postFileUpload = (
  formData: FormData,
  props: { setIsProcessingLoading: StateSetter<boolean>; navigate: NavigateFunction }
) => {
  const { setIsProcessingLoading, navigate } = props;

  setIsProcessingLoading(true);
  showSpinner(SpinnerId.FileUpload);

  sendRequest(RestVerb.Post, BACKEND_URL + API.ARTWORK_GENERATION.FILE_UPLOAD, formData)
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
          hideSpinner(SpinnerId.FileUpload);
          setIsProcessingLoading(false);
        });
    })
    .catch((error: ApiResponse) => {
      sendToast(error.message, ToastType.Error);
      hideSpinner(SpinnerId.FileUpload);
      setIsProcessingLoading(false);
    });
};
