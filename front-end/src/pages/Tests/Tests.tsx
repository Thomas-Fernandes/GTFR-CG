import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { is2xxSuccessful, sendRequest } from "../../common/Requests";
import { API, BACKEND_URL, PATHS, TITLE, TOAST, TOAST_TYPE } from "../../constants/Common";

import { sendToast } from "../../common/Toast";
import { Statistics } from "../../common/Types";
import useTitle from "../../common/UseTitle";

import "./Tests.css";

const Tests = (): JSX.Element => {
  useTitle(TITLE.TESTS);

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

  useEffect(() => {
    const fetchAndSetData = () => {
      if (!window.location.href.endsWith(PATHS.tests)) {
        navigate(PATHS.tests);
        return;
      }

      const routeKey = location.pathname;
      const hasVisited = sessionStorage.getItem(routeKey);

      fetchStatistics();

      if (!hasVisited) {
        fetchGeniusToken();
        sessionStorage.setItem(routeKey, "visited");
      }
    };

    fetchAndSetData();
  }, [navigate]);

  return (
    <div id="tests">
      <div id="toast-container"></div>
      <span className="top-bot-spacer" />

      <div className="navbar">
        <button type="button" onClick={() => navigate(PATHS.home)}>
          <span className="left">{TITLE.HOME}</span>
        </button>
      </div>

      <h1>Tests</h1>

      <div className="stats-board">
      </div>

      <span className="top-bot-spacer" />
    </div>
  );
};

export default Tests;