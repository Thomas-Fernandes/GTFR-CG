import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DisplayedStatistics } from "@common/Types";
import useTitle from "@common/UseTitle";

import { TITLE } from "@constants/Common";
import { STAT_NAME } from "@constants/Home";
import { VIEW_PATHS } from "@constants/Paths";
import { SPINNER_ID } from "@constants/Spinner";

import { getGeniusToken, getStatistics } from "./requests";
import { hideAllStatsSpinners, showAllStatsSpinners } from "./spinners";

import "./Home.css";

const Home = (): JSX.Element => {
  useTitle(TITLE.HOME);

  const navigate = useNavigate();

  const [geniusToken, setGeniusToken] = useState("");
  const [stats, setStats] = useState<DisplayedStatistics>({} as DisplayedStatistics);

  useEffect(() => {
    const fetchAndSetData = () => {
      if (!window.location.href.endsWith(VIEW_PATHS.home)) {
        navigate(VIEW_PATHS.home);
        return;
      }

      const routeKey = location.pathname;
      const hasVisited = sessionStorage.getItem(routeKey);

      showAllStatsSpinners();
      getStatistics(setStats);
      hideAllStatsSpinners();

      if (!hasVisited) {
        getGeniusToken(setGeniusToken);
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
        <div className="navbar-row">
          <button type="button" onClick={() => navigate(VIEW_PATHS.artworkGeneration)}>
            <span className="right">{TITLE.ARTWORK_GENERATION}</span>
          </button>
          <button type="button" onClick={() => navigate(VIEW_PATHS.lyrics)}>
            <span className="right">{TITLE.LYRICS}</span>
          </button>
        </div>
        <div className="navbar-row">
          <button type="button" onClick={() => navigate(VIEW_PATHS.cardsGeneration)}>
            <span className="right">{TITLE.CARDS_GENERATION}</span>
          </button>
        </div>
      </div>

      <div className="stats-board">
        <div className="stats-entry">
          <h3 className="stat-title">{STAT_NAME.DATE_FIRST_OPERATION}</h3>
          <p className="stat-text" id={SPINNER_ID.STATISTICS_FIRST_OPERATION}>
            {stats.dateFirstOperation}
          </p>
        </div>

        <hr />

        <div className="stats-entry">
          <h3 className="stat-title">{STAT_NAME.DATE_LAST_OPERATION}</h3>
          <p className="stat-text" id={SPINNER_ID.STATISTICS_LAST_OPERATION}>
            {stats.dateLastOperation}
          </p>
        </div>

        <hr />

        <div className="stats-entry">
          <h3 className="stat-title">{STAT_NAME.ARTWORK_GENERATIONS}</h3>
          <p className="stat-text" id={SPINNER_ID.STATISTICS_ARTWORK_GENERATION}>
            {stats.artworkGenerations}
          </p>
        </div>

        <hr />

        <div className="stats-entry">
          <h3 className="stat-title">{STAT_NAME.LYRICS_FETCHES}</h3>
          <p className="stat-text" id={SPINNER_ID.STATISTICS_LYRICS_FETCHES}>
            {stats.lyricsFetches}
          </p>
        </div>

        <hr />

        <div className="stats-entry">
          <h3 className="stat-title">{STAT_NAME.CARDS_GENERATED}</h3>
          <p className="stat-text" id={SPINNER_ID.STATISTICS_CARDS_GENERATION}>
            {stats.cardsGenerated}
          </p>
        </div>
      </div>

      <div className="tests navbar">
        <button type="button" onClick={() => navigate(VIEW_PATHS.tests)}>
          <span className="right">{TITLE.TESTS}</span>
        </button>
      </div>
      <div className="hidden">
        <p>Genius Token: '{ geniusToken }'</p>
      </div>

      <span className="top-bot-spacer" />
    </div>
  );
};

export default Home;