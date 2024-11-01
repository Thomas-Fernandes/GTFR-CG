import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DisplayedStatistics } from "@common/types";
import { useTitle } from "@common/useTitle";

import NavButton from "@components/NavButton";
import ToastContainer from "@components/ToastContainer";

import { TITLE } from "@constants/Common";
import { VIEW_PATHS } from "@constants/paths";
import { SPINNER_ID } from "@constants/spinners";
import { STAT_NAME } from "@constants/statistics";

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
      <ToastContainer />
      <span className="top-bot-spacer" />

      <h1>{TITLE.HOME}</h1>

      <div className="home navbar">
        <div className="navbar-row">
          <NavButton to={VIEW_PATHS.artworkGeneration} label={TITLE.ARTWORK_GENERATION} side="right" />
          <NavButton to={VIEW_PATHS.lyrics} label={TITLE.LYRICS} side="right" />
        </div>
        <div className="navbar-row">
          <NavButton to={VIEW_PATHS.cardsGeneration} label={TITLE.CARDS_GENERATION} side="right" />
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