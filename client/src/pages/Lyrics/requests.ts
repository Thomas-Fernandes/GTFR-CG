import { is2xxSuccessful, sendRequest } from "@/common/requests";
import { sendToast } from "@/common/Toast";
import { RestVerb } from "@/common/types";
import { API, BACKEND_URL } from "@/constants/paths";
import { ToastType } from "@/constants/toasts";

export const isTokenSet = async (): Promise<boolean> => {
  return sendRequest(RestVerb.Get, BACKEND_URL + API.GENIUS_TOKEN)
    .then((response) => {
      return is2xxSuccessful(response.status) && response.data.token !== "";
    })
    .catch((error) => {
      sendToast(error.message, ToastType.Error);
      return false;
    });
};
