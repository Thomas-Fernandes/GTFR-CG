
import { is2xxSuccessful, sendRequest } from "@/common/requests";
import { sendToast } from "@/common/toast";
import { RestVerb, StateSetter } from "@/common/types";

import { API, BACKEND_URL } from "@/constants/paths";
import { Toast, ToastType } from "@/constants/toasts";

import { GeniusTokenResponse, Statistics, StatisticsResponse } from "./types";

export const getStatistics = (setStats: StateSetter<Statistics>) => {
  sendRequest(RestVerb.Get, BACKEND_URL + API.STATISTICS).then((response: StatisticsResponse) => {
    if (!is2xxSuccessful(response.status)) {
      sendToast(response.message, ToastType.Error);
      return;
    }

    const stats = response.data;
    const displayedStats = {
      dateFirstOperation: new Date(stats.dateFirstOperation).toLocaleString(),
      dateLastOperation: new Date(stats.dateLastOperation).toLocaleString(),
      artworkGenerations: stats.artworkGenerations.toLocaleString(),
      lyricsFetches: stats.lyricsFetches.toLocaleString(),
      cardsGenerated: stats.cardsGenerated.toLocaleString(),
    };
    setStats(displayedStats);
  }).catch((error) => {
    sendToast(error.message, ToastType.Error);
  });
};

export const getGeniusToken = (setGeniusToken: StateSetter<string>) => {
  sendRequest(RestVerb.Get, BACKEND_URL + API.GENIUS_TOKEN).then((response: GeniusTokenResponse) => {
    if (!is2xxSuccessful(response.status) || response.data.token === "") {
      sendToast(response.message, ToastType.Error, 10);
      sendToast(Toast.AddGeniusToken, ToastType.Warn, 20);
      return;
    }

    sendToast(Toast.Welcome, ToastType.Success, 5);
    setGeniusToken(response.data.token);
  }).catch((error) => {
    sendToast(error.message, ToastType.Error);
  });
};
