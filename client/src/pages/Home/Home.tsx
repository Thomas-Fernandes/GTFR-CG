import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "@/common/hooks/useTitle";
import { NavButtonSide } from "@/components/NavButton/constants";
import NavButton from "@/components/NavButton/NavButton";
import ToastContainer from "@/components/ToastContainer/ToastContainer";
import TopBotSpacer from "@/components/TopBotSpacer/TopBotSpacer";
import { Title } from "@/constants/browser";
import { ViewPaths } from "@/constants/paths";

import { defaultStatistics } from "./constants";
import { getGeniusToken, getStatistics } from "./requests";
import { hideAllStatsSpinners, showAllStatsSpinners } from "./spinners";
import StatisticsBoard from "./StatisticsBoard";
import { Statistics } from "./types";

import "./Home.scss";

const Home = () => {
  useTitle(Title.Home);

  const navigate = useNavigate();

  const [geniusToken, setGeniusToken] = useState("");
  const [stats, setStats] = useState<Statistics>(defaultStatistics);

  useEffect(() => {
    const fetchAndSetData = () => {
      if (!window.location.href.endsWith(ViewPaths.Home)) {
        navigate(ViewPaths.Home);
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
      <TopBotSpacer />

      <h1>{Title.Home}</h1>

      <div className="home navbar">
        <div className="navbar-row">
          <NavButton to={ViewPaths.ArtworkGeneration} label={Title.ArtworkGeneration} side={NavButtonSide.Right} />
          <NavButton to={ViewPaths.Lyrics} label={Title.Lyrics} side={NavButtonSide.Right} />
        </div>
        <div className="navbar-row">
          <NavButton to={ViewPaths.CardsGeneration} label={Title.CardsGeneration} side={NavButtonSide.Right} />
        </div>
      </div>

      <StatisticsBoard stats={stats} />

      <div className="tests navbar">
        <NavButton to={ViewPaths.Tests} label={Title.Tests} side={NavButtonSide.Right} />
      </div>

      <div className="hidden"> {/* avoid unused variable */}
        <p>{`Genius Token: '${geniusToken}'`}</p>
      </div>

      <TopBotSpacer />
    </div>
  );
};

export default Home;