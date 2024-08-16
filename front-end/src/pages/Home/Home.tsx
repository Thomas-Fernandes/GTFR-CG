import { JSX, useEffect, useState } from "react";

import { is2xxSuccessful, sendRequest } from "../../common/Requests";
import { BACKEND_URL, PATHS, SPINNER_ID, TITLE, TOAST, TOAST_TYPE } from "../../constants/Common";

import { sendToast } from "../../common/Toast";
import { Statistics } from "../../common/Types";
import useTitle from "../../common/UseTitle";

import { hideSpinner, showSpinner } from "../../common/Spinner";
import "./Home.css";

const fetchStatistics = async (): Promise<Statistics> => {
  const response = await sendRequest("GET", BACKEND_URL + "/statistics");

  if (!is2xxSuccessful(response.status)) {
    sendToast(response.message, TOAST_TYPE.ERROR);
    return {} as Statistics;
  }

  return response.data as Statistics;
};

const fetchGeniusToken = async (): Promise<string> => {
  const response = await sendRequest("GET", BACKEND_URL + "/genius-token");

  if (!is2xxSuccessful(response.status)) {
    sendToast(response.message, TOAST_TYPE.ERROR, 10);
    sendToast(TOAST.ADD_GENIUS_TOKEN, TOAST_TYPE.WARN, 20);
    return "";
  }

  sendToast(TOAST.WELCOME, TOAST_TYPE.SUCCESS, 5);
  return response.data;
};

const hideAllStatsSpinners = (): void => {
  hideSpinner(SPINNER_ID.STATISTICS_FIRST_OPERATION);
  hideSpinner(SPINNER_ID.STATISTICS_LAST_OPERATION);
  hideSpinner(SPINNER_ID.STATISTICS_ARTWORK_GENERATION);
  hideSpinner(SPINNER_ID.STATISTICS_LYRICS_FETCHES);
};
const showAllStatsSpinners = (): void => {
  showSpinner(SPINNER_ID.STATISTICS_FIRST_OPERATION);
  showSpinner(SPINNER_ID.STATISTICS_LAST_OPERATION);
  showSpinner(SPINNER_ID.STATISTICS_ARTWORK_GENERATION);
  showSpinner(SPINNER_ID.STATISTICS_LYRICS_FETCHES);
};

const Home = (): JSX.Element => {
  const [geniusToken, setGeniusToken] = useState("");
  const [stats, setStats] = useState<Statistics>({} as Statistics);

  useTitle(TITLE.HOME);

  useEffect(() => {
    const fetchAndSetData = async () => {
      if (!window.location.href.endsWith(PATHS.home)) {
        window.location.href = PATHS.home;
        return;
      }

      const routeKey = location.pathname;
      const hasVisited = sessionStorage.getItem(routeKey);

      showAllStatsSpinners();
      const stats = await fetchStatistics();
      setStats(stats);
      hideAllStatsSpinners();

      if (!hasVisited) {
        const token = await fetchGeniusToken();
        setGeniusToken(token);
        sessionStorage.setItem(routeKey, "visited");
      }
    };

    fetchAndSetData();
  }, []);

  return (
    <>
      <div id="toast-container"></div>
      <span className="top-bot-spacer" />

      <h1>Home</h1>

      <div className="home navbar">
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
          <p className="stat-text" id={SPINNER_ID.STATISTICS_FIRST_OPERATION}>{ stats.dateFirstOperation }</p>
        </div>

        <hr />

        <div className="stats-entry">
          <h3 className="stat-title">Date of Last Operation</h3>
          <p className="stat-text" id={SPINNER_ID.STATISTICS_LAST_OPERATION}>{ stats.dateLastOperation }</p>
        </div>

        <hr />

        <div className="stats-entry">
          <h3 className="stat-title">Artwork Generations</h3>
          <p className="stat-text" id={SPINNER_ID.STATISTICS_ARTWORK_GENERATION}>{ stats.artworkGenerations }</p>
        </div>

        <hr />

        <div className="stats-entry">
          <h3 className="stat-title">Genius Lyrics Fetches</h3>
          <p className="stat-text" id={SPINNER_ID.STATISTICS_LYRICS_FETCHES}>{ stats.lyricsFetches }</p>
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