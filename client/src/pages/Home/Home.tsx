import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Statistics } from "@common/types";
import { useTitle } from "@common/useTitle";

import ToastContainer from "@/components/ToastContainer/ToastContainer";
import NavButton from "@components/NavButton";

import { TITLE } from "@constants/Common";
import { VIEW_PATHS } from "@constants/paths";

import { getGeniusToken, getStatistics } from "./requests";
import { hideAllStatsSpinners, showAllStatsSpinners } from "./spinners";
import StatisticsBoard from "./StatisticsBoard";

import "./Home.css";

const Home = (): JSX.Element => {
  useTitle(TITLE.HOME);

  const navigate = useNavigate();

  const [geniusToken, setGeniusToken] = useState("");
  const [stats, setStats] = useState<Statistics>({} as Statistics);

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

      <StatisticsBoard stats={stats} />

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