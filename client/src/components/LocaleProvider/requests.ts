import { sendRequest } from "@/common/requests";
import { sendToast } from "@/common/Toast";
import { ApiResponse, RestVerb } from "@/common/types";
import { API, BACKEND_URL } from "@/constants/paths";
import { ToastType } from "@/constants/toasts";

import { LocaleChangeRequest } from "./types";

export const postLocaleChange = (body: LocaleChangeRequest) => {
  sendRequest(RestVerb.Post, BACKEND_URL + API.LOCALE, body)
    .then((response: ApiResponse) => {
      console.debug("Locale change response:", response.data?.message);
    })
    .catch((error) => {
      sendToast(error.message, ToastType.Error);
    });
};
