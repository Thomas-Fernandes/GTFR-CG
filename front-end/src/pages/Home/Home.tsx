import { useEffect, useState } from "react";

import { BACKEND_URL, PATHS, TITLE, TOAST, TOAST_TYPE } from "../../common/Constants";
import { is2xxSuccessful, sendRequest } from "../../common/Requests";

import { sendToast } from "../../common/Toast";
import { Statistics } from "../../common/Types";
import useTitle from "../../common/UseTitle";

import "./Home.css";

const fetchStatistics = (): Statistics => {
  sendRequest("GET", BACKEND_URL + "/statistics").then((response) => {
    if (is2xxSuccessful(response.status)) {
      return response.data as Statistics;
    } else {
      throw new Error("");
    }
  }).catch((error) => {
    sendToast(error.message, TOAST_TYPE.ERROR);
  });
  return {} as Statistics;
};

const fetchGeniusToken = (): string => {
  sendRequest("GET", BACKEND_URL + "/genius-token").then((response) => {
    if (is2xxSuccessful(response.status)) {
      sendToast(TOAST.WELCOME, TOAST_TYPE.SUCCESS, 5);
      return response.data;
    } else {
      throw new Error(TOAST.GENIUS_TOKEN_NOT_FOUND);
    }
  }).catch((error) => {
    sendToast(error.message, TOAST_TYPE.ERROR, 10);
    sendToast(TOAST.ADD_GENIUS_TOKEN, TOAST_TYPE.WARN, 20);
  });
  return "";
};

const Home = (): React.JSX.Element => {
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
      <span className="top-bot-spacer"></span>

      <h1>Home</h1>

      <div className="navbar">
        <button type="button" onClick={() => { window.location.href = PATHS.artworkGeneration; }}>
          <span className="right">Artwork Generation</span>
        </button>
        <button type="button" onClick={() => { window.location.href = PATHS.lyrics; }}>
          <span className="right">Lyrics</span>
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

      <span className="top-bot-spacer"></span>
    </>
  );
};

export default Home;