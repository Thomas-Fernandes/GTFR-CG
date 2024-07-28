import { JSX, useEffect, useState } from "react";

import { is2xxSuccessful, sendRequest } from "../../common/Requests";
import { BACKEND_URL, PATHS, TITLE, TOAST, TOAST_TYPE } from "../../constants/Common";

import { sendToast } from "../../common/Toast";
import { ApiResponse, Statistics } from "../../common/Types";
import useTitle from "../../common/UseTitle";

import "./Home.css";

const fetchStatistics = (): Statistics => {
  sendRequest("GET", BACKEND_URL + "/statistics").then((response: ApiResponse) => {
    if (!is2xxSuccessful(response.status)) {
      throw new Error("");
    }

    return response.data as Statistics;
  }).catch((error: ApiResponse) => {
    sendToast(error.message, TOAST_TYPE.ERROR);
  });
  return {} as Statistics;
};

const fetchGeniusToken = (): string => {
  sendRequest("GET", BACKEND_URL + "/genius-token").then((response: ApiResponse) => {
    if (!is2xxSuccessful(response.status)) {
      throw new Error(TOAST.GENIUS_TOKEN_NOT_FOUND);
    }

    sendToast(TOAST.WELCOME, TOAST_TYPE.SUCCESS, 5);
    return response.data;
  }).catch((error: ApiResponse) => {
    sendToast(error.message, TOAST_TYPE.ERROR, 10);
    sendToast(TOAST.ADD_GENIUS_TOKEN, TOAST_TYPE.WARN, 20);
  });
  return "";
};

const Home = (): JSX.Element => {
  const [geniusToken, setGeniusToken] = useState("");
  const [stats, setStats] = useState<Statistics>({} as Statistics);

  useTitle(TITLE.HOME);

  useEffect(() => {
    if (!window.location.href.endsWith(PATHS.home)) {
      window.location.href = PATHS.home;
      return;
    }

    const routeKey = location.pathname;
    const hasVisited = sessionStorage.getItem(routeKey);

    setStats(fetchStatistics());

    if (!hasVisited) {
      setGeniusToken(fetchGeniusToken());
      sessionStorage.setItem(routeKey, "visited");
    }
  }, []);

  return (
    <>
      <div id="toast-container"></div>
      <span className="top-bot-spacer" />

      <h1>Home</h1>

      <div className="navbar">
        <button type="button" onClick={() => { window.location.href = PATHS.artworkGeneration }}>
          <span className="right">{TITLE.ARTWORK_GENERATION}</span>
        </button>
        <button type="button" onClick={() => { window.location.href = PATHS.lyrics }}>
          <span className="right">{TITLE.LYRICS}</span>
        </button>
      </div>

      <div className="stats-board">
        <div className="stats-entry">
          <h3 className="stat-title">Date of First Operation</h3>
          <p className="stat-text">{ stats.dateFirstOperation }</p>
        </div>

        <hr />

        <div className="stats-entry">
          <h3 className="stat-title">Date of Last Operation</h3>
          <p className="stat-text">{ stats.dateLastOperation }</p>
        </div>

        <hr />

        <div className="stats-entry">
          <h3 className="stat-title">Artwork Generations</h3>
          <p className="stat-text">{ stats.artworkGenerations }</p>
        </div>

        <hr />

        <div className="stats-entry">
          <h3 className="stat-title">Genius Lyrics Fetches</h3>
          <p className="stat-text">{ stats.lyricsFetches }</p>
        </div>
      </div>

      <div className="hidden">
        <p>{ geniusToken }</p>
      </div>

      <span className="top-bot-spacer" />
    </>
  );
};

export default Home;