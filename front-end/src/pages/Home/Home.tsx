import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { is2xxSuccessful, sendRequest } from "../../common/Requests";
import { API, BACKEND_URL, PATHS, SPINNER_ID, TITLE, TOAST, TOAST_TYPE } from "../../constants/Common";

import { hideSpinner, showSpinner } from "../../common/Spinner";
import { sendToast } from "../../common/Toast";
import { Statistics } from "../../common/Types";
import useTitle from "../../common/UseTitle";

import "./Home.css";

const Home = (): JSX.Element => {
  useTitle(TITLE.HOME);

  const navigate = useNavigate();

  const [geniusToken, setGeniusToken] = useState("");
  const [stats, setStats] = useState<Statistics>({} as Statistics);

  const fetchStatistics = () => {
    sendRequest("GET", BACKEND_URL + API.STATISTICS).then((response) => {
      if (!is2xxSuccessful(response.status)) {
        sendToast(response.message, TOAST_TYPE.ERROR);
        return;
      }

      setStats(response.data as Statistics);
    }).catch((error) => {
      sendToast(error.message, TOAST_TYPE.ERROR);
    });
  };

  const fetchGeniusToken = () => {
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

  const hideAllStatsSpinners = () => {
    hideSpinner(SPINNER_ID.STATISTICS_FIRST_OPERATION);
    hideSpinner(SPINNER_ID.STATISTICS_LAST_OPERATION);
    hideSpinner(SPINNER_ID.STATISTICS_ARTWORK_GENERATION);
    hideSpinner(SPINNER_ID.STATISTICS_LYRICS_FETCHES);
  };
  const showAllStatsSpinners = () => {
    showSpinner(SPINNER_ID.STATISTICS_FIRST_OPERATION);
    showSpinner(SPINNER_ID.STATISTICS_LAST_OPERATION);
    showSpinner(SPINNER_ID.STATISTICS_ARTWORK_GENERATION);
    showSpinner(SPINNER_ID.STATISTICS_LYRICS_FETCHES);
  };

  useEffect(() => {
    const fetchAndSetData = () => {
      if (!window.location.href.endsWith(PATHS.home)) {
        navigate(PATHS.home);
        return;
      }

      const routeKey = location.pathname;
      const hasVisited = sessionStorage.getItem(routeKey);

      showAllStatsSpinners();
      fetchStatistics();
      hideAllStatsSpinners();

      if (!hasVisited) {
        fetchGeniusToken();
        sessionStorage.setItem(routeKey, "visited");
      }
    };

    fetchAndSetData();
  }, [navigate]);

  return (
    <div id="home">
      <div id="toast-container"></div>
      <span className="top-bot-spacer" />

      <h1>Home</h1>

      <div className="home navbar">
        <button type="button" onClick={() => navigate(PATHS.artworkGeneration)}>
          <span className="right">{TITLE.ARTWORK_GENERATION}</span>
        </button>
        <button type="button" onClick={() => navigate(PATHS.lyrics)}>
          <span className="right">{TITLE.LYRICS}</span>
        </button>
      </div>

      <div className="stats-board">
        <div className="stats-entry">
          <h3 className="stat-title">Date of First Operation</h3>
          <p className="stat-text" id={SPINNER_ID.STATISTICS_FIRST_OPERATION}>
            {stats.dateFirstOperation}
          </p>
        </div>

        <hr />

        <div className="stats-entry">
          <h3 className="stat-title">Date of Last Operation</h3>
          <p className="stat-text" id={SPINNER_ID.STATISTICS_LAST_OPERATION}>
            {stats.dateLastOperation}
          </p>
        </div>

        <hr />

        <div className="stats-entry">
          <h3 className="stat-title">Artwork Generations</h3>
          <p className="stat-text" id={SPINNER_ID.STATISTICS_ARTWORK_GENERATION}>
            {stats.artworkGenerations}
          </p>
        </div>

        <hr />

        <div className="stats-entry">
          <h3 className="stat-title">Genius Lyrics Fetches</h3>
          <p className="stat-text" id={SPINNER_ID.STATISTICS_LYRICS_FETCHES}>
            {stats.lyricsFetches}
          </p>
        </div>
      </div>

      <div className="hidden">
        <p>Genius Token: '{ geniusToken }'</p>
      </div>

      <span className="top-bot-spacer" />
    </div>
  );
};

export default Home;