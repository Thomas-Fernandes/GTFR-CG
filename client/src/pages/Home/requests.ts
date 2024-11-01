
import { is2xxSuccessful, sendRequest } from "@common/Requests";
import { sendToast } from "@common/Toast";
import { DisplayedStatistics, StateSetter, Statistics } from "@common/Types";

import { API, BACKEND_URL } from "@constants/Paths";
import { TOAST, TOAST_TYPE } from "@constants/Toast";

import "./Home.css";

export const getStatistics = (setStats: StateSetter<DisplayedStatistics>) => {
  sendRequest("GET", BACKEND_URL + API.STATISTICS).then((response) => {
    if (!is2xxSuccessful(response.status)) {
      sendToast(response.message, TOAST_TYPE.ERROR);
      return;
    }

    const stats = response.data as Statistics;
    setStats({
      dateFirstOperation: new Date(stats.dateFirstOperation).toLocaleString(),
      dateLastOperation: new Date(stats.dateLastOperation).toLocaleString(),
      artworkGenerations: stats.artworkGenerations.toLocaleString(),
      lyricsFetches: stats.lyricsFetches.toLocaleString(),
      cardsGenerated: stats.cardsGenerated.toLocaleString(),
    });
  }).catch((error) => {
    sendToast(error.message, TOAST_TYPE.ERROR);
  });
};

export const getGeniusToken = (setGeniusToken: StateSetter<string>) => {
  sendRequest("GET", BACKEND_URL + API.GENIUS_TOKEN).then((response) => {
    if (!is2xxSuccessful(response.status) || response.data.token === "") {
      sendToast(response.message, TOAST_TYPE.ERROR, 10);
      sendToast(TOAST.ADD_GENIUS_TOKEN, TOAST_TYPE.WARN, 20);
      return;
    }

    sendToast(TOAST.WELCOME, TOAST_TYPE.SUCCESS, 5);
    setGeniusToken(response.data.token);
  }).catch((error) => {
    sendToast(error.message, TOAST_TYPE.ERROR);
  });
};
