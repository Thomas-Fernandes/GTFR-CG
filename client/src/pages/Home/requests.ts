import { is2xxSuccessful, sendRequest } from "@/common/requests";
import { sendToast } from "@/common/Toast";
import { RestVerb, StateSetter } from "@/common/types";
import { API, BACKEND_URL } from "@/constants/paths";
import { ToastType } from "@/constants/toasts";
import { getToasts } from "@/contexts";

import { hideAllStatsSpinners, showAllStatsSpinners } from "./spinners";
import { GeniusTokenResponse, Statistics, StatisticsResponse } from "./types";

export const getStatistics = (setStats: StateSetter<Statistics>) => {
  showAllStatsSpinners();
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
      lyricsFetches: stats.lyricsFetches.toString(),
      cardsGenerated: stats.cardsGenerated.toString(),
    };
    setStats(displayedStats);
  }).catch((error) => {
    sendToast(error.message, ToastType.Error);
  }).finally(() => {
    hideAllStatsSpinners();
  });
};

export const getGeniusToken = (setGeniusToken: StateSetter<string>) => {
  const toasts = getToasts();

  sendRequest(RestVerb.Get, BACKEND_URL + API.GENIUS_TOKEN).then((response: GeniusTokenResponse) => {
    if (!is2xxSuccessful(response.status) || response.data.token === "") {
      sendToast(response.message, ToastType.Error, 10);
      sendToast(toasts.Home.AddGeniusToken, ToastType.Warn, 20);
      return;
    }

    setGeniusToken(response.data.token);
  }).catch((error) => {
    sendToast(error.message, ToastType.Error);
  });
};
